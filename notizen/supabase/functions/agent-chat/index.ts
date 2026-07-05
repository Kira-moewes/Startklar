import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { createAdminClient, getAuthenticatedUser } from '../_shared/supabaseClients.ts'
import { embedText } from '../_shared/voyage.ts'
import { CLAUDE_SONNET_MODEL } from '../_shared/anthropic.ts'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const MAX_TOOL_ITERATIONS = 4

const SYSTEM_PROMPT = `Du bist ein kreativer Denkpartner in der persönlichen Ideen-App des Nutzers.
Du hast über das Werkzeug "search_ideas" Zugriff auf seine gesammelten Ideen. Wenn es hilfreich ist,
suche gezielt danach und beziehe dich konkret auf gefundene Ideen (nenne ihren Titel). Schlage neue
Blickwinkel, Kombinationen und Weiterentwicklungen vor — wiederhole nicht nur, was schon da steht.
Wenn der Nutzer eine Mindmap/Visualisierung sehen möchte, rufe das Werkzeug "render_mindmap" mit den
passenden Ideen-IDs auf, anstatt ein Diagramm in Textform zu beschreiben. Antworte auf Deutsch.`

const TOOLS = [
  {
    name: 'search_ideas',
    description: 'Durchsucht die gespeicherten Ideen des Nutzers per semantischer Ähnlichkeit.',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Suchanfrage in natürlicher Sprache' } },
      required: ['query'],
    },
  },
  {
    name: 'render_mindmap',
    description: 'Zeigt dem Nutzer eine Mindmap/einen Verknüpfungsgraphen ausgehend von bestimmten Ideen an.',
    input_schema: {
      type: 'object',
      properties: {
        seed_idea_ids: { type: 'array', items: { type: 'string' }, description: 'IDs der Ausgangs-Ideen' },
        depth: { type: 'integer', description: 'Anzahl der Hops im Verknüpfungsgraphen, Standard 2' },
      },
      required: ['seed_idea_ids'],
    },
  },
]

interface ContentBlock {
  type: string
  [key: string]: unknown
}

async function callClaude(messages: Array<{ role: string; content: unknown }>) {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY ist nicht gesetzt')

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: CLAUDE_SONNET_MODEL,
      max_tokens: 1536,
      system: SYSTEM_PROMPT,
      messages,
      tools: TOOLS,
    }),
  })

  if (!res.ok) {
    throw new Error(`Claude-Aufruf fehlgeschlagen: ${res.status} ${await res.text()}`)
  }

  return res.json()
}

async function executeTool(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  toolName: string,
  input: Record<string, unknown>,
): Promise<string> {
  if (toolName === 'search_ideas') {
    const query = String(input.query ?? '')
    const embedding = await embedText(query, 'query')
    const { data, error } = await admin.rpc('match_ideas', {
      p_user_id: userId,
      p_query_embedding: embedding,
      p_match_count: 8,
      p_min_similarity: 0.2,
    })
    if (error) return `Suche fehlgeschlagen: ${error.message}`
    if (!data || data.length === 0) return 'Keine passenden Ideen gefunden.'
    return data
      .map((i: { id: string; title: string; content_text: string | null }) => `- [${i.id}] "${i.title}": ${(i.content_text ?? '').slice(0, 200)}`)
      .join('\n')
  }

  if (toolName === 'render_mindmap') {
    const seedIds = (input.seed_idea_ids as string[]) ?? []
    const { data } = await admin.from('ideas').select('id, title').eq('user_id', userId).in('id', seedIds)
    const titles = (data ?? []).map((i: { title: string }) => i.title)
    return `Mindmap wird angezeigt für: ${titles.join(', ') || 'keine gültigen Ideen'}`
  }

  return `Unbekanntes Werkzeug: ${toolName}`
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

    const { conversationId, message } = await req.json()
    if (!message) {
      return new Response(JSON.stringify({ error: 'message fehlt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const admin = createAdminClient()

    let convId = conversationId as string | undefined
    if (convId) {
      const { data: conv } = await admin
        .from('agent_conversations')
        .select('id')
        .eq('id', convId)
        .eq('user_id', user.id)
        .single()
      if (!conv) convId = undefined
    }
    if (!convId) {
      const { data: newConv, error: convError } = await admin
        .from('agent_conversations')
        .insert({ user_id: user.id, title: message.slice(0, 60) })
        .select('id')
        .single()
      if (convError || !newConv) throw convError ?? new Error('Konversation konnte nicht erstellt werden')
      convId = newConv.id
    }

    await admin.from('agent_messages').insert({
      conversation_id: convId,
      role: 'user',
      content: [{ type: 'text', text: message }],
    })

    const { data: history } = await admin
      .from('agent_messages')
      .select('role, content')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })

    const messages = (history ?? []).map((m: { role: string; content: unknown }) => ({
      role: m.role,
      content: m.content,
    }))

    let finalText = ''
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const response = await callClaude(messages)
      const blocks = response.content as ContentBlock[]
      const toolUses = blocks.filter((b) => b.type === 'tool_use')

      await admin.from('agent_messages').insert({
        conversation_id: convId,
        role: 'assistant',
        content: blocks,
        referenced_idea_ids: null,
      })
      messages.push({ role: 'assistant', content: blocks })

      if (toolUses.length === 0) {
        finalText = blocks
          .filter((b) => b.type === 'text')
          .map((b) => b.text as string)
          .join('\n')
        break
      }

      const toolResults = await Promise.all(
        toolUses.map(async (block) => {
          const result = await executeTool(admin, user.id, block.name as string, block.input as Record<string, unknown>)
          return { type: 'tool_result', tool_use_id: block.id, content: result }
        }),
      )

      await admin.from('agent_messages').insert({
        conversation_id: convId,
        role: 'user',
        content: toolResults,
      })
      messages.push({ role: 'user', content: toolResults })
    }

    return new Response(JSON.stringify({ conversationId: convId, reply: finalText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
