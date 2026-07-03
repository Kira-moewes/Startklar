import { Link } from 'react-router-dom'
import { journeys } from '../data'

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">Startklar</p>
        <h1 className="font-display text-3xl text-pine">Deine ersten Schritte in einer neuen Wohnung</h1>
        <p className="max-w-2xl text-base text-pine-soft">
          Hier findest du einfache Wege durch wichtige Aufgaben rund um den Einzug.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {journeys.map((journey) => (
          <Link
            key={journey.id}
            to={`/journey/${journey.id}`}
            className="rounded-[var(--radius-card)] border border-pine/10 bg-cream-card p-6 shadow-sm transition hover:-translate-y-0.5"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">Reise</p>
            <h2 className="mt-2 font-display text-2xl text-pine">{journey.title}</h2>
            <p className="mt-2 text-sm text-pine-soft">{journey.subtitle}</p>
            <p className="mt-4 text-sm font-medium text-pine">{journey.tasks.length} Schritte</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
