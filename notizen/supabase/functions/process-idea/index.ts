import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { createAdminClient, getAuthenticatedUser } from '../_shared/supabaseClients.ts'
import { embedText } from '../_shared/voyage.ts'
import { callClaudeTool, CLAUDE_HAIKU_MODEL } from '../_shared/anthropic.ts'

const FOLDER_AUTO_THRESHOLD = 0.7
const FOLDER_REVIEW_THRESHOLD = 0.4
const LINK_THRESHOLD = 0.55

const RELATIONS = ['related', 'builds_on', 'contradicts', 'example_of', 'question_for'] as const

const SYSTEM_PROMPT = `Du bist ein Einsortierungs- und Verknüpfungsassistent für eine persönliche Ideen-App.
Du bekommst den Text einer neuen Idee, eine Liste von Kandidaten-Ordnern und eine Liste von
Kandidaten-Ideen (jeweils mit Ähnlichkeits-Score). Entscheide, in welchen Ordner die Idee am besten
passt (oder ob ein neuer Ordner sinnvoller wäre), und welche der Kandidaten-Ideen sinnvoll damit
verknüpft werden sollten. Sei zurückhaltend mit hoher Konfidenz — nur wenn der Ordner/die Verknüpfung
inhaltlich wirklich passt.`

const TOOL_SCHEMA = {
  name: 'file_and_link_idea',
  description: 'Ordnet eine Idee einem Ordner zu und verknüpft sie mit verwandten Ideen.',
  input_schema: {
    type: 'object',
    properties: {
      folder_decision: {
        type: 'object',
        properties: {
          folder_id: { type: ['string', 'null'], description: 'ID des gewählten Kandidaten-Ordners oder null' },
          new_folder_suggestion: {
            type: ['string', 'null'],
            description: 'Vorschlag für einen neuen Ordnernamen, falls kein Kandidat passt',
          },
          confidence: { type: 'number', description: '0..1' },
          reasoning: { type: 'string' },
        },
        required: ['confidence', 'reasoning'],
      },
      links: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            idea_id: { type: 'string' },
            relation: { type: 'string', enum: RELATIONS as unknown as string[] },
            confidence: { type: 'number' },
          },
          required: ['idea_id', 'relation', 'confidence'],
        },
      },
    },
    required: ['folder_decision', 'links'],
  },
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight

  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { ideaId } = await req.json()
    if (!ideaId) {
      return new Response(JSON.stringify({ error: 'ideaId fehlt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const admin = createAdminClient()

    const { data: idea, error: ideaError } = await admin
      .from('ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single()
    if (ideaError || !idea) {
      return new Response(JSON.stringify({ error: 'Idee nicht gefunden' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const text = `${idea.title}\n\n${idea.content_text ?? ''}`.trim()
    if (!text) {
      return new Response(JSON.stringify({ skipped: true, reason: 'Idee ist leer' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const embedding = await embedText(text, 'document')
    await admin.from('ideas').update({ embedding }).eq('id', ideaId)

    const { data: candidateFolders = [] } = await admin.rpc('match_folders', {
      p_user_id: user.id,
      p_query_embedding: embedding,
      p_match_count: 5,
    })

    const { data: candidateIdeas = [] } = await admin.rpc('match_ideas', {
      p_user_id: user.id,
      p_query_embedding: embedding,
      p_exclude_id: ideaId,
      p_match_count: 10,
      p_min_similarity: 0.3,
    })

    const userMessage = `Neue Idee:\nTitel: ${idea.title}\nText: ${idea.content_text ?? ''}

Kandidaten-Ordner:
${(candidateFolders ?? [])
  .map((f: { id: string; name: string; path: string; similarity: number }) => `- ${f.id} | ${f.name} (${f.path}) | Ähnlichkeit ${f.similarity.toFixed(2)}`)
  .join('\n') || '(keine)'}

Kandidaten-Ideen:
${(candidateIdeas ?? [])
  .map(
    (i: { id: string; title: string; content_text: string | null; similarity: number }) =>
      `- ${i.id} | "${i.title}" | ${(i.content_text ?? '').slice(0, 140)} | Ähnlichkeit ${i.similarity.toFixed(2)}`,
  )
  .join('\n') || '(keine)'}`

    const decision = await callClaudeTool({
      model: CLAUDE_HAIKU_MODEL,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      tool: TOOL_SCHEMA,
    })

    const folderDecision = decision.folder_decision as {
      folder_id: string | null
      new_folder_suggestion: string | null
      confidence: number
      reasoning: string
    }
    const links = (decision.links ?? []) as Array<{ idea_id: string; relation: string; confidence: number }>

    let folderId: string | null = null
    let autoFiled = false
    let needsReview = true

    if (folderDecision.folder_id && folderDecision.confidence >= FOLDER_AUTO_THRESHOLD) {
      folderId = folderDecision.folder_id
      autoFiled = true
      needsReview = false
    } else if (folderDecision.folder_id && folderDecision.confidence >= FOLDER_REVIEW_THRESHOLD) {
      folderId = folderDecision.folder_id
      autoFiled = true
      needsReview = true
    } else {
      folderId = null
      autoFiled = false
      needsReview = true
    }

    await admin
      .from('ideas')
      .update({
        folder_id: folderId,
        auto_filed: autoFiled,
        filing_confidence: folderDecision.confidence,
        needs_review: needsReview,
      })
      .eq('id', ideaId)

    await admin.from('filing_events').insert({
      idea_id: ideaId,
      decision,
      folder_id: folderId,
      confidence: folderDecision.confidence,
    })

    const confidentLinks = links.filter((l) => l.confidence >= LINK_THRESHOLD)
    if (confidentLinks.length > 0) {
      await admin.from('idea_links').upsert(
        confidentLinks.map((l) => ({
          user_id: user.id,
          source_id: ideaId,
          target_id: l.idea_id,
          relation: l.relation,
          score: l.confidence,
          origin: 'ai',
        })),
        { onConflict: 'source_id,target_id,relation' },
      )
    }

    return new Response(
      JSON.stringify({
        folder_id: folderId,
        confidence: folderDecision.confidence,
        needs_review: needsReview,
        links_created: confidentLinks.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
