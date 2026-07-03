import { Link, useParams } from 'react-router-dom'
import { journeys } from '../data'
import { relevanteTasks } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useProgress } from '../hooks/useProgress'
import CategoryBadge from '../components/CategoryBadge'

export default function JourneyOverview() {
  const { journeyId = '' } = useParams()
  const { profile } = useProfile()
  const journey = journeys.find(j => j.id === journeyId)
  const tasks = journey ? relevanteTasks(journey, profile) : []
  const taskIds = tasks.map(t => t.id)
  const { done, toggle, doneCount, loading } = useProgress(journeyId, taskIds)

  if (!journey) return <p className="p-6">Diese Reise gibt es nicht. <Link to="/" className="underline">Zur Startseite</Link></p>

  const total = tasks.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0
  const allDone = !loading && doneCount === total

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-8">
      <div>
        <Link to="/" className="text-sm text-pine underline underline-offset-2">← Zurück</Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-pine">{journey.title}</h1>
        <p className="mt-1 text-ink/80">{journey.subtitle}</p>
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
          <p className="mt-4 text-pine font-medium">
            Alles erledigt – stark! Du hast die wichtigsten Schritte hinter dir. 🎉
          </p>
        )}
      </section>

      <ul aria-label="Aufgaben" className="flex flex-col gap-4">
        {tasks.map(task => (
          <li key={task.id} className="rounded-card bg-cream-card border border-pine-mist p-5 shadow-sm flex gap-4 items-start">
            <input
              type="checkbox"
              checked={done[task.id] ?? false}
              onChange={() => toggle(task.id)}
              aria-label={`${task.title} als erledigt markieren`}
              className="mt-1 size-6 shrink-0 accent-[#F47B5B] rounded"
            />
            <Link to={`/journey/${journey.id}/task/${task.id}`} className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`font-display text-lg font-semibold ${done[task.id] ? 'text-ink/40 line-through' : 'text-pine'}`}>
                  {task.title}
                </h2>
                <CategoryBadge category={task.category} />
              </div>
              <p className="mt-1 text-sm text-ink/80">{task.summary}</p>
              <p className="mt-2 text-sm text-coral-deep font-medium">Frist: {task.deadline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
