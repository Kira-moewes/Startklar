const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

export interface AnthropicToolUse {
  type: 'tool_use'
  id: string
  name: string
  input: Record<string, unknown>
}

interface CallToolOptions {
  model: string
  system: string
  messages: Array<{ role: 'user' | 'assistant'; content: unknown }>
  tool: {
    name: string
    description: string
    input_schema: Record<string, unknown>
  }
  maxTokens?: number
}

/** Calls Claude with a single forced tool call and returns its parsed input. */
export async function callClaudeTool(options: CallToolOptions): Promise<Record<string, unknown>> {
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
      model: options.model,
      max_tokens: options.maxTokens ?? 1024,
      system: options.system,
      messages: options.messages,
      tools: [
        {
          name: options.tool.name,
          description: options.tool.description,
          input_schema: options.tool.input_schema,
        },
      ],
      tool_choice: { type: 'tool', name: options.tool.name },
    }),
  })

  if (!res.ok) {
    throw new Error(`Claude-Aufruf fehlgeschlagen: ${res.status} ${await res.text()}`)
  }

  const json = await res.json()
  const toolUse = (json.content as AnthropicToolUse[]).find((block) => block.type === 'tool_use')
  if (!toolUse) throw new Error('Claude hat keinen Tool-Aufruf zurückgegeben')
  return toolUse.input
}

export const CLAUDE_HAIKU_MODEL = 'claude-haiku-4-5-20251001'
export const CLAUDE_SONNET_MODEL = 'claude-sonnet-5'
