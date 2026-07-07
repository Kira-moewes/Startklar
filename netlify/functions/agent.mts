// Netlify Function für Klaros KI-Modus (Opt-in).
// Erreichbar unter /api/agent (Redirect in netlify.toml).
// Benötigt die Umgebungsvariable ANTHROPIC_API_KEY in den Netlify-Site-Settings.
import { originErlaubt, verarbeiteAgentAnfrage } from '../../src/server/agentHandler'

export default async (req: Request) => {
  // CORS nur eigene Origin: kein Preflight-Erlauben, fremde Origins → 403.
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }
  if (req.method !== 'POST') {
    return Response.json({ fehler: 'Nur POST.' }, { status: 405 })
  }
  if (!originErlaubt(req.headers.get('origin'), new URL(req.url).host)) {
    return Response.json({ fehler: 'Nicht erlaubt.' }, { status: 403 })
  }
  const body = await req.json().catch(() => null)
  const clientId = req.headers.get('x-nf-client-connection-ip')
    ?? req.headers.get('x-forwarded-for')
    ?? 'anonym'
  const { status, antwort } = await verarbeiteAgentAnfrage(body, process.env.ANTHROPIC_API_KEY, clientId)
  return Response.json(antwort, { status })
}
