import { Link, useParams } from 'react-router-dom'
import { journeys } from '../data'

export default function JourneyOverviewPage() {
  const { journeyId } = useParams()
  const journey = journeys.find((item) => item.id === journeyId)

  if (!journey) {
    return <p className="text-pine-soft">Diese Reise ist gerade nicht verfügbar.</p>
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">Übersicht</p>
        <h1 className="font-display text-3xl text-pine">{journey.title}</h1>
        <p className="text-pine-soft">{journey.subtitle}</p>
      </div>

      <div className="rounded-[var(--radius-card)] border border-pine/10 bg-cream-card p-6">
        <ul className="space-y-3">
          {journey.tasks.map((task) => (
            <li key={task.id} className="rounded-[var(--radius-field)] border border-pine/10 bg-cream p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl text-pine">{task.title}</h2>
                  <p className="mt-1 text-sm text-pine-soft">{task.summary}</p>
                </div>
                <Link to={`/journey/${journey.id}/task/${task.id}`} className="text-sm font-semibold text-coral">
                  Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
