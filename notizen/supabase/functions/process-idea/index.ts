// Auto-Filing & Verknüpfung: Embedding (Voyage) -> Kandidaten -> Claude-Haiku-Entscheidung.
// Eigenständige Datei (keine Shared-Imports), damit sie direkt im
// Supabase-Dashboard-Editor per Copy-Paste angelegt werden kann.
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CLAUDE_HAIKU_MODEL = 'claude-haiku-4-5-20251001'
const FOLDER_AUTO_THRESHOLD = 0.7
const FOLDER_REVIEW_THRESHOLD = 0.4
const LINK_THRESHOLD = 0.55
const RELATIONS = ['related', 'builds_on', 'contradicts', 'example_of', 'question_for']

async function embedText(text: string, inputType: 'document' | 'query'): Promise<number[]> {
  const apiKey = Deno.env.get('VOYAGE_API_KEY')
  if (!apiKey) throw new Error('VOYAGE_API_KEY ist nicht gesetzt')
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: [text.slice(0, 8000)],
      model: 'voyage-3-lite',
      input_type: inputType,
      output_dimension: 512,
    }),
  })
  if (!res.ok) throw new Error(`Voyage-Embedding fehlgeschlagen: ${res.status} ${await res.text()}`)
  const json = await res.json()
  return json.data[0].embedding as number[]
}

async function callClaudeTool(
  system: string,
  userMessage: string,
  tool: { name: string; description: string; input_schema: Record<string, unknown> },
): Promise<Record<string, unknown>> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY ist nicht gesetzt')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_HAIKU_MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userMessage }],
      tools: [tool],
      tool_choice: { type: 'tool', name: tool.name },
    }),
  })
  if (!res.ok) throw new Error(`Claude-Aufruf fehlgeschlagen: ${res.status} ${await res.text()}`)
  const json = await res.json()
  const toolUse = (json.content as Array<{ type: string; name?: string; input?: unknown }>).find(
    (b) => b.type === 'tool_use',
  )
  if (!toolUse) throw new Error('Claude hat keinen Tool-Aufruf zurückgegeben')
  return toolUse.input as Record<string, unknown>
}

const SYSTEM_PROMPT = `Du bist ein Einsortierungs- und Verknüpfungsassistent für eine persönliche Ideen-App.
Du bekommst den Text einer neuen Idee, eine Liste von Kandidaten-Ordnern und eine Liste von
Kandidaten-Ideen (jeweils mit Ähnlichkeits-Score). Entscheide, in welchen Ordner die Idee am besten
passt (oder ob ein neuer Ordner sinnvoller wäre), und welche der Kandidaten-Ideen sinnvoll damit
verknüpft werden sollten. Sei zurückhaltend mit hoher Konfidenz — nur wenn der Ordner/die Verknüpfung
inhaltlich wirklich passt.`

const TOOL = {
  name: 'file_and_link_idea',
  description: 'Ordnet eine Idee einem Ordner zu und verknüpft sie mit verwandten Ideen.',
  input_schema: {
    type: 'object',
    properties: {
      folder_decision: {
        type: 'object',
        properties: {
          folder_id: { type: ['string', 'null'] },
          new_folder_suggestion: { type: ['string', 'null'] },
          confidence: { type: 'number' },
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
            relation: { type: 'string', enum: RELATIONS },
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
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
    } = await userClient.auth.getUser()
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

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

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

    const { data: candidateFolders } = await admin.rpc('match_folders', {
      p_user_id: user.id,
      p_query_embedding: embedding,
      p_match_count: 5,
    })
    const { data: candidateIdeas } = await admin.rpc('match_ideas', {
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

    const decision = await callClaudeTool(SYSTEM_PROMPT, userMessage, TOOL)
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
