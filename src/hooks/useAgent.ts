import { useCallback, useEffect, useRef, useState } from 'react'
import { agentChatStore } from '../lib/stores'
import { suche } from '../lib/retrieval'
import { wissensbasis } from '../data/agent/wissensbasis'
import { beantworteIntent, kontextZusammenfassung, type AgentKontext } from '../data/agent/intents'
import type { AgentAction, AgentLink, AgentMessage } from '../data/agent/types'
import { useSettings } from './useSettings'

const KEY = 'verlauf'
const MAX_NACHRICHTEN = 100
const MIN_TREFFER_PUNKTE = 3

function nutzerNachricht(text: string): AgentMessage {
  return { id: crypto.randomUUID(), rolle: 'nutzer', text, zeit: new Date().toISOString() }
}

function klaroNachricht(teil: Omit<AgentMessage, 'id' | 'rolle' | 'zeit'>): AgentMessage {
  return { id: crypto.randomUUID(), rolle: 'klaro', zeit: new Date().toISOString(), ...teil }
}

// Antwort aus dem Retrieval bauen (Stufe 2 der Pipeline)
function retrievalAntwort(frage: string): AgentMessage | null {
  const treffer = suche(frage, wissensbasis(), 3)
  if (treffer.length === 0 || treffer[0].punkte < MIN_TREFFER_PUNKTE) return null
  const bester = treffer[0].eintrag
  const links: AgentLink[] = treffer.map(t => ({
    label: t.eintrag.titel,
    route: t.eintrag.route,
  }))
  const hinweisUngeprueft = bester.ungeprueft
    ? ' (Einzelne Beträge/Fristen dazu werden gerade redaktionell geprüft.)'
    : ''
  const mehr = treffer.length > 1 ? ' Unten findest du auch verwandte Treffer.' : ''
  return klaroNachricht({
    text: `Dazu passt „${bester.titel}": ${bester.kurz}${hinweisUngeprueft}${mehr}`,
    links,
    quelle: 'lokal',
  })
}

// Cloud-Aufruf (Stufe 4) – nur bei aktivem KI-Modus.
async function kiAntwort(frage: string, verlauf: AgentMessage[], kontext: string | null): Promise<AgentMessage | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        frage,
        verlauf: verlauf.slice(-6).map(m => ({ rolle: m.rolle, text: m.text })),
        kontext: kontext ?? undefined,
      }),
    })
    if (!res.ok) return null
    const daten = await res.json()
    if (typeof daten?.text !== 'string') return null
    // Aktionen der Cloud-Antwort nur validiert übernehmen (bekannte Typen,
    // interne Routen) – der Server filtert bereits, hier zweite Sicherung.
    const actions: AgentAction[] = (Array.isArray(daten.actions) ? daten.actions : []).filter(
      (a: AgentAction) =>
        (a?.typ === 'navigiere' && typeof a.route === 'string' && a.route.startsWith('/') && typeof a.label === 'string') ||
        (a?.typ === 'termin-vorschlag' && typeof a.titel === 'string')
    )
    return klaroNachricht({
      text: daten.text,
      links: Array.isArray(daten.links) ? daten.links.filter((l: AgentLink) => typeof l?.route === 'string' && l.route.startsWith('/')) : undefined,
      actions: actions.length > 0 ? actions : undefined,
      quelle: 'ki',
    })
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export function useAgent() {
  const { einstellungen } = useSettings()
  const [nachrichten, setNachrichten] = useState<AgentMessage[]>([])
  const [laedt, setLaedt] = useState(true)
  const [antwortet, setAntwortet] = useState(false)
  const nachrichtenRef = useRef(nachrichten)
  nachrichtenRef.current = nachrichten

  useEffect(() => {
    void agentChatStore.getItem<AgentMessage[]>(KEY).then(list => {
      setNachrichten(list ?? [])
      setLaedt(false)
    })
  }, [])

  const persist = (next: AgentMessage[]) => {
    const begrenzt = next.slice(-MAX_NACHRICHTEN)
    setNachrichten(begrenzt)
    void agentChatStore.setItem(KEY, begrenzt)
  }

  const senden = useCallback(async (frage: string, ctx: AgentKontext) => {
    const text = frage.trim()
    if (!text || antwortet) return
    setAntwortet(true)
    const mitFrage = [...nachrichtenRef.current, nutzerNachricht(text)]
    persist(mitFrage)

    try {
      // Stufe 1: Intents (kennen deinen App-Zustand)
      let antwort = beantworteIntent(text, ctx)

      // Stufe 2: Retrieval über die Wissensbasis
      if (!antwort) antwort = retrievalAntwort(text)

      // Stufe 3/4: optional Cloud-KI, sonst ehrlicher Fallback
      if (!antwort) {
        if (einstellungen.kiModus) {
          const kontext = einstellungen.kiKontext ? kontextZusammenfassung(ctx) : null
          antwort = await kiAntwort(text, mitFrage, kontext)
          if (!antwort) {
            antwort = fallbackAntwort(text, 'Die KI ist gerade nicht erreichbar – hier ist, was ich lokal dazu finde:')
          }
        } else {
          antwort = fallbackAntwort(text)
        }
      }

      persist([...mitFrage, antwort])
    } finally {
      setAntwortet(false)
    }
  }, [antwortet, einstellungen.kiModus, einstellungen.kiKontext])

  const anhaengen = useCallback((teil: Omit<AgentMessage, 'id' | 'rolle' | 'zeit'>) => {
    persist([...nachrichtenRef.current, klaroNachricht(teil)])
  }, [])

  const leeren = useCallback(async () => {
    await agentChatStore.removeItem(KEY)
    setNachrichten([])
  }, [])

  return { nachrichten, senden, anhaengen, leeren, laedt, antwortet }
}

function fallbackAntwort(frage: string, prefix?: string): AgentMessage {
  const treffer = suche(frage, wissensbasis(), 3)
  const links = treffer.map(t => ({ label: t.eintrag.titel, route: t.eintrag.route }))
  if (links.length > 0) {
    return klaroNachricht({
      text: `${prefix ?? 'Da bin ich nicht ganz sicher – aber das hier kommt deiner Frage am nächsten:'}`,
      links,
      quelle: 'lokal',
    })
  }
  return klaroNachricht({
    text: prefix
      ? `${prefix} Leider habe ich dazu nichts gefunden. Versuch es mit anderen Worten – oder stöbere über die Suche.`
      : 'Dazu habe ich in der App nichts gefunden – und Dinge außerhalb von Startklar (z. B. Rechtsberatung) kann und darf ich nicht beurteilen. Versuch es mit anderen Worten oder schau in die Suche.',
    links: [{ label: 'Zur Suche', route: '/suche' }],
    quelle: 'lokal',
  })
}
