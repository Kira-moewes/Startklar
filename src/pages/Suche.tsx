import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { journeys } from '../data'
import { vergleichsKategorien } from '../data/vergleich'
import { istRelevant } from '../data/visibility'
import { normalisiere, tokensAus, passt } from '../data/suchen'
import { useProfile } from '../hooks/useProfile'
import CategoryBadge from '../components/CategoryBadge'
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
  imTitel: boolean
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

  const treffer = useMemo<Treffer[]>(() => {
    const tokens = tokensAus(query)
    const ergebnisse: Treffer[] = []
    for (const journey of journeys) {
      for (const task of journey.tasks) {
        if (filter && task.category !== filter) continue
        let imTitel = false
        if (tokens.length > 0) {
          const heuhaufen = normalisiere(
            [task.title, task.summary, task.deadline, task.consequence, ...task.steps].join(' ')
          )
          if (!passt(heuhaufen, tokens)) continue
          imTitel = passt(normalisiere(task.title), tokens)
        }
        ergebnisse.push({
          journeyId: journey.id,
          journeyTitel: journey.title,
          task,
          relevant: istRelevant(profile, journey.id) && istRelevant(profile, journey.id, task.id),
          imTitel,
        })
      }
    }
    // Für dich relevante Treffer zuerst, dann Titel-Treffer vor Text-Treffern
    return ergebnisse.sort(
      (a, b) => Number(b.relevant) - Number(a.relevant) || Number(b.imTitel) - Number(a.imTitel)
    )
  }, [query, filter, profile])

  const vergleichsTreffer = useMemo(() => {
    const tokens = tokensAus(query)
    if (tokens.length === 0) return []
    return vergleichsKategorien.filter(k =>
      passt(
        normalisiere([k.titel, k.intro, ...k.tipps, ...k.kriterien.map(kr => kr.label)].join(' ')),
        tokens
      )
    )
  }, [query])

  const suchen = (wert: string) => {
    setQuery(wert)
    setParams(wert ? { q: wert } : {}, { replace: true })
  }

  const zeigeErgebnisse = query.trim().length > 0 || filter !== null

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">Suche</h1>
        <p className="mt-2 text-lg text-ink/80">
          Wonach suchst du? Anmeldung, Kaution, Steuer – wir finden den passenden Schritt.
        </p>
      </div>

      <input
        type="search"
        value={query}
        onChange={e => suchen(e.target.value)}
        placeholder="z. B. Rundfunkbeitrag, Kaution, Führerschein …"
        autoFocus
        aria-label="Suchbegriff"
        className="rounded-field border-2 border-pine-mist bg-cream-card px-5 py-4 text-lg focus:outline-2 focus:outline-coral"
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Nach Kategorie filtern">
        {alleKategorien.map(k => (
          <button
            key={k}
            onClick={() => setFilter(filter === k ? null : k)}
            aria-pressed={filter === k}
            className={`rounded-pill px-4 py-2 text-sm font-display font-medium transition border ${
              filter === k
                ? 'bg-pine text-cream border-pine'
                : 'bg-cream-card text-pine border-pine-mist hover:border-coral'
            }`}
          >
            {kategorieLabels[k]}
          </button>
        ))}
      </div>

      {zeigeErgebnisse && (
        <section aria-live="polite" className="flex flex-col gap-4">
          <p className="text-sm text-ink/60">
            {treffer.length === 0 && vergleichsTreffer.length === 0
              ? 'Nichts gefunden. Versuch es mit einem anderen Begriff – oder stöbere unten in den Bereichen.'
              : `${treffer.length} ${treffer.length === 1 ? 'Schritt' : 'Schritte'} gefunden${vergleichsTreffer.length > 0 ? ` · ${vergleichsTreffer.length} Vergleich${vergleichsTreffer.length === 1 ? '' : 'e'}` : ''}`}
          </p>

          {vergleichsTreffer.map(k => (
            <Link
              key={k.id}
              to={`/vergleich/${k.id}`}
              className="block rounded-card bg-pine p-5 text-cream hover:bg-forest transition"
            >
              <p className="text-xs font-display font-semibold uppercase tracking-widest text-coral">Anbieter-Vergleich</p>
              <p className="mt-1 font-display text-lg font-semibold">{k.titel} vergleichen</p>
              <p className="mt-1 text-sm text-cream/80">{k.intro}</p>
            </Link>
          ))}

          {treffer.map(t => (
            <Link
              key={`${t.journeyId}-${t.task.id}`}
              to={`/journey/${t.journeyId}/task/${t.task.id}`}
              className={`block rounded-card bg-cream-card border p-5 transition hover:border-coral ${t.relevant ? 'border-pine-mist' : 'border-pine-mist opacity-60'}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg font-semibold text-pine">{t.task.title}</p>
                <CategoryBadge category={t.task.category} />
                {!t.relevant && (
                  <span className="text-xs text-ink/50 rounded-pill border border-pine-mist px-2 py-0.5">
                    laut Profil gerade nicht relevant
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink/70">{t.task.summary}</p>
              <p className="mt-2 text-xs font-display font-semibold text-coral-deep uppercase tracking-wide">
                {t.journeyTitel}
              </p>
            </Link>
          ))}
        </section>
      )}

      {!zeigeErgebnisse && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold text-pine">Oder stöbere in deinen Bereichen</h2>
          {journeys.filter(j => istRelevant(profile, j.id)).map(j => (
            <Link
              key={j.id}
              to={`/journey/${j.id}`}
              className="block rounded-card bg-cream-card border border-pine-mist p-5 hover:border-coral transition"
            >
              <p className="font-display font-semibold text-pine">{j.title}</p>
              <p className="text-sm text-ink/70">{j.subtitle}</p>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}
