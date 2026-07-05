// Brainstorming-Agent (Claude Sonnet) mit search_ideas- und render_mindmap-Tools.
// Eigenständige Datei (keine Shared-Imports), damit sie direkt im
// Supabase-Dashboard-Editor per Copy-Paste angelegt werden kann.
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CLAUDE_SONNET_MODEL = 'claude-sonnet-5'
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
        seed_idea_ids: { type: 'array', items: { type: 'string' } },
        depth: { type: 'integer' },
      },
      required: ['seed_idea_ids'],
    },
  },
]

async function embedText(text: string): Promise<number[]> {
  const apiKey = Deno.env.get('VOYAGE_API_KEY')
  if (!apiKey) throw new Error('VOYAGE_API_KEY ist nicht gesetzt')
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: [text.slice(0, 8000)], model: 'voyage-3-lite', input_type: 'query', output_dimension: 512 }),
  })
  if (!res.ok) throw new Error(`Voyage-Embedding fehlgeschlagen: ${res.status} ${await res.text()}`)
  const json = await res.json()
  return json.data[0].embedding as number[]
}

async function callClaude(messages: Array<{ role: string; content: unknown }>) {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY ist nicht gesetzt')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: CLAUDE_SONNET_MODEL, max_tokens: 1536, system: SYSTEM_PROMPT, messages, tools: TOOLS }),
  })
  if (!res.ok) throw new Error(`Claude-Aufruf fehlgeschlagen: ${res.status} ${await res.text()}`)
  return res.json()
}

async function executeTool(
  admin: ReturnType<typeof createClient>,
  userId: string,
  toolName: string,
  input: Record<string, unknown>,
): Promise<string> {
  if (toolName === 'search_ideas') {
    const embedding = await embedText(String(input.query ?? ''))
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

    const { conversationId, message } = await req.json()
    if (!message) {
      return new Response(JSON.stringify({ error: 'message fehlt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

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

    const messages = (history ?? []).map((m: { role: string; content: unknown }) => ({ role: m.role, content: m.content }))

    let finalText = ''
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const response = await callClaude(messages)
      const blocks = response.content as Array<{ type: string; [key: string]: unknown }>
      const toolUses = blocks.filter((b) => b.type === 'tool_use')

      await admin.from('agent_messages').insert({ conversation_id: convId, role: 'assistant', content: blocks })
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

      await admin.from('agent_messages').insert({ conversation_id: convId, role: 'user', content: toolResults })
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
