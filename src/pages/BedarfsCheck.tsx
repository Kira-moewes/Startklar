import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { bedarfsCheck } from '../data/bedarf'
import { useBedarf } from '../hooks/useBedarf'
import { useProfile } from '../hooks/useProfile'
import { useVergleich } from '../hooks/useVergleich'
import { passendeAnbieter } from '../lib/bedarfMatch'
import { normalisiere } from '../lib/retrieval'
import FragenWizard from '../components/FragenWizard'

// 'YYYY-MM' → 'MM/JJJJ'
function standLabel(stand: string): string {
  const [j, m] = stand.split('-')
  return m ? `${m}/${j}` : stand
}

const stufeStil: Record<string, string> = {
  wichtig: 'border-coral bg-coral/10',
  pruefen: 'border-pine-mist bg-cream-card',
  verzichtbar: 'border-pine-mist bg-pine-mist/30',
}

export default function BedarfsCheck() {
  const { kategorieId = '' } = useParams()
  const navigate = useNavigate()
  const check = bedarfsCheck(kategorieId)
  const { profile } = useProfile()
  const { antworten, ergebnis, speichern, loading } = useBedarf(kategorieId)
  const { angebote, addMitRichtwerten } = useVergleich(kategorieId)
  const [bearbeiten, setBearbeiten] = useState(false)

  // Katalog-Anbieter, die laut Richtwerten alle prüfbaren Zielwerte erfüllen
  // (nur Information, alphabetisch) – bereits übernommene ausblenden.
  const anbieterInfo = useMemo(() => {
    if (!ergebnis) return null
    const { treffer, pruefbar } = passendeAnbieter(kategorieId, ergebnis)
    const vorhandene = new Set(angebote.map(a => normalisiere(a.anbieter.trim())))
    return { pruefbar, treffer: treffer.filter(t => !vorhandene.has(normalisiere(t.eintrag.name))) }
  }, [ergebnis, kategorieId, angebote])

  const initial = useMemo(() => {
    const base: Record<string, string> = {}
    for (const f of check?.fragen ?? []) {
      const gespeichert = antworten?.[f.key]
      if (gespeichert !== undefined) {
        base[f.key] = gespeichert
      } else if (profile && f.vorbelegung) {
        const v = f.vorbelegung(profile)
        if (v) base[f.key] = v
      }
    }
    return base
  }, [check, antworten, profile])

  // Keinen Check für diese Kategorie → zurück zur Vergleichsseite.
  if (!check) return <Navigate to={`/vergleich/${kategorieId}`} replace />

  if (loading) return <div className="mx-auto max-w-[660px] px-7 py-16 text-pine/60">Lädt …</div>

  const zeigeWizard = bearbeiten || !ergebnis

  if (zeigeWizard) {
    return (
      <div>
        <div className="mx-auto max-w-[660px] px-7 pt-10">
          <Link to={`/vergleich/${kategorieId}`} className="no-print text-sm text-pine underline underline-offset-2">← Zum Vergleich</Link>
          <h1 className="mt-3 font-serif text-4xl font-normal text-pine">{check.titel}</h1>
          <p className="mt-2 text-ink/80">{check.intro}</p>
        </div>
        <FragenWizard
          fragen={check.fragen}
          initial={initial}
          abschlussLabel="Abbrechen"
          onFertig={(a) => { void speichern(a).then(() => setBearbeiten(false)) }}
          onAbbruch={() => (bearbeiten ? setBearbeiten(false) : navigate(`/vergleich/${kategorieId}`))}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[660px] w-full px-7 pt-10 pb-24 flex flex-col gap-6">
      <div>
        <Link to={`/vergleich/${kategorieId}`} className="no-print text-sm text-pine underline underline-offset-2">← Zum Vergleich</Link>
        <h1 className="mt-3 font-serif text-4xl font-normal text-pine">{check.titel}</h1>
      </div>

      <div className={`rounded-card border-2 p-6 ${stufeStil[ergebnis.stufe]}`}>
        <p className="text-[13px] font-semibold tracking-[.16em] uppercase text-olive">Dein Ergebnis</p>
        <h2 className="mt-1 font-serif text-2xl text-pine">{ergebnis.titel}</h2>
        <p className="mt-2 text-ink/80">{ergebnis.begruendung}</p>
      </div>

      {(ergebnis.zielwerte.length > 0 || (ergebnis.bausteine?.length ?? 0) > 0) && (
        <section className="rounded-card border border-pine-mist bg-cream-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display font-semibold text-pine">Dein Tarif-Steckbrief</h3>
            <button
              onClick={() => window.print()}
              className="no-print text-sm text-pine underline underline-offset-2 hover:text-coral-deep"
            >
              Drucken / PDF
            </button>
          </div>
          <p className="mt-1 text-sm text-ink/60">Das solltest DU bei Angeboten verlangen – zum Mitnehmen ins Gespräch.</p>
          {ergebnis.zielwerte.length > 0 && (
            <ul className="mt-3 space-y-2">
              {ergebnis.zielwerte.map((z, i) => (
                <li key={i} className="flex justify-between gap-4 text-sm">
                  <span className="text-ink/70">{z.label}</span>
                  <span className="font-medium text-pine text-right">{z.ziel}</span>
                </li>
              ))}
            </ul>
          )}
          {(ergebnis.bausteine?.length ?? 0) > 0 && (
            <>
              <h4 className="mt-4 text-sm font-semibold text-olive uppercase tracking-[.12em]">Empfohlene Bausteine</h4>
              <ul className="mt-2 space-y-1.5">
                {ergebnis.bausteine!.map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-ink/80">
                    <span className="text-olive font-bold shrink-0">+</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {anbieterInfo && anbieterInfo.pruefbar > 0 && (
        <section className="rounded-card border border-pine-mist bg-cream-card p-6">
          <h3 className="font-display font-semibold text-pine">
            {anbieterInfo.treffer.length > 0
              ? 'Diese Anbieter erfüllen deine Zielwerte'
              : 'Kein Katalog-Anbieter erfüllt alle Zielwerte'}
          </h3>
          {anbieterInfo.treffer.length > 0 ? (
            <>
              <p className="mt-1 text-sm text-ink/60">
                Laut unseren Richtwerten (Stand {standLabel(anbieterInfo.treffer[0].eintrag.stand)}, ungeprüft) –
                antippen übernimmt den Anbieter in deinen Vergleich:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {anbieterInfo.treffer.map(({ eintrag }) => (
                  <button
                    key={eintrag.name}
                    type="button"
                    onClick={() => {
                      addMitRichtwerten(eintrag.name, eintrag.werte, eintrag.stand)
                      navigate(`/vergleich/${kategorieId}`)
                    }}
                    className="rounded-pill border border-pine-mist bg-cream px-4 py-2 text-sm font-display font-semibold text-pine hover:border-coral hover:text-coral-deep transition"
                  >
                    + {eintrag.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-1 text-sm text-ink/70">
              Unsere Richtwerte sind grob – das heißt nicht, dass es kein passendes Angebot gibt.
              Vergleiche selbst und verlange die Werte aus deinem Steckbrief.
            </p>
          )}
          <p className="mt-4 text-xs text-ink/50">
            Alphabetische Auflistung, keine Empfehlung, keine Provision – Richtwerte ersetzen kein echtes Angebot.
          </p>
        </section>
      )}

      {ergebnis.hinweise.length > 0 && (
        <ul className="space-y-2 text-ink/80">
          {ergebnis.hinweise.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-coral font-bold shrink-0">→</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="no-print flex flex-wrap gap-3 pt-2">
        <Link
          to={`/vergleich/${kategorieId}`}
          className="rounded-pill bg-coral px-6 py-3 font-display font-semibold text-on-akzent hover:bg-coral-deep transition"
        >
          Zum Vergleich →
        </Link>
        <button
          onClick={() => setBearbeiten(true)}
          className="rounded-pill border-[1.5px] border-pine/30 px-6 py-3 font-display font-semibold text-pine hover:border-pine transition"
        >
          Antworten ändern
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-pill border-[1.5px] border-pine/30 px-6 py-3 font-display font-semibold text-pine hover:border-pine transition"
        >
          Drucken / PDF
        </button>
      </div>
    </div>
  )
}
