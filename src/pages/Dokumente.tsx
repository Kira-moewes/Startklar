import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { themen, thema as themaVon } from '../data/themen'
import { schlageAblageVor } from '../data/dokumentRegeln'
import { normalisiere, tokensAus, passt } from '../data/suchen'
import { useDokumente, dokumentHerunterladen } from '../hooks/useDokumente'

function formatDatum(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
}

export default function Dokumente() {
  const { dokumente, add, loading } = useDokumente()
  const [datei, setDatei] = useState<File | null>(null)
  const [titel, setTitel] = useState('')
  const [themaId, setThemaId] = useState(themen[0].id)
  const [unterordner, setUnterordner] = useState(themen[0].unterordner[0])
  const [vorschlagInfo, setVorschlagInfo] = useState<string | null>(null)
  const [suche, setSuche] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const gewaehltesThema = themaVon(themaId) ?? themen[0]

  const dateiGewaehlt = (f: File | null) => {
    setDatei(f)
    if (!f) return
    const basisTitel = f.name.replace(/\.[a-z0-9]+$/i, '').replaceAll(/[-_]/g, ' ')
    setTitel(basisTitel)
    const vorschlag = schlageAblageVor(`${f.name} ${basisTitel}`)
    if (vorschlag) {
      setThemaId(vorschlag.themaId)
      setUnterordner(vorschlag.unterordner)
      const t = themaVon(vorschlag.themaId)
      setVorschlagInfo(`Vorschlag: ${t?.titel} → ${vorschlag.unterordner} (anpassbar)`)
    } else {
      setVorschlagInfo(null)
    }
  }

  const titelGeaendert = (wert: string) => {
    setTitel(wert)
    const vorschlag = schlageAblageVor(wert)
    if (vorschlag) {
      setThemaId(vorschlag.themaId)
      setUnterordner(vorschlag.unterordner)
      const t = themaVon(vorschlag.themaId)
      setVorschlagInfo(`Vorschlag: ${t?.titel} → ${vorschlag.unterordner} (anpassbar)`)
    }
  }

  const speichern = (e: React.FormEvent) => {
    e.preventDefault()
    if (!datei || !titel.trim()) return
    add({
      titel: titel.trim(),
      themaId,
      unterordner,
      quelle: 'upload',
      mimeType: datei.type || 'application/octet-stream',
      dateiName: datei.name,
      blob: datei,
    })
    setDatei(null)
    setTitel('')
    setVorschlagInfo(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const suchTreffer = useMemo(() => {
    const tokens = tokensAus(suche)
    if (tokens.length === 0) return []
    return dokumente.filter(d =>
      passt(normalisiere([d.titel, d.dateiName, d.unterordner, themaVon(d.themaId)?.titel ?? ''].join(' ')), tokens)
    )
  }, [suche, dokumente])

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">Dokumente</h1>
        <p className="mt-2 text-lg text-ink/80">
          Deine Unterlagen, automatisch nach Themen sortiert. Abschlüsse über Startklar
          legen ihre Bestätigung hier von selbst ab.
        </p>
      </div>

      <form onSubmit={speichern} className="rounded-card bg-cream-card border border-pine-mist p-6 flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-pine">+ Dokument hinzufügen</h2>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,image/*,.txt"
          onChange={e => dateiGewaehlt(e.target.files?.[0] ?? null)}
          aria-label="Datei auswählen"
          className="rounded-field border border-pine-mist bg-cream px-4 py-3 text-sm file:mr-3 file:rounded-pill file:border-0 file:bg-pine file:px-4 file:py-1.5 file:font-display file:font-semibold file:text-cream"
        />
        {datei && (
          <>
            <input
              value={titel}
              onChange={e => titelGeaendert(e.target.value)}
              placeholder="Titel des Dokuments"
              aria-label="Titel des Dokuments"
              className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
            />
            {vorschlagInfo && <p className="text-sm text-pine bg-pine-mist/50 rounded-field px-3 py-2">✨ {vorschlagInfo}</p>}
            <div className="flex flex-wrap gap-3">
              <label className="flex-1 min-w-40 text-sm text-ink/70">
                Thema
                <select
                  value={themaId}
                  onChange={e => {
                    setThemaId(e.target.value)
                    const t = themaVon(e.target.value)
                    if (t) setUnterordner(t.unterordner[0])
                  }}
                  className="mt-1 w-full rounded-field border border-pine-mist bg-cream px-3 py-2.5 text-ink"
                >
                  {themen.map(t => <option key={t.id} value={t.id}>{t.icon} {t.titel}</option>)}
                </select>
              </label>
              <label className="flex-1 min-w-40 text-sm text-ink/70">
                Unterordner
                <select
                  value={unterordner}
                  onChange={e => setUnterordner(e.target.value)}
                  className="mt-1 w-full rounded-field border border-pine-mist bg-cream px-3 py-2.5 text-ink"
                >
                  {gewaehltesThema.unterordner.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
            </div>
            <button type="submit" className="self-start rounded-pill bg-coral px-6 py-3 font-display font-semibold text-white hover:bg-coral-deep transition">
              Speichern
            </button>
          </>
        )}
        <p className="text-xs text-ink/50">Bleibt auf deinem Gerät gespeichert (PDF, Bilder, Text).</p>
      </form>

      <input
        type="search"
        value={suche}
        onChange={e => setSuche(e.target.value)}
        placeholder="Dokumente durchsuchen …"
        aria-label="Dokumente durchsuchen"
        className="rounded-field border-2 border-pine-mist bg-cream-card px-5 py-3 focus:outline-2 focus:outline-coral"
      />

      {suche.trim() && (
        <section aria-live="polite" className="flex flex-col gap-3">
          <p className="text-sm text-ink/60">
            {suchTreffer.length === 0 ? 'Kein Dokument gefunden.' : `${suchTreffer.length} ${suchTreffer.length === 1 ? 'Dokument' : 'Dokumente'} gefunden`}
          </p>
          {suchTreffer.map(d => {
            const t = themaVon(d.themaId)
            return (
              <button
                key={d.id}
                onClick={() => dokumentHerunterladen(d)}
                className="text-left rounded-card bg-cream-card border border-pine-mist p-4 hover:border-coral transition"
              >
                <p className="font-display font-semibold text-pine">{d.mimeType.startsWith('image/') ? '🖼' : '📄'} {d.titel}</p>
                <p className="text-sm text-ink/60">{t?.icon} {t?.titel} → {d.unterordner} · {formatDatum(d.datum)}</p>
              </button>
            )
          })}
        </section>
      )}

      <section aria-label="Themenordner" className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {themen.map(t => {
          const docs = dokumente.filter(d => d.themaId === t.id)
          const letzte = docs.map(d => d.datum).sort().at(-1)
          return (
            <Link
              key={t.id}
              to={`/dokumente/${t.id}`}
              className="flex flex-col gap-1.5 rounded-card bg-cream-card border border-pine-mist p-5 transition hover:border-coral"
            >
              <span className="text-2xl" aria-hidden="true">{t.icon}</span>
              <span className="font-display font-semibold text-pine leading-tight">{t.titel}</span>
              <span className="text-sm text-ink/60">
                {docs.length} {docs.length === 1 ? 'Dokument' : 'Dokumente'}
              </span>
              {letzte && <span className="text-xs text-ink/50">zuletzt: {formatDatum(letzte)}</span>}
            </Link>
          )
        })}
      </section>

      {!loading && dokumente.length === 0 && (
        <p className="rounded-card border-2 border-pine-mist bg-cream p-6 text-ink/80">
          Noch keine Dokumente. Lade oben dein erstes hoch – Startklar schlägt automatisch
          den passenden Ordner vor. Und wenn du etwas über Startklar abschließt, landet die
          Bestätigung von selbst hier.
        </p>
      )}
    </div>
  )
}
