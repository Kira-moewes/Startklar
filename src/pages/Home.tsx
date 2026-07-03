import { Link } from 'react-router-dom'
import { journeys } from '../data'

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <p className="font-display text-sm font-semibold tracking-widest text-coral uppercase">Startklar</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-pine leading-tight">
          Erwachsenwerden – aber machbar.
        </h1>
        <p className="text-lg text-ink/80 max-w-prose">
          Anmeldung, Rundfunkbeitrag, Haftpflicht – rund um die erste eigene Wohnung
          gibt es To-dos, von denen dir vorher niemand erzählt hat.
        </p>
        <p className="text-lg text-pine font-medium">
          Ein Schritt nach dem anderen. Wir zeigen dir, welcher.
        </p>
      </section>

      <section aria-label="Verfügbare Reisen" className="flex flex-col gap-4">
        {journeys.map(j => (
          <Link
            key={j.id}
            to={`/journey/${j.id}`}
            className="block rounded-card bg-cream-card border border-pine-mist p-6 shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
          >
            <h2 className="font-display text-2xl font-semibold text-pine">{j.title}</h2>
            <p className="mt-1 text-ink/80">{j.subtitle}</p>
            <p className="mt-3 text-sm font-display font-semibold text-coral-deep">
              {j.tasks.length} Schritte
            </p>
          </Link>
        ))}
      </section>
    </div>
  )
}
