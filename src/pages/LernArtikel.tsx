import { Link, useParams } from 'react-router-dom'
import { artikel, lernArtikel } from '../data/lernen'
import { thema as themaVon } from '../data/themen'

export default function LernArtikelSeite() {
  const { artikelId = '' } = useParams()
  const a = artikel(artikelId)

  if (!a) {
    return (
      <p className="p-6">
        Diesen Artikel gibt es nicht. <Link to="/lernen" className="underline">Alle Lern-Artikel</Link>
      </p>
    )
  }

  const t = themaVon(a.themaId)
  const weitere = lernArtikel.filter(x => x.id !== a.id).slice(0, 2)

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-8">
      <div>
        <Link to="/lernen" className="text-sm text-pine underline underline-offset-2">← Alle Lern-Artikel</Link>
        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-pine leading-tight">{a.titel}</h1>
        <p className="mt-2 text-sm text-ink/60">
          {t && <>{t.icon} {t.titel} · </>}{a.minuten} Min. Lesezeit · Startklar-Redaktion, ohne Provision
        </p>
      </div>

      {a.videoUrl && (
        <div className="rounded-card border-2 border-pine-mist bg-cream p-6 text-ink/70 text-sm">
          ▶ Video folgt: {a.videoUrl}
        </div>
      )}

      <article className="flex flex-col gap-4">
        {a.inhalt.map((absatz, i) => (
          <p key={i} className="text-ink/90 leading-relaxed">{absatz}</p>
        ))}
      </article>

      <p className="rounded-card border-2 border-pine-mist bg-cream p-4 text-sm text-ink/70">
        Allgemeine Bildung, keine Rechts-, Steuer- oder Anlageberatung.
      </p>

      {weitere.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-semibold text-pine">Weiterlesen</h2>
          {weitere.map(w => (
            <Link key={w.id} to={`/lernen/${w.id}`} className="rounded-card bg-cream-card border border-pine-mist p-4 hover:border-coral transition">
              <p className="font-display font-semibold text-pine">{w.titel}</p>
              <p className="text-sm text-ink/70">{w.teaser}</p>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}
