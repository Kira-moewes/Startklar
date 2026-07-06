import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { thema, tasksFuerThema } from '../data/themen'
import { kategorie, vergleichFuerThema } from '../data/vergleich'
import { useProfile } from '../hooks/useProfile'
import { useTaskListProgress } from '../hooks/useProgress'
import CategoryBadge from '../components/CategoryBadge'
import VergleichChip from '../components/VergleichChip'

export default function Thema() {
  const { themaId = '' } = useParams()
  const { profile } = useProfile()
  const t = thema(themaId)
  const eintraege = useMemo(() => tasksFuerThema(themaId, profile), [themaId, profile])
  const items = useMemo(
    () => eintraege.map(e => ({ journeyId: e.journeyId, taskId: e.task.id })),
    [eintraege]
  )
  const { done, toggle, doneCount, loading } = useTaskListProgress(items)

  if (!t) {
    return (
      <p className="p-6">
        Dieses Thema gibt es nicht. <Link to="/" className="underline">Zur Startseite</Link>
      </p>
    )
  }

  const total = eintraege.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0
  const allDone = !loading && total > 0 && doneCount === total

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-8">
      <div>
        <Link to="/" className="text-sm text-pine underline underline-offset-2">← Zurück</Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-pine">
          <span aria-hidden="true">{t.icon}</span> {t.titel}
        </h1>
        <p className="mt-1 text-ink/80">{t.beschreibung}</p>
      </div>

      <section aria-label="Fortschritt" className="rounded-card bg-cream-card border border-pine-mist p-5">
        <div className="flex items-baseline justify-between">
          <p className="font-display font-semibold text-pine">{doneCount} von {total} erledigt</p>
          <p className="text-sm text-ink/60">{pct}%</p>
        </div>
        <div className="mt-3 h-3 rounded-pill bg-pine-mist overflow-hidden" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={total}>
          <div className="h-full rounded-pill bg-coral transition-all" style={{ width: `${pct}%` }} />
        </div>
        {allDone && (
          <p className="mt-4 text-pine font-medium">Alles erledigt – stark! 🎉</p>
        )}
      </section>

      {(vergleichFuerThema[t.id] ?? []).length > 0 && (
        <section aria-label="Dazu passt" className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-display font-semibold text-pine">Dazu passt:</span>
          {(vergleichFuerThema[t.id] ?? []).map(katId => {
            const kat = kategorie(katId)
            if (!kat) return null
            return (
              <Link
                key={katId}
                to={`/vergleich/${katId}`}
                className="rounded-pill bg-pine-mist px-3 py-1 text-sm font-display font-semibold text-pine hover:bg-coral hover:text-white transition"
              >
                {kat.titel} →
              </Link>
            )
          })}
        </section>
      )}

      {total === 0 && (
        <p className="rounded-card bg-cream-card border border-pine-mist p-6 text-ink/80">
          In diesem Thema steht laut deinem Profil gerade nichts an.
        </p>
      )}

      <ul aria-label="Aufgaben" className="flex flex-col gap-4">
        {eintraege.map(({ journeyId, journeyTitel, task }) => {
          const key = `${journeyId}:${task.id}`
          return (
            <li key={key} className="rounded-card bg-cream-card border border-pine-mist p-5 shadow-sm flex gap-4 items-start">
              <input
                type="checkbox"
                checked={done[key] ?? false}
                onChange={() => toggle(journeyId, task.id)}
                aria-label={`${task.title} als erledigt markieren`}
                className="mt-1 size-6 shrink-0 accent-[#F47B5B] rounded"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/journey/${journeyId}/task/${task.id}`} className="block">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className={`font-display text-lg font-semibold ${done[key] ? 'text-ink/40 line-through' : 'text-pine'}`}>
                      {task.title}
                    </h2>
                    <CategoryBadge category={task.category} />
                  </div>
                  <p className="mt-1 text-sm text-ink/80">{task.summary}</p>
                  <p className="mt-2 text-xs font-display font-semibold text-coral-deep uppercase tracking-wide">{journeyTitel}</p>
                </Link>
                <div className="mt-2">
                  <VergleichChip journeyId={journeyId} taskId={task.id} />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
