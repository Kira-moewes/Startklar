import { Link } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  description: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius-card)] border border-pine/10 bg-cream-card p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">Hinweis</p>
        <h1 className="mt-2 font-display text-3xl text-pine">{title}</h1>
        <p className="mt-3 text-pine-soft">{description}</p>
      </div>
      <Link to="/" className="text-sm font-semibold text-coral">
        Zur Startseite
      </Link>
    </section>
  )
}
