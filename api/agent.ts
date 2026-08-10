// Vercel-Adapter für Klaros KI-Modus – dünne Hülle um agentHandler,
// benötigt ANTHROPIC_API_KEY in den Vercel-Env-Variablen.
import { originErlaubt, verarbeiteAgentAnfrage } from '../src/server/agentHandler'

type VercelRequest = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}
type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
  end: () => void
}

function headerWert(h: string | string[] | undefined): string | undefined {
  return Array.isArray(h) ? h[0] : h
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS nur eigene Origin: kein Preflight-Erlauben, fremde Origins → 403.
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ fehler: 'Nur POST.' })
    return
  }
  if (!originErlaubt(headerWert(req.headers['origin']), headerWert(req.headers['host']))) {
    res.status(403).json({ fehler: 'Nicht erlaubt.' })
    return
  }
  const clientId = headerWert(req.headers['x-forwarded-for']) ?? 'anonym'
  const { status, antwort } = await verarbeiteAgentAnfrage(req.body, process.env.ANTHROPIC_API_KEY, clientId)
  res.status(status).json(antwort)
}
