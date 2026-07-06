import { Link, useParams } from 'react-router-dom'
import { journeys } from '../data'
import { faktum, mitFakten } from '../data/fakten'
import { kategorie, vergleichFuerTask } from '../data/vergleich'
import { relevanteTasks } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useProgress } from '../hooks/useProgress'
import CategoryBadge from '../components/CategoryBadge'
import VergleichChip from '../components/VergleichChip'
import { artikel } from '../data/lernen'

export default function TaskDetail() {
  const { journeyId = '', taskId = '' } = useParams()
  const { profile } = useProfile()
  const journey = journeys.find(j => j.id === journeyId)
  const tasks = journey ? relevanteTasks(journey, profile) : []
  const taskIds = tasks.map(t => t.id)
  const { done, toggle } = useProgress(journeyId, taskIds)

  if (!journey) return <p className="p-6">Nicht gefunden. <Link to="/" className="underline">Zur Startseite</Link></p>
  const task = journey.tasks.find(t => t.id === taskId)
  if (!task) return <p className="p-6">Aufgabe nicht gefunden. <Link to={`/journey/${journey.id}`} className="underline">Zur Übersicht</Link></p>

  const idx = tasks.findIndex(t => t.id === taskId)
  const naechsterOffener = tasks.slice(idx + 1).find(t => !done[t.id])
  const isDone = done[task.id] ?? false
  const factEntries = (task.faktenKeys ?? []).map(key => faktum(key)).filter(Boolean)
  const hasUnverified = factEntries.some(entry => entry?.geprueft === null)
  const latestDate = factEntries
    .map(entry => entry?.geprueft)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-8">
      <div>
        <Link to={`/journey/${journey.id}`} className="text-sm text-pine underline underline-offset-2">← Zur Übersicht</Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold text-pine">{task.title}</h1>
          <CategoryBadge category={task.category} />
        </div>
        <p className="mt-2 text-lg text-ink/80">{task.summary}</p>
      </div>

      <section aria-label="Schritt für Schritt" className="rounded-card bg-cream-card border border-pine-mist p-6">
        <h2 className="font-display text-xl font-semibold text-pine">So gehst du vor</h2>
        <ol className="mt-4 flex flex-col gap-4">
          {task.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-pine text-cream font-display font-semibold text-sm">{i + 1}</span>
              <div className="pt-1 flex-1">
                <p>{mitFakten(step)}</p>
                {task.vergleichAbSchritt === i + 1 && (
                  <div className="mt-2">
                    <VergleichChip journeyId={journey.id} taskId={task.id} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Was, wenn nicht?" className="rounded-card border-2 border-pine-mist bg-cream p-6">
        <h2 className="font-display text-xl font-semibold text-pine">Was, wenn nicht?</h2>
        <p className="mt-2"><span className="font-medium text-coral-deep">Frist:</span> {mitFakten(task.deadline)}</p>
        <p className="mt-2 text-ink/90">{mitFakten(task.consequence)}</p>
        {task.faktenKeys && task.faktenKeys.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {hasUnverified ? (
              <span className="rounded-full bg-[#f9d9d3] px-3 py-1 text-[#a84a3a]">Wird gerade geprüft</span>
            ) : latestDate ? (
              <span className="text-ink/70">Zuletzt geprüft am {latestDate}</span>
            ) : null}
          </div>
        )}
      </section>

      {(vergleichFuerTask[`${journey.id}:${task.id}`] ?? []).length > 0 && (
        <section aria-label="Passender Vergleich" className="rounded-card bg-pine p-6 text-cream">
          <h2 className="font-display text-xl font-semibold">Anbieter vergleichen</h2>
          <p className="mt-1 text-cream/85">Zu diesem Schritt gibt es einen neutralen Vergleich – trag deine Angebote ein und behalte den Überblick.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {(vergleichFuerTask[`${journey.id}:${task.id}`] ?? []).map(katId => {
              const kat = kategorie(katId)
              if (!kat) return null
              return (
                <Link
                  key={katId}
                  to={`/vergleich/${katId}`}
                  className="rounded-pill bg-coral px-5 py-2.5 font-display font-semibold text-white hover:bg-coral-deep transition"
                >
                  {kat.titel} →
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {(task.lernArtikel ?? []).length > 0 && (
        <section aria-label="Zum Weiterlesen" className="rounded-card bg-cream-card border border-pine-mist p-6">
          <h2 className="font-display text-xl font-semibold text-pine">Zum Weiterlesen</h2>
          <div className="mt-3 flex flex-col gap-3">
            {(task.lernArtikel ?? []).map(id => {
              const a = artikel(id)
              if (!a) return null
              return (
                <Link key={id} to={`/lernen/${a.id}`} className="rounded-field border border-pine-mist p-3 hover:border-coral transition">
                  <p className="font-display font-semibold text-pine">📖 {a.titel}</p>
                  <p className="text-sm text-ink/70">{a.teaser} · {a.minuten} Min.</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => toggle(task.id)}
          className={`flex-1 min-h-14 rounded-pill px-8 font-display text-lg font-semibold transition ${isDone ? 'bg-pine text-cream active:bg-pine-soft' : 'bg-coral text-white active:bg-coral-deep'}`}
        >
          {isDone ? '✓ Erledigt – rückgängig machen' : 'Als erledigt markieren'}
        </button>
        <Link
          to={`/termine?neu=1&titel=${encodeURIComponent(task.title)}&journey=${journey.id}&task=${task.id}`}
          className="min-h-14 rounded-pill border-2 border-pine px-8 font-display text-lg font-semibold text-pine flex items-center justify-center hover:bg-pine-mist/50 transition"
        >
          📅 Termin dazu anlegen
        </Link>
      </div>

      {isDone && naechsterOffener && (
        <p className="text-sm text-ink/70">
          Nächster Schritt:{' '}
          <Link
            to={`/journey/${journey.id}/task/${naechsterOffener.id}`}
            className="font-medium text-pine underline underline-offset-2 hover:text-coral-deep"
          >
            {naechsterOffener.title} →
          </Link>
        </p>
      )}
    </div>
  )
}
