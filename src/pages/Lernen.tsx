import { Link } from 'react-router-dom'
import { lernArtikel } from '../data/lernen'
import { thema as themaVon } from '../data/themen'

export default function Lernen() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">Lernen</h1>
        <p className="mt-2 text-lg text-ink/80">
          Kurze Guides zu den Dingen, die dir niemand erklärt hat. Eigener
          Startklar-Content – ohne Werbung, ohne Provision.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lernArtikel.map(a => {
          const t = themaVon(a.themaId)
          return (
            <Link
              key={a.id}
              to={`/lernen/${a.id}`}
              className="flex flex-col gap-2 rounded-card bg-cream-card border border-pine-mist p-5 hover:border-coral transition"
            >
              <div className="flex items-center gap-2 text-xs text-ink/60">
                {t && <span>{t.icon} {t.titel}</span>}
                <span className="ml-auto rounded-pill border border-pine-mist px-2 py-0.5">{a.minuten} Min.</span>
              </div>
              <h2 className="font-display text-lg font-semibold text-pine leading-snug">{a.titel}</h2>
              <p className="text-sm text-ink/70">{a.teaser}</p>
              {a.videoUrl && <span className="text-xs text-coral-deep font-display font-semibold">▶ Mit Video</span>}
            </Link>
          )
        })}
      </div>

      <p className="text-sm text-ink/60">
        Alle Inhalte sind allgemeine Bildung, keine Rechts-, Steuer- oder Anlageberatung.
      </p>
    </div>
  )
}
