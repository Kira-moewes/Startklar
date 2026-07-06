// Netlify Function für Klaros KI-Modus (Opt-in).
// Erreichbar unter /api/agent (Redirect in netlify.toml).
// Benötigt die Umgebungsvariable ANTHROPIC_API_KEY in den Netlify-Site-Settings.
import { verarbeiteAgentAnfrage } from '../../src/server/agentHandler'

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ fehler: 'Nur POST.' }, { status: 405 })
  }
  const body = await req.json().catch(() => null)
  const clientId = req.headers.get('x-nf-client-connection-ip')
    ?? req.headers.get('x-forwarded-for')
    ?? 'anonym'
  const { status, antwort } = await verarbeiteAgentAnfrage(body, process.env.ANTHROPIC_API_KEY, clientId)
  return Response.json(antwort, { status })
}
