import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { kategorie, aufgabeFuerKategorie } from '../data/vergleich'
import { ablageFuerKategorie, jahresCheckKategorien, anbieterAngebot } from '../data/anbieter'
import { useWallet } from '../hooks/useWallet'
import { useTaskListProgress } from '../hooks/useProgress'

function inElfMonaten() {
  const d = new Date()
  d.setMonth(d.getMonth() + 11)
  return d.toISOString().slice(0, 10)
}

// Fragt nach einem Klick auf einen Partner-Link nach, ob abgeschlossen wurde,
// und löst bei „Ja" die Automatik aus: Termin-Vorschlag, Jahres-Check,
// Dokument-Upload-Hinweis, Aufgabe-erledigt-Vorschlag (§5.3).
export default function NachfrageKarte({ kategorieId }: { kategorieId?: string }) {
  const { abschluesse, bestaetigeAbschluss, verwerfeVormerkung, loading } = useWallet()
  const [bestaetigt, setBestaetigt] = useState<string | null>(null)

  const offene = useMemo(
    () =>
      abschluesse.filter(
        a => a.status === 'angeklickt' && (!kategorieId || a.kategorieId === kategorieId)
      ),
    [abschluesse, kategorieId]
  )
  const bestaetigterEintrag = useMemo(
    () => abschluesse.find(a => a.id === bestaetigt) ?? null,
    [abschluesse, bestaetigt]
  )

  const aufgabe = useMemo(
    () => (bestaetigterEintrag ? aufgabeFuerKategorie(bestaetigterEintrag.kategorieId, journeys) : null),
    [bestaetigterEintrag]
  )
  const progressItems = useMemo(
    () => (aufgabe ? [{ journeyId: aufgabe.journeyId, taskId: aufgabe.taskId }] : []),
    [aufgabe]
  )
  const { done, toggle } = useTaskListProgress(progressItems)
  const aufgabeKey = aufgabe ? `${aufgabe.journeyId}:${aufgabe.taskId}` : ''

  if (loading || (offene.length === 0 && !bestaetigterEintrag)) return null

  return (
    <div className="flex flex-col gap-4">
      {offene.map(v => {
        const kat = kategorie(v.kategorieId)
        return (
          <div key={v.id} className="rounded-card border-2 border-coral bg-cream-card p-5">
            <p className="font-display font-semibold text-pine">
              Hast du bei {v.anbieter} abgeschlossen?
            </p>
            <p className="mt-1 text-sm text-ink/70">
              Du warst neulich beim {kat?.titel ?? v.kategorieId}-Angebot – sag kurz Bescheid,
              dann räumen wir hier für dich auf.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                onClick={() => { bestaetigeAbschluss(v.id); setBestaetigt(v.id) }}
                className="rounded-pill bg-coral px-5 py-2.5 font-display font-semibold text-white hover:bg-coral-deep transition"
              >
                Ja, abgeschlossen
              </button>
              <button
                onClick={() => verwerfeVormerkung(v.id)}
                className="rounded-pill border-2 border-pine px-5 py-2.5 font-display font-semibold text-pine hover:bg-pine-mist/50 transition"
              >
                Nein, nur angesehen
              </button>
            </div>
          </div>
        )
      })}

      {bestaetigterEintrag && bestaetigterEintrag.status === 'selbst_bestaetigt' && (
        <div className="rounded-card bg-pine p-5 text-cream flex flex-col gap-3">
          <p className="font-display text-lg font-semibold">
            🎉 Stark! {bestaetigterEintrag.anbieter} ist in deinem Wallet vermerkt.
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link
              to={`/termine?neu=1&titel=${encodeURIComponent(`Alten ${kategorie(bestaetigterEintrag.kategorieId)?.titel ?? ''}-Vertrag kündigen`)}`}
              className="rounded-field bg-cream-card/10 border border-cream/25 p-3 hover:border-coral transition"
            >
              📅 Erinnerung anlegen: alten Vertrag kündigen?
            </Link>
            {jahresCheckKategorien.includes(bestaetigterEintrag.kategorieId) && (
              <Link
                to={`/termine?neu=1&titel=${encodeURIComponent(`${kategorie(bestaetigterEintrag.kategorieId)?.titel ?? 'Vertrag'}: Preis checken (Jahres-Check)`)}&datum=${inElfMonaten()}`}
                className="rounded-field bg-cream-card/10 border border-cream/25 p-3 hover:border-coral transition"
              >
                ⏰ In 11 Monaten erinnern: Preis checken?
              </Link>
            )}
            {ablageFuerKategorie[bestaetigterEintrag.kategorieId] && (
              <Link
                to="/dokumente"
                className="rounded-field bg-cream-card/10 border border-cream/25 p-3 hover:border-coral transition"
              >
                📄 Vertragsbestätigung hochladen – wir sortieren sie automatisch ein
              </Link>
            )}
            {aufgabe && !done[aufgabeKey] && (
              <button
                onClick={() => toggle(aufgabe.journeyId, aufgabe.taskId)}
                className="text-left rounded-field bg-cream-card/10 border border-cream/25 p-3 hover:border-coral transition"
              >
                ✓ Aufgabe „{aufgabe.titel}" als erledigt markieren?
              </button>
            )}
            {aufgabe && done[aufgabeKey] && (
              <p className="rounded-field bg-cream-card/10 border border-cream/25 p-3">
                ✓ Aufgabe „{aufgabe.titel}" ist erledigt.
              </p>
            )}
          </div>
          {anbieterAngebot(bestaetigterEintrag.angebotId)?.bonusFuerNutzer ? (
            <p className="text-xs text-cream/70">
              Tipp: Bei diesem Angebot gibt es aktuell bis zu {anbieterAngebot(bestaetigterEintrag.angebotId)?.bonusFuerNutzer} € Neukundenbonus – prüf die Bedingungen beim Anbieter.
            </p>
          ) : null}
          <button onClick={() => setBestaetigt(null)} className="self-start text-xs text-cream/60 underline underline-offset-2">
            Ausblenden
          </button>
        </div>
      )}
    </div>
  )
}
