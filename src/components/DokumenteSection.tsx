import { useRef, useState } from 'react'
import { groesseLabel, type Dokument } from '../data/dokumente'
import { oeffneDokument, useDokumente } from '../hooks/useDokumente'

function datumLabel(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Karte "Deine Unterlagen": Dateien (PDF/Foto) lokal ablegen, ansehen, löschen.
// Wird an Aufgaben (TaskDetail) und Vergleichen (VergleichDetail) eingebunden.
export default function DokumenteSection({ bezugKey }: { bezugKey: string }) {
  const { dokumente, hinzufuegen, entfernen, fehler, loading } = useDokumente(bezugKey)
  const [loeschId, setLoeschId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const dateiGewaehlt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void hinzufuegen(file)
    e.target.value = ''
  }

  if (loading) return null

  return (
    <section aria-label="Deine Unterlagen" className="no-print rounded-card border border-pine-mist bg-cream-card p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-semibold text-pine">Deine Unterlagen</h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-pill border-[1.5px] border-pine/30 px-4 py-2 text-sm font-display font-semibold text-pine hover:border-pine transition shrink-0"
        >
          + Datei ablegen
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          onChange={dateiGewaehlt}
          className="hidden"
          aria-label="Datei auswählen (PDF oder Bild)"
        />
      </div>

      {fehler && (
        <p className="mt-3 rounded-field border border-coral/40 bg-coral/10 px-3 py-2 text-sm text-coral-deep">{fehler}</p>
      )}

      {dokumente.length === 0 && !fehler && (
        <p className="mt-3 text-sm text-ink/60">
          Hier kannst du z.&nbsp;B. deine Police, einen Vertrag oder ein Foto der Unterlage ablegen.
        </p>
      )}

      {dokumente.length > 0 && (
        <ul className="mt-4 space-y-3">
          {dokumente.map((d: Dokument) => (
            <li key={d.id} className="flex items-center gap-3">
              {d.typ.startsWith('image/') ? (
                <img
                  src={d.datenUrl}
                  alt=""
                  className="h-12 w-12 rounded-field object-cover border border-pine-mist shrink-0"
                />
              ) : (
                <span aria-hidden className="h-12 w-12 rounded-field border border-pine-mist bg-cream flex items-center justify-center text-xs font-display font-bold text-pine shrink-0">
                  PDF
                </span>
              )}
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => oeffneDokument(d)}
                  className="block max-w-full truncate text-left font-medium text-pine underline underline-offset-2 hover:text-coral-deep"
                  title={`${d.name} öffnen`}
                >
                  {d.name}
                </button>
                <span className="text-xs text-ink/50">{groesseLabel(d.groesse)} · {datumLabel(d.angelegtAm)}</span>
              </div>
              {loeschId === d.id ? (
                <span className="flex items-center gap-2 shrink-0 text-sm">
                  <button
                    type="button"
                    onClick={() => { void entfernen(d.id); setLoeschId(null) }}
                    className="rounded-pill bg-coral px-3 py-1.5 font-display font-semibold text-white hover:bg-coral-deep transition"
                  >
                    Löschen
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoeschId(null)}
                    className="text-ink/50 underline underline-offset-2"
                  >
                    Abbrechen
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoeschId(d.id)}
                  className="shrink-0 text-xs text-ink/40 underline underline-offset-2 hover:text-coral-deep"
                >
                  Entfernen
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-ink/50">
        Bleibt nur auf diesem Gerät und ist in deinem Daten-Export enthalten.
      </p>
    </section>
  )
}
