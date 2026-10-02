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
  // Abschalter: Der KI-Modus kostet Geld (Anthropic-API). Er läuft nur, wenn in
  // Vercel die Umgebungsvariable KI_MODUS_AKTIV=true gesetzt ist. Standard: aus.
  // Klaro antwortet dann lokal; der Client fällt bei !res.ok automatisch zurück.
  if (process.env.KI_MODUS_AKTIV !== 'true') {
    res.status(503).json({ fehler: 'KI-Modus ist abgeschaltet.' })
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ fehler: 'Nur POST.' })
    return
  }
  const origin = headerWert(req.headers['origin'])
  // Ohne Herkunftsangabe (z. B. direkter Skript-Aufruf) wird abgelehnt.
  if (!origin || !originErlaubt(origin, headerWert(req.headers['host']))) {
    res.status(403).json({ fehler: 'Nicht erlaubt.' })
    return
  }
  const clientId = headerWert(req.headers['x-forwarded-for']) ?? 'anonym'
  const { status, antwort } = await verarbeiteAgentAnfrage(req.body, process.env.ANTHROPIC_API_KEY, clientId)
  res.status(status).json(antwort)
}
