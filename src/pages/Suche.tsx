import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { journeys } from '../data'
import { vergleichsKategorien } from '../data/vergleich'
import { wissensbasis } from '../data/agent/wissensbasis'
import { istRelevant } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { suche } from '../lib/retrieval'
import CategoryBadge from '../components/CategoryBadge'
import PageHead from '../components/PageHead'
import type { Task, TaskCategory } from '../data/types'

const kategorieLabels: Record<TaskCategory, string> = {
  amt: 'Amt',
  versicherung: 'Versicherung',
  wohnen: 'Wohnen',
  finanzen: 'Finanzen',
  mobilitaet: 'Mobilität',
  gesundheit: 'Gesundheit',
  recht: 'Recht',
  arbeit: 'Arbeit',
}

type Treffer = {
  journeyId: string
  journeyTitel: string
  task: Task
  relevant: boolean
}

export default function Suche() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [filter, setFilter] = useState<TaskCategory | null>(null)
  const { profile } = useProfile()

  const alleKategorien = useMemo(() => {
    const set = new Set<TaskCategory>()
    journeys.forEach(j => j.tasks.forEach(t => set.add(t.category)))
    return [...set]
  }, [])

  // Gemeinsames Retrieval-Modul (wie Klaro): Tokenisierung, Synonyme,
  // Titel-/Präfix-Scoring – ein Suchindex, zwei Verbraucher.
  const suchTreffer = useMemo(() => {
    const q = query.trim()
    if (q.length === 0) return []
    return suche(q, wissensbasis(), 50)
  }, [query])

  const treffer = useMemo<Treffer[]>(() => {
    const zuTreffer = (journeyId: string, task: Task): Treffer => ({
      journeyId,
      journeyTitel: journeys.find(j => j.id === journeyId)?.title ?? '',
      task,
      relevant: istRelevant(profile, journeyId) && istRelevant(profile, journeyId, task.id),
    })

    let ergebnisse: Treffer[]
    if (query.trim().length > 0) {
      // Scoring-Reihenfolge des Retrievals beibehalten, Task-Objekte auflösen
      ergebnisse = []
      for (const t of suchTreffer) {
        if (t.eintrag.art !== 'task' || !t.eintrag.journeyId || !t.eintrag.taskId) continue
        const journey = journeys.find(j => j.id === t.eintrag.journeyId)
        const task = journey?.tasks.find(x => x.id === t.eintrag.taskId)
        if (!journey || !task) continue
        if (filter && task.category !== filter) continue
        ergebnisse.push(zuTreffer(journey.id, task))
      }
    } else {
      // Ohne Suchbegriff (nur Filter): alle Schritte der Kategorie
      ergebnisse = journeys.flatMap(j =>
        j.tasks.filter(t => !filter || t.category === filter).map(t => zuTreffer(j.id, t))
      )
    }
    // Für dich relevante Treffer zuerst (stabile Sortierung erhält das Scoring)
    return ergebnisse.sort((a, b) => Number(b.relevant) - Number(a.relevant))
  }, [suchTreffer, query, filter, profile])

  const vergleichsTreffer = useMemo(() => {
    const ids = new Set(
      suchTreffer.filter(t => t.eintrag.art === 'vergleich').map(t => t.eintrag.id.replace('vergleich:', ''))
    )
    return vergleichsKategorien.filter(k => ids.has(k.id))
  }, [suchTreffer])

  const suchen = (wert: string) => {
    setQuery(wert)
    setParams(wert ? { q: wert } : {}, { replace: true })
  }

  const zeigeErgebnisse = query.trim().length > 0 || filter !== null

  return (
    <div className="mx-auto max-w-[820px] w-full px-7 pt-14 pb-24 flex flex-col gap-7">
      <PageHead
        eyebrow="Suche"
        title={<><em className="text-olive">Finde</em>, was ansteht</>}
        intro="Wonach suchst du? Anmeldung, Kaution, Steuer – wir finden den passenden Schritt."
      />

      <div className="relative" style={{ animation: 'rise .7s var(--ease-out) .2s both' }}>
        <svg className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 size-5 text-pine/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => suchen(e.target.value)}
          placeholder="z. B. Rundfunkbeitrag, Kaution, Führerschein …"
          autoFocus
          aria-label="Suchbegriff"
          className="w-full rounded-pill border-[1.5px] border-pine/20 bg-cream-card pl-13 pr-5 py-4 text-lg transition focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/25"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Nach Kategorie filtern" style={{ animation: 'rise .7s var(--ease-out) .26s both' }}>
        {alleKategorien.map(k => (
          <button
            key={k}
            onClick={() => setFilter(filter === k ? null : k)}
            aria-pressed={filter === k}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition border-[1.5px] ${
              filter === k
                ? 'bg-pine text-cream border-pine'
                : 'bg-cream-card text-pine border-pine/20 hover:border-olive'
            }`}
          >
            {kategorieLabels[k]}
          </button>
        ))}
      </div>

      {zeigeErgebnisse && (
        <section aria-live="polite" className="flex flex-col gap-3.5">
          <p className="text-sm text-pine/60">
            {treffer.length === 0 && vergleichsTreffer.length === 0
              ? 'Nichts gefunden. Versuch es mit einem anderen Begriff – oder stöbere unten in den Bereichen.'
              : `${treffer.length} ${treffer.length === 1 ? 'Schritt' : 'Schritte'} gefunden${vergleichsTreffer.length > 0 ? ` · ${vergleichsTreffer.length} Vergleich${vergleichsTreffer.length === 1 ? '' : 'e'}` : ''}`}
          </p>

          {vergleichsTreffer.map(k => (
            <Link
              key={k.id}
              to={`/vergleich/${k.id}`}
              className="block rounded-[20px] bg-band p-5 text-paper transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(40,54,24,.2)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-olive-soft">Anbieter-Vergleich</p>
              <p className="mt-1.5 font-serif text-xl font-medium">{k.titel} vergleichen</p>
              <p className="mt-1 text-sm text-paper/75">{k.intro}</p>
            </Link>
          ))}

          {treffer.map(t => (
            <Link
              key={`${t.journeyId}-${t.task.id}`}
              to={`/journey/${t.journeyId}/task/${t.task.id}`}
              className={`group block rounded-[20px] bg-cream-card border p-5 transition duration-300 hover:border-olive hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(40,54,24,.08)] ${t.relevant ? 'border-pine/14' : 'border-pine/14 opacity-60'}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-serif text-xl font-medium text-pine transition-colors group-hover:text-olive-deep">{t.task.title}</p>
                <CategoryBadge category={t.task.category} />
                {!t.relevant && (
                  <span className="text-xs text-pine/50 rounded-pill border border-pine/20 px-2 py-0.5">
                    laut Profil gerade nicht relevant
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-pine/70">{t.task.summary}</p>
              <p className="mt-2.5 text-xs font-semibold text-olive uppercase tracking-[.14em]">
                {t.journeyTitel}
              </p>
            </Link>
          ))}
        </section>
      )}

      {!zeigeErgebnisse && (
        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl font-medium text-pine">Oder stöbere in deinen Bereichen</h2>
          {journeys.filter(j => istRelevant(profile, j.id)).map(j => (
            <Link
              key={j.id}
              to={`/journey/${j.id}`}
              className="group block rounded-[20px] bg-cream-card border border-pine/14 p-5 transition duration-300 hover:border-olive hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(40,54,24,.08)]"
            >
              <p className="font-serif text-xl font-medium text-pine transition-colors group-hover:text-olive-deep">{j.title}</p>
              <p className="text-sm text-pine/70">{j.subtitle}</p>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}
