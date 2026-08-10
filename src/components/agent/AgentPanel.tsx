import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { journeys } from '../../data'
import { istRelevant, relevanteTasks } from '../../data/visibility'
import { useProfile } from '../../hooks/useProfile'
import { markiereErledigt, useAllProgress } from '../../hooks/useProgress'
import { useTermine } from '../../hooks/useTermine'
import { useAgent } from '../../hooks/useAgent'
import { useAlleBedarfsErgebnisse } from '../../hooks/useBedarf'
import type { AgentAction } from '../../data/agent/types'
import type { AgentKontext } from '../../data/agent/intents'
import PaperPlane from '../PaperPlane'
import MessageBubble from './MessageBubble'
import ActionCard from './ActionCard'
import QuickChips from './QuickChips'

export default function AgentPanel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profile } = useProfile()
  const { termine } = useTermine()
  const bedarf = useAlleBedarfsErgebnisse()
  const [eingabe, setEingabe] = useState('')
  const [behandelt, setBehandelt] = useState<Set<string>>(new Set())
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listeRef = useRef<HTMLDivElement>(null)
  const { nachrichten, senden, anhaengen, leeren, antwortet } = useAgent()

  const journeyData = useMemo(
    () => journeys
      .filter(j => istRelevant(profile, j.id))
      .map(journey => {
        const tasks = relevanteTasks(journey, profile)
        return { journey, tasks, taskIds: tasks.map(t => t.id) }
      }),
    [profile]
  )
  const progressItems = useMemo(
    () => journeyData.map(jd => ({ journeyId: jd.journey.id, taskIds: jd.taskIds })),
    [journeyData]
  )
  const { progress } = useAllProgress(progressItems)

  const ctx: AgentKontext = useMemo(() => ({
    profile,
    bereiche: journeyData.map(jd => ({
      journey: jd.journey,
      tasks: jd.tasks,
      done: progress.find(p => p.journeyId === jd.journey.id)?.done ?? {},
    })),
    termine,
    bedarf,
  }), [profile, journeyData, progress, termine, bedarf])

  // Quick-Chips kontextabhängig (r3 §2.8): Standard-Trio; auf Task-Seiten
  // zusätzlich „Erklär mir diesen Schritt", auf /termine „Was ist überfällig?".
  const chips = useMemo(() => {
    const liste: Array<{ label: string; frage: string }> = []
    const taskMatch = pathname.match(/^\/journey\/([^/]+)\/task\/([^/]+)/)
    if (taskMatch) {
      const task = journeys.find(j => j.id === taskMatch[1])?.tasks.find(t => t.id === taskMatch[2])
      if (task) liste.push({ label: 'Erklär mir diesen Schritt', frage: `Erklär mir „${task.title}"` })
    }
    if (pathname.startsWith('/termine')) {
      liste.push({ label: 'Was ist überfällig?', frage: 'Was ist überfällig?' })
    }
    liste.push(
      { label: 'Nächster Schritt', frage: 'Was ist mein nächster Schritt?' },
      { label: 'Wie weit bin ich?', frage: 'Wie weit bin ich?' },
      { label: 'Was kannst du?', frage: 'Was kannst du?' },
    )
    return liste
  }, [pathname])

  // Fokus auf die Eingabe, Esc schließt, Tab bleibt im Panel
  useEffect(() => {
    inputRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !panelRef.current) return
      const fokusierbar = panelRef.current.querySelectorAll<HTMLElement>('button, input, a[href]')
      if (fokusierbar.length === 0) return
      const erste = fokusierbar[0]
      const letzte = fokusierbar[fokusierbar.length - 1]
      if (e.shiftKey && document.activeElement === erste) { e.preventDefault(); letzte.focus() }
      else if (!e.shiftKey && document.activeElement === letzte) { e.preventDefault(); erste.focus() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Immer ans Ende scrollen, wenn neue Nachrichten kommen
  useEffect(() => {
    listeRef.current?.scrollTo({ top: listeRef.current.scrollHeight })
  }, [nachrichten.length, antwortet])

  const frageSenden = (frage: string) => {
    setEingabe('')
    void senden(frage, ctx)
  }

  const geheZu = (route: string) => {
    onClose()
    navigate(route)
  }

  const aktionAusfuehren = async (action: AgentAction, key: string) => {
    setBehandelt(prev => new Set(prev).add(key))
    if (action.typ === 'navigiere') {
      geheZu(action.route)
      return
    }
    if (action.typ === 'termin-vorschlag') {
      const params = new URLSearchParams({ neu: '1' })
      if (action.titel) params.set('titel', action.titel)
      if (action.journeyId) params.set('journey', action.journeyId)
      if (action.taskId) params.set('task', action.taskId)
      geheZu(`/termine?${params.toString()}`)
      return
    }
    // erledigt-vorschlag: über die zentrale Fortschritts-Logik (Toggle wie im Hook)
    const jetztErledigt = await markiereErledigt(action.journeyId, action.taskId)
    anhaengen({
      text: jetztErledigt
        ? `✓ Erledigt – „${action.titel}" ist abgehakt. Stark!`
        : `„${action.titel}" ist wieder als offen markiert.`,
      links: [{ label: 'Zum Fortschritt', route: '/fortschritt' }],
      quelle: 'lokal',
    })
  }

  const letzteKlaro = [...nachrichten].reverse().find(m => m.rolle === 'klaro')

  return (
    <div className="fixed inset-0 z-[90]" role="presentation">
      {/* Abdunkelung */}
      <button aria-label="Klaro schließen" onClick={onClose} className="absolute inset-0 bg-band/50 cursor-default" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Klaro – dein Startklar-Assistent"
        className="absolute bg-cream flex flex-col overflow-hidden shadow-2xl
          inset-x-0 bottom-0 h-[85dvh] rounded-t-[24px]
          sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:h-auto sm:w-[420px] sm:rounded-none sm:border-l sm:border-pine/14"
        style={{ animation: 'panel-in .3s cubic-bezier(.2,.7,.2,1) both' }}
      >
        {/* Kopf */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-pine/14 bg-cream-card">
          <PaperPlane width={34} height={27} shadow={false} />
          <div className="flex-1 min-w-0">
            <p className="m-0 font-serif text-xl text-pine leading-tight">Klaro</p>
            <p className="m-0 text-[12.5px] text-pine/60">Kennt jede Ecke der App – antwortet auf deinem Gerät.</p>
          </div>
          {nachrichten.length > 0 && (
            <button onClick={() => void leeren()} className="text-[12.5px] text-pine/50 underline underline-offset-2 hover:text-olive transition">
              Verlauf löschen
            </button>
          )}
          <button onClick={onClose} aria-label="Schließen" className="size-9 rounded-full border border-pine/20 text-pine flex items-center justify-center hover:border-pine transition">
            ✕
          </button>
        </div>

        {/* Verlauf */}
        <div ref={listeRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" aria-live="polite">
          {nachrichten.length === 0 && (
            <div className="rounded-2xl rounded-bl-md bg-cream-card border border-pine/14 px-4 py-3">
              <p className="m-0 text-[15px] leading-relaxed text-pine/90">
                Hey! Ich bin Klaro. Frag mich alles zu deinen Schritten, Fristen und Funktionen von
                Startklar – ich zeig dir immer die richtige Stelle in der App. Deine Fragen bleiben
                auf deinem Gerät{ }
                <span className="text-pine/60">(außer du schaltest den KI-Modus in den Einstellungen ein)</span>.
              </p>
            </div>
          )}
          {nachrichten.map(msg => (
            <MessageBubble key={msg.id} msg={msg} onLink={geheZu} />
          ))}
          {/* Aktionsvorschläge der letzten Klaro-Nachricht */}
          {letzteKlaro?.actions?.map((action, i) => {
            const key = `${letzteKlaro.id}:${i}`
            if (behandelt.has(key)) return null
            return (
              <ActionCard
                key={key}
                action={action}
                onConfirm={a => void aktionAusfuehren(a, key)}
                onDecline={() => setBehandelt(prev => new Set(prev).add(key))}
              />
            )
          })}
          {antwortet && <p className="m-0 text-sm text-pine/50 italic">Klaro denkt nach …</p>}
        </div>

        {/* Chips + Eingabe */}
        <div className="px-5 pt-2 pb-4 border-t border-pine/14 bg-cream-card flex flex-col gap-3">
          <QuickChips chips={chips} onPick={frageSenden} disabled={antwortet} />
          <form
            className="flex gap-2"
            onSubmit={e => { e.preventDefault(); frageSenden(eingabe) }}
          >
            <input
              ref={inputRef}
              value={eingabe}
              onChange={e => setEingabe(e.target.value)}
              placeholder="Frag Klaro …"
              aria-label="Deine Frage an Klaro"
              className="flex-1 rounded-pill border-[1.5px] border-pine/20 bg-cream px-4.5 py-2.5 text-[15px] text-pine focus:outline-2 focus:outline-olive"
            />
            <button
              type="submit"
              disabled={antwortet || eingabe.trim().length === 0}
              className="rounded-pill bg-pine text-cream px-5 py-2.5 text-sm font-semibold hover:bg-olive transition disabled:opacity-50"
            >
              Senden
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
