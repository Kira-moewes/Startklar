import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { useProfile } from '../hooks/useProfile'
import { istRelevant, relevanteTasks } from '../data/visibility'

export default function Home() {
  const { profile, loading } = useProfile()
  const sichtbar = journeys.filter(j => istRelevant(profile, j.id))

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <p className="font-display text-sm font-semibold tracking-widest text-coral uppercase">Startklar</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-pine leading-tight">
          Erwachsenwerden – aber machbar.
        </h1>
        <p className="text-lg text-ink/80 max-w-prose">
          Anmeldung, Rundfunkbeitrag, Haftpflicht – es gibt To-dos, von denen dir vorher niemand erzählt hat.
        </p>
        <p className="text-lg text-pine font-medium">Ein Schritt nach dem anderen. Wir zeigen dir, welcher.</p>
      </section>

      {!loading && !profile && (
        <Link to="/onboarding"
              className="rounded-card bg-pine p-6 text-cream shadow-sm transition hover:shadow-md">
          <h2 className="font-display text-2xl font-semibold">Zeig uns kurz deine Situation</h2>
          <p className="mt-1 text-cream/85">7 Fragen, unter 2 Minuten – danach siehst du nur, was für dich zählt.</p>
          <p className="mt-3 font-display font-semibold text-coral">Los geht's →</p>
        </Link>
      )}

      <section aria-label="Deine Bereiche" className="flex flex-col gap-4">
        {sichtbar.map(j => {
          const anzahl = relevanteTasks(j, profile).length
          return (
            <Link key={j.id} to={`/journey/${j.id}`}
                  className="block rounded-card bg-cream-card border border-pine-mist p-6 shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral">
              <h2 className="font-display text-2xl font-semibold text-pine">{j.title}</h2>
              <p className="mt-1 text-ink/80">{j.subtitle}</p>
              <p className="mt-3 text-sm font-display font-semibold text-coral-deep">
                {anzahl} {anzahl === 1 ? 'Schritt' : 'Schritte'} für dich
              </p>
            </Link>
          )
        })}
        {!loading && profile && sichtbar.length === 0 && (
          <p className="rounded-card bg-cream-card border border-pine-mist p-6 text-ink/80">
            Gerade steht bei dir nichts an – stark! Ändert sich was, pass einfach dein Profil an.
          </p>
        )}
      </section>

      {profile && (
        <Link to="/profil" className="text-sm text-pine underline underline-offset-2 self-start">
          Profil anpassen
        </Link>
      )}
    </div>
  )
}
