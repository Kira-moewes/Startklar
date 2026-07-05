import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { themen, thema as themaVon } from '../data/themen'
import { useDokumente, dokumentHerunterladen, type Dokument, type DokumentQuelle } from '../hooks/useDokumente'

const quelleLabel: Record<DokumentQuelle, string> = {
  upload: 'Hochgeladen',
  abschluss: 'Über Startklar',
  institution: 'Institution',
}

function formatDatum(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function DokumenteThema() {
  const { themaId = '' } = useParams()
  const t = themaVon(themaId)
  const { dokumente, verschieben, remove, loading } = useDokumente()
  const [verschiebeId, setVerschiebeId] = useState<string | null>(null)
  const [zielThema, setZielThema] = useState(themen[0].id)
  const [zielOrdner, setZielOrdner] = useState(themen[0].unterordner[0])

  if (!t) {
    return (
      <p className="p-6">
        Diesen Ordner gibt es nicht. <Link to="/dokumente" className="underline">Zur Übersicht</Link>
      </p>
    )
  }

  const docs = dokumente.filter(d => d.themaId === t.id)
  // Unterordner des Themas, plus alles, was durch Verschieben o. Ä. hier liegt.
  const ordner = [...t.unterordner, ...docs.map(d => d.unterordner).filter(u => !t.unterordner.includes(u))]

  const verschiebenStarten = (d: Dokument) => {
    setVerschiebeId(d.id)
    setZielThema(d.themaId)
    setZielOrdner(d.unterordner)
  }

  const verschiebenSpeichern = (id: string) => {
    verschieben(id, zielThema, zielOrdner)
    setVerschiebeId(null)
  }

  const zielThemaObj = themaVon(zielThema) ?? themen[0]

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-8">
      <div>
        <Link to="/dokumente" className="text-sm text-pine underline underline-offset-2">← Alle Dokumente</Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-pine">
          <span aria-hidden="true">{t.icon}</span> {t.titel}
        </h1>
        <p className="mt-1 text-ink/80">
          {docs.length} {docs.length === 1 ? 'Dokument' : 'Dokumente'}
        </p>
      </div>

      {!loading && docs.length === 0 && (
        <p className="rounded-card bg-cream-card border border-pine-mist p-6 text-ink/80">
          Hier liegt noch nichts. Lade auf der <Link to="/dokumente" className="underline">Dokumente-Seite</Link> etwas
          hoch oder schließe ein Angebot über Startklar ab – die Bestätigung landet dann automatisch hier.
        </p>
      )}

      {ordner.map(u => {
        const inOrdner = docs.filter(d => d.unterordner === u)
        if (inOrdner.length === 0) return null
        return (
          <section key={u} aria-label={u} className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-semibold text-pine">📁 {u}</h2>
            {inOrdner.map(d => (
              <div key={d.id} className="rounded-card bg-cream-card border border-pine-mist p-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="flex-1 min-w-40 font-display font-semibold text-pine">
                    {d.mimeType.startsWith('image/') ? '🖼' : '📄'} {d.titel}
                  </p>
                  <span className={`rounded-pill px-2.5 py-0.5 text-xs font-display font-semibold ${
                    d.quelle === 'abschluss' ? 'bg-coral text-white' : d.quelle === 'institution' ? 'bg-pine text-cream' : 'bg-pine-mist text-pine'
                  }`}>
                    {quelleLabel[d.quelle]}
                  </span>
                </div>
                <p className="text-sm text-ink/60">{formatDatum(d.datum)} · {d.dateiName}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <button onClick={() => dokumentHerunterladen(d)} className="text-pine underline underline-offset-2 hover:text-coral-deep">
                    Herunterladen
                  </button>
                  <button onClick={() => verschiebenStarten(d)} className="text-pine underline underline-offset-2 hover:text-coral-deep">
                    Verschieben
                  </button>
                  <button
                    onClick={() => { if (confirm(`„${d.titel}" wirklich löschen?`)) remove(d.id) }}
                    className="text-ink/40 underline underline-offset-2 hover:text-coral-deep"
                  >
                    Löschen
                  </button>
                </div>
                {verschiebeId === d.id && (
                  <div className="flex flex-wrap items-end gap-3 rounded-field bg-cream p-3">
                    <label className="flex-1 min-w-36 text-sm text-ink/70">
                      Thema
                      <select
                        value={zielThema}
                        onChange={e => {
                          setZielThema(e.target.value)
                          const zt = themaVon(e.target.value)
                          if (zt) setZielOrdner(zt.unterordner[0])
                        }}
                        className="mt-1 w-full rounded-field border border-pine-mist bg-cream-card px-3 py-2 text-ink"
                      >
                        {themen.map(th => <option key={th.id} value={th.id}>{th.icon} {th.titel}</option>)}
                      </select>
                    </label>
                    <label className="flex-1 min-w-36 text-sm text-ink/70">
                      Unterordner
                      <select
                        value={zielOrdner}
                        onChange={e => setZielOrdner(e.target.value)}
                        className="mt-1 w-full rounded-field border border-pine-mist bg-cream-card px-3 py-2 text-ink"
                      >
                        {zielThemaObj.unterordner.map(u2 => <option key={u2} value={u2}>{u2}</option>)}
                      </select>
                    </label>
                    <button
                      onClick={() => verschiebenSpeichern(d.id)}
                      className="rounded-pill bg-pine px-4 py-2 text-sm font-display font-semibold text-cream hover:bg-forest transition"
                    >
                      Verschieben
                    </button>
                    <button onClick={() => setVerschiebeId(null)} className="text-sm text-ink/50 underline underline-offset-2">
                      Abbrechen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
