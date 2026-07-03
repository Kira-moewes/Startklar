import { Link, useParams } from 'react-router-dom'
import { journeys } from '../data'

export default function TaskDetailPage() {
  const { journeyId, taskId } = useParams()
  const journey = journeys.find((item) => item.id === journeyId)
  const task = journey?.tasks.find((item) => item.id === taskId)

  if (!journey || !task) {
    return <p className="text-pine-soft">Diese Aufgabe ist gerade nicht verfügbar.</p>
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">Aufgabe</p>
        <h1 className="font-display text-3xl text-pine">{task.title}</h1>
        <p className="text-pine-soft">{task.summary}</p>
      </div>

      <div className="rounded-[var(--radius-card)] border border-pine/10 bg-cream-card p-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-xl text-pine">Schritte</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-pine-soft">
              {task.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-[var(--radius-field)] border border-coral/20 bg-cream p-4">
            <h2 className="font-display text-xl text-pine">Frist</h2>
            <p className="mt-2 text-pine-soft">{task.deadline}</p>
          </div>

          <div className="rounded-[var(--radius-field)] border border-coral/20 bg-cream p-4">
            <h2 className="font-display text-xl text-pine">Was, wenn nicht?</h2>
            <p className="mt-2 text-pine-soft">{task.consequence}</p>
          </div>
        </div>
      </div>

      <Link to={`/journey/${journey.id}`} className="text-sm font-semibold text-coral">
        Zurück zur Übersicht
      </Link>
    </section>
  )
}
