import { Link, useNavigate, useParams } from 'react-router-dom'
import { journeys } from '../data'
import { faktum } from '../data/fakten'
import { relevanteTasks } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useProgress } from '../hooks/useProgress'
import CategoryBadge from '../components/CategoryBadge'

export default function TaskDetail() {
  const { journeyId = '', taskId = '' } = useParams()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const journey = journeys.find(j => j.id === journeyId)
  const tasks = journey ? relevanteTasks(journey, profile) : []
  const taskIds = tasks.map(t => t.id)
  const { done, toggle } = useProgress(journeyId, taskIds)

  if (!journey) return <p className="p-6">Nicht gefunden. <Link to="/" className="underline">Zur Startseite</Link></p>
  const task = journey.tasks.find(t => t.id === taskId)
  if (!task) return <p className="p-6">Aufgabe nicht gefunden. <Link to={`/journey/${journey.id}`} className="underline">Zur Übersicht</Link></p>

  const idx = tasks.findIndex(t => t.id === taskId)
  const prev = tasks[idx - 1]
  const next = tasks[idx + 1]
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
              <p className="pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Was, wenn nicht?" className="rounded-card border-2 border-pine-mist bg-cream p-6">
        <h2 className="font-display text-xl font-semibold text-pine">Was, wenn nicht?</h2>
        <p className="mt-2"><span className="font-medium text-coral-deep">Frist:</span> {task.deadline}</p>
        <p className="mt-2 text-ink/90">{task.consequence}</p>
        <p className="mt-3 text-sm text-ink/60">Kein Grund zur Panik – jetzt weißt du ja Bescheid.</p>
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

      <button
        onClick={() => toggle(task.id)}
        className={`min-h-14 rounded-pill px-8 font-display text-lg font-semibold transition ${isDone ? 'bg-pine text-cream active:bg-pine-soft' : 'bg-coral text-white active:bg-coral-deep'}`}
      >
        {isDone ? '✓ Erledigt – rückgängig machen' : 'Als erledigt markieren'}
      </button>

      <nav aria-label="Aufgaben-Navigation" className="flex justify-between gap-4">
        {prev ? (
          <button onClick={() => navigate(`/journey/${journey.id}/task/${prev.id}`)} className="min-h-12 rounded-pill border-2 border-pine px-5 font-display font-semibold text-pine">← {prev.title}</button>
        ) : <span />}
        {next && (
          <button onClick={() => navigate(`/journey/${journey.id}/task/${next.id}`)} className="min-h-12 rounded-pill border-2 border-pine px-5 font-display font-semibold text-pine ml-auto">{next.title} →</button>
        )}
      </nav>
    </div>
  )
}
