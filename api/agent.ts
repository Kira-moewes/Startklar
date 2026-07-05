// Vercel-Adapter für Klaros KI-Modus – gleiche Logik wie die Netlify
// Function, benötigt ANTHROPIC_API_KEY in den Vercel-Env-Variablen.
import { verarbeiteAgentAnfrage } from '../src/server/agentHandler'

type VercelRequest = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}
type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ fehler: 'Nur POST.' })
    return
  }
  const forwarded = req.headers['x-forwarded-for']
  const clientId = (Array.isArray(forwarded) ? forwarded[0] : forwarded) ?? 'anonym'
  const { status, antwort } = await verarbeiteAgentAnfrage(req.body, process.env.ANTHROPIC_API_KEY, clientId)
  res.status(status).json(antwort)
}
