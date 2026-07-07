import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { fragen, type Profile } from '../data/profile'
import { istRelevant, relevanteTasks } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useSettings, type Einstellungen } from '../hooks/useSettings'
import { useSpiel } from '../hooks/useSpiel'
import { beschreibeSicherung, exportiereAlles, importiereAlles, liesSicherung, loescheAlles, type ExportDatei } from '../lib/datenExport'
import { luminanz } from '../lib/farben'
import { agentChatStore } from '../lib/stores'
import Flieger, { GEAR_SETS } from '../components/spiel/Flieger'

function sichtbareSchritte(profile: Profile | null): number {
  return journeys
    .filter(j => istRelevant(profile, j.id))
    .reduce((n, j) => n + relevanteTasks(j, profile).length, 0)
}

const akzente: Array<{ wert: Einstellungen['akzent']; label: string; farbe: string }> = [
  { wert: 'olive', label: 'Olive', farbe: '#606C38' },
  { wert: 'koralle', label: 'Koralle', farbe: '#D95F41' },
  { wert: 'himmel', label: 'Himmel', farbe: '#3E6F80' },
  { wert: 'beere', label: 'Beere', farbe: '#8A4E6E' },
]

function OptionPill({ aktiv, onClick, children }: { aktiv: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={aktiv}
      className={`rounded-pill px-4 py-2 text-sm font-semibold border-[1.5px] transition
        ${aktiv ? 'bg-pine text-cream border-pine' : 'bg-cream-card text-pine border-pine/20 hover:border-pine'}`}
    >
      {children}
    </button>
  )
}

function Schalter({ an, onToggle, label }: { an: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={an}
      aria-label={label}
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-pill transition-colors flex-none ${an ? 'bg-olive' : 'bg-pine/25'}`}
    >
      <span className={`absolute top-1 size-5 rounded-full bg-paper transition-all ${an ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

function Gruppe({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="bg-cream-card border border-pine/14 rounded-[20px] p-6">
      <h3 className="m-0 font-serif font-medium text-xl text-pine">{titel}</h3>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Zeile({ label, hinweis, children }: { label: string; hinweis?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <div className="min-w-0">
        <p className="m-0 text-[15px] font-semibold text-pine">{label}</p>
        {hinweis && <p className="m-0 mt-0.5 text-[13px] text-pine/60 max-w-[420px]">{hinweis}</p>}
      </div>
      <div className="flex flex-wrap gap-2 items-center">{children}</div>
    </div>
  )
}

export default function Profil() {
  const { profile, save, loading } = useProfile()
  const { einstellungen, setEinstellung } = useSettings()
  const { state: spielState } = useSpiel()
  const [offeneFrage, setOffeneFrage] = useState<string | null>(null)
  const [aenderung, setAenderung] = useState<string | null>(null)
  const [zeigeKiHinweis, setZeigeKiHinweis] = useState(false)
  const [loeschStufe, setLoeschStufe] = useState(0)
  const [importVorschau, setImportVorschau] = useState<{ daten: ExportDatei; inhalt: string[] } | null>(null)
  const [datenStatus, setDatenStatus] = useState<string | null>(null)
  const [speicher, setSpeicher] = useState<string | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  // Speichernutzung (v. a. für abgelegte Unterlagen relevant); API fehlt in
  // manchen Browsern – dann bleibt die Zeile einfach weg.
  useEffect(() => {
    if (!navigator.storage?.estimate) return
    void navigator.storage.estimate().then(({ usage, quota }) => {
      if (!usage) return
      const mb = (usage / (1024 * 1024)).toFixed(1).replace('.', ',')
      const gb = quota ? ` von ~${Math.round(quota / (1024 * 1024 * 1024))} GB verfügbar` : ''
      setSpeicher(`${mb} MB belegt${gb}`)
    })
  }, [datenStatus])

  const antworte = async (feld: keyof Profile, wert: string) => {
    const vorher = sichtbareSchritte(profile)
    const next = { ...(profile ?? {}), [feld]: wert } as Profile
    await save(next)
    const nachher = sichtbareSchritte(next)
    const diff = nachher - vorher
    setAenderung(
      diff === 0
        ? 'Gespeichert.'
        : diff > 0
          ? `Gespeichert — ${diff} ${diff === 1 ? 'Schritt' : 'Schritte'} neu für dich eingeblendet.`
          : `Gespeichert — ${-diff} ${diff === -1 ? 'Schritt ist' : 'Schritte sind'} für dich nicht mehr relevant.`
    )
    setOffeneFrage(null)
  }

  const kiUmschalten = () => {
    // Hinweisdialog wirklich nur einmalig (persistiert in den Einstellungen).
    if (!einstellungen.kiModus && !einstellungen.kiHinweisGesehen && !zeigeKiHinweis) {
      setZeigeKiHinweis(true)
      return
    }
    if (zeigeKiHinweis) setEinstellung('kiHinweisGesehen', true)
    setZeigeKiHinweis(false)
    setEinstellung('kiModus', !einstellungen.kiModus)
  }

  // Schritt 1: Datei nur lesen und Vorschau zeigen – noch nichts überschreiben.
  const importVorbereiten = async (file: File | undefined) => {
    if (!file) return
    setDatenStatus(null)
    try {
      const daten = await liesSicherung(file)
      setImportVorschau({ daten, inhalt: beschreibeSicherung(daten) })
    } catch (e) {
      setImportVorschau(null)
      setDatenStatus(e instanceof Error ? e.message : 'Import fehlgeschlagen.')
    } finally {
      if (importRef.current) importRef.current.value = ''
    }
  }

  // Schritt 2: erst nach Bestätigung wirklich ersetzen.
  const importBestaetigen = async () => {
    if (!importVorschau) return
    try {
      const ergebnis = await importiereAlles(importVorschau.daten)
      setImportVorschau(null)
      setDatenStatus(`Import erfolgreich (${ergebnis.eintraege} Einträge). Die App lädt neu …`)
      setTimeout(() => location.reload(), 1200)
    } catch (e) {
      setImportVorschau(null)
      setDatenStatus(e instanceof Error ? e.message : 'Import fehlgeschlagen.')
    }
  }

  const allesLoeschen = async () => {
    await loescheAlles()
    location.reload()
  }

  return (
    <div className="mx-auto max-w-[780px] w-full px-7 pt-14 pb-24">
      <h1 className="m-0 font-serif font-normal text-[clamp(38px,5vw,60px)] text-pine" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        Dein <em className="text-olive">Profil</em>
      </h1>
      <p className="mt-3 m-0 text-[17px] text-pine/70" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .05s both' }}>
        Deine Angaben bestimmen, welche Schritte du siehst. Alles bleibt auf deinem Gerät.
      </p>

      {/* Antworten */}
      <h2 className="mt-10 m-0 font-serif font-medium text-[28px] text-pine">Deine Antworten</h2>
      {aenderung && (
        <p role="status" className="mt-3 m-0 rounded-[14px] border border-olive/40 bg-olive/8 px-4 py-2.5 text-sm font-semibold text-olive">
          ✓ {aenderung}
        </p>
      )}
      <div className="mt-4 flex flex-col gap-3">
        {!loading && fragen.map(frage => {
          const gewaehlt = profile?.[frage.feld]
          const label = frage.optionen.find(o => o.wert === gewaehlt)?.label
          const offen = offeneFrage === frage.feld
          return (
            <div key={frage.feld} className="bg-cream-card border border-pine/14 rounded-[18px] px-5.5 py-4.5">
              <button
                onClick={() => setOffeneFrage(offen ? null : frage.feld)}
                aria-expanded={offen}
                className="w-full text-left flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
              >
                <span className="text-[15px] font-semibold text-pine">{frage.titel}</span>
                <span className={`text-[15px] ${label ? 'text-olive font-semibold' : 'text-pine/50 italic'}`}>
                  {label ?? 'Noch nicht beantwortet'} <span aria-hidden="true">{offen ? '▴' : '▾'}</span>
                </span>
              </button>
              {offen && (
                <div className="mt-3.5 flex flex-wrap gap-2" role="group" aria-label={frage.titel}>
                  {frage.optionen.map(o => (
                    <button
                      key={o.wert}
                      onClick={() => void antworte(frage.feld, o.wert)}
                      className={`rounded-pill px-4 py-2 text-sm font-semibold border-[1.5px] transition
                        ${gewaehlt === o.wert ? 'bg-olive text-cream border-olive' : 'bg-cream text-pine border-pine/20 hover:border-olive'}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <Link to="/onboarding" className="inline-block mt-4 text-sm text-pine/60 underline underline-offset-3 hover:text-olive transition">
        Oder das Onboarding komplett neu starten
      </Link>

      {/* Einstellungen */}
      <h2 className="mt-12 m-0 font-serif font-medium text-[28px] text-pine">Einstellungen</h2>
      <div className="mt-4 flex flex-col gap-4">
        <Gruppe titel="Darstellung">
          <Zeile label="Design">
            {(['hell', 'dunkel', 'system'] as const).map(t => (
              <OptionPill key={t} aktiv={einstellungen.theme === t} onClick={() => setEinstellung('theme', t)}>
                {t === 'hell' ? 'Hell' : t === 'dunkel' ? 'Dunkel' : 'System'}
              </OptionPill>
            ))}
          </Zeile>
          <Zeile label="Akzentfarbe" hinweis="Vorgaben antippen – oder mit dem Regenbogen-Kreis jede eigene Farbe wählen.">
            {akzente.map(a => (
              <button
                key={a.wert}
                onClick={() => setEinstellung('akzent', a.wert)}
                aria-pressed={einstellungen.akzent === a.wert}
                aria-label={`Akzentfarbe ${a.label}`}
                title={a.label}
                className={`size-9 rounded-full border-2 transition ${einstellungen.akzent === a.wert ? 'border-pine scale-110' : 'border-pine/20 hover:border-pine/50'}`}
                style={{ background: a.farbe }}
              />
            ))}
            <label
              title="Eigene Farbe wählen"
              className={`relative size-9 rounded-full border-2 cursor-pointer transition overflow-hidden ${
                einstellungen.akzent === 'eigene' ? 'border-pine scale-110' : 'border-pine/20 hover:border-pine/50'
              }`}
              style={{
                background: einstellungen.akzent === 'eigene'
                  ? einstellungen.akzentHex
                  : 'conic-gradient(#e5484d, #ffb224, #6bc46d, #3e63dd, #b658c4, #e5484d)',
              }}
            >
              <input
                type="color"
                value={einstellungen.akzentHex}
                aria-label="Eigene Akzentfarbe wählen"
                onChange={e => {
                  setEinstellung('akzentHex', e.target.value)
                  setEinstellung('akzent', 'eigene')
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </Zeile>
          {einstellungen.akzent === 'eigene' && luminanz(einstellungen.akzentHex) > 0.75 && (
            <p className="m-0 text-[13px] text-coral-deep">
              Sehr helle Farbe – Schrift und Kontrast leiden. Etwas kräftiger wählen wirkt besser.
            </p>
          )}
          <Zeile label="Vorschau" hinweis="So wirkt deine Farbe in der App.">
            <span className="flex items-center gap-3">
              <span className="rounded-pill bg-olive text-on-akzent px-4 py-2 text-sm font-display font-semibold">Button</span>
              <span className="rounded-pill bg-pine-mist text-olive px-3 py-1 text-xs font-display font-semibold">Chip</span>
              <span className="h-2 w-24 rounded-pill bg-pine-mist overflow-hidden inline-block">
                <span className="block h-full w-2/3 rounded-pill bg-olive" />
              </span>
            </span>
          </Zeile>
          <Zeile label="Schriftgröße">
            {(['s', 'm', 'l'] as const).map(s => (
              <OptionPill key={s} aktiv={einstellungen.schrift === s} onClick={() => setEinstellung('schrift', s)}>
                {s.toUpperCase()}
              </OptionPill>
            ))}
          </Zeile>
          <Zeile label="Weniger Animationen" hinweis="Schaltet Einflug- und Endlos-Animationen ab.">
            <Schalter an={einstellungen.wenigerAnimation} onToggle={() => setEinstellung('wenigerAnimation', !einstellungen.wenigerAnimation)} label="Weniger Animationen" />
          </Zeile>
        </Gruppe>

        <Gruppe titel="Spiel & Figur">
          <Zeile label="Startseite" hinweis="Das Himmels-Abenteuer als Start – oder die klassische Ansicht. Jederzeit umschaltbar, es geht nichts verloren.">
            <OptionPill aktiv={einstellungen.startseite === 'spiel'} onClick={() => setEinstellung('startseite', 'spiel')}>Spiel (Himmel)</OptionPill>
            <OptionPill aktiv={einstellungen.startseite === 'klassisch'} onClick={() => setEinstellung('startseite', 'klassisch')}>Klassisch</OptionPill>
          </Zeile>
          <Zeile label="Deine Figur" hinweis="So sieht deine Flieger-Katze gerade aus.">
            <Flieger size={110} zustand="fliegen" ausruestung={einstellungen.ausruestung} shadow={false} />
          </Zeile>
          <Zeile label="Ausrüstung" hinweis="Kosmetik zum Selbstausdruck – erspielt oder (später) Teil der Pro-Version. Ändert nie den Fortschritt.">
            <span className="flex flex-col gap-2 w-full">
              {GEAR_SETS.map(g => {
                const frei = g.id === 'keine' || spielState.freigeschaltet.includes(g.id)
                const aktiv = einstellungen.ausruestung === g.id
                return (
                  <button
                    key={g.id}
                    disabled={!frei}
                    onClick={() => frei && setEinstellung('ausruestung', g.id)}
                    aria-pressed={aktiv}
                    className={`text-left rounded-[14px] border-[1.5px] px-4 py-2.5 transition ${
                      aktiv ? 'border-olive bg-olive/10' : 'border-pine/20 hover:border-olive'
                    } ${frei ? '' : 'opacity-55 cursor-not-allowed'}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-pine">{g.titel}</span>
                      {!frei && <span className="text-[12px] text-pine/55">{g.pro ? 'Pro 🔒' : 'noch gesperrt 🔒'}</span>}
                      {aktiv && <span className="text-[12px] font-semibold text-olive">angelegt</span>}
                    </span>
                    <span className="block mt-0.5 text-[13px] text-pine/65">{g.beschreibung}</span>
                  </button>
                )
              })}
            </span>
          </Zeile>
        </Gruppe>

        <Gruppe titel="Klaro (KI-Assistent)">
          <Zeile
            label="KI-Modus"
            hinweis="Ohne KI-Modus antwortet Klaro komplett auf deinem Gerät. Mit KI-Modus werden deine Fragen an einen Server geschickt, wenn die lokale Antwort nicht reicht."
          >
            <Schalter an={einstellungen.kiModus} onToggle={kiUmschalten} label="KI-Modus" />
          </Zeile>
          {zeigeKiHinweis && (
            <div className="rounded-[14px] border-[1.5px] border-olive bg-olive/8 p-4">
              <p className="m-0 text-sm text-pine/85 leading-relaxed">
                <strong>Kurz erklärt:</strong> Im KI-Modus wird deine Frage (und nur wenn du es unten erlaubst,
                eine kurze Zusammenfassung deines Fortschritts) an unseren Server und von dort an die
                Claude-API von Anthropic geschickt. Nichts wird dauerhaft gespeichert. Offline und ohne
                KI-Modus bleibt alles auf deinem Gerät.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={kiUmschalten} className="rounded-pill bg-pine text-cream px-4.5 py-2 text-sm font-semibold hover:bg-olive transition">
                  Verstanden, aktivieren
                </button>
                <button onClick={() => setZeigeKiHinweis(false)} className="rounded-pill border-[1.5px] border-pine/30 text-pine px-4.5 py-2 text-sm font-semibold hover:border-pine transition">
                  Lieber nicht
                </button>
              </div>
            </div>
          )}
          {einstellungen.kiModus && (
            <Zeile label="Kontext mitschicken" hinweis="Erlaubt Klaro, deine offenen Schritte und dein Profil in die KI-Antwort einzubeziehen.">
              <Schalter an={einstellungen.kiKontext} onToggle={() => setEinstellung('kiKontext', !einstellungen.kiKontext)} label="Kontext mitschicken" />
            </Zeile>
          )}
          <Zeile label="Chatverlauf" hinweis="Löscht alle bisherigen Nachrichten mit Klaro von diesem Gerät.">
            <button
              onClick={() => { void agentChatStore.clear().then(() => setDatenStatus('Chatverlauf gelöscht.')) }}
              className="rounded-pill border-[1.5px] border-pine/30 text-pine px-4.5 py-2 text-sm font-semibold hover:border-pine transition"
            >
              Verlauf löschen
            </button>
          </Zeile>
        </Gruppe>

        <Gruppe titel="Deine Daten">
          <Zeile label="Sicherung" hinweis="Lädt alle deine Daten (Profil, Fortschritt, Termine, Vergleiche, Bedarfschecks, Unterlagen, Einstellungen) als JSON-Datei herunter.">
            <button onClick={() => void exportiereAlles()} className="rounded-pill bg-pine text-cream px-4.5 py-2 text-sm font-semibold hover:bg-olive transition">
              Daten exportieren
            </button>
          </Zeile>
          <Zeile label="Wiederherstellen" hinweis="Ersetzt den aktuellen Stand komplett durch eine Sicherungsdatei.">
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={e => void importVorbereiten(e.target.files?.[0])}
            />
            <button onClick={() => importRef.current?.click()} className="rounded-pill border-[1.5px] border-pine/30 text-pine px-4.5 py-2 text-sm font-semibold hover:border-pine transition">
              Daten importieren
            </button>
          </Zeile>
          {importVorschau && (
            <div className="rounded-[14px] border-[1.5px] border-olive bg-olive/8 p-4">
              <p className="m-0 text-sm font-semibold text-pine">Das steckt in der Sicherung:</p>
              <ul className="mt-2 mb-0 list-disc pl-5 text-sm text-pine/85 space-y-0.5">
                {importVorschau.inhalt.map((zeile, i) => <li key={i}>{zeile}</li>)}
              </ul>
              <p className="mt-3 m-0 text-[13px] text-pine/60">
                Der Import ersetzt deinen aktuellen Stand vollständig – das lässt sich nicht rückgängig machen.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => void importBestaetigen()} className="rounded-pill bg-pine text-cream px-4.5 py-2 text-sm font-semibold hover:bg-olive transition">
                  Jetzt importieren
                </button>
                <button onClick={() => setImportVorschau(null)} className="rounded-pill border-[1.5px] border-pine/30 text-pine px-4.5 py-2 text-sm font-semibold hover:border-pine transition">
                  Abbrechen
                </button>
              </div>
            </div>
          )}
          <Zeile label="Alles löschen" hinweis="Entfernt sämtliche Daten von diesem Gerät. Das lässt sich nicht rückgängig machen.">
            {loeschStufe === 0 ? (
              <button onClick={() => setLoeschStufe(1)} className="rounded-pill border-[1.5px] border-olive text-olive px-4.5 py-2 text-sm font-semibold hover:bg-olive/10 transition">
                Alles löschen …
              </button>
            ) : (
              <span className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-semibold text-pine">Wirklich alles löschen?</span>
                <button onClick={() => void allesLoeschen()} className="rounded-pill bg-olive text-cream px-4.5 py-2 text-sm font-semibold transition">
                  Ja, endgültig löschen
                </button>
                <button onClick={() => setLoeschStufe(0)} className="rounded-pill border-[1.5px] border-pine/30 text-pine px-4.5 py-2 text-sm font-semibold transition">
                  Abbrechen
                </button>
              </span>
            )}
          </Zeile>
          {speicher && (
            <Zeile label="Speicher" hinweis="Belegter Platz auf diesem Gerät – Unterlagen (PDFs, Fotos) zählen hier am meisten.">
              <span className="text-sm text-pine/70">{speicher}</span>
            </Zeile>
          )}
          {datenStatus && <p role="status" className="m-0 text-sm font-semibold text-olive">{datenStatus}</p>}
        </Gruppe>

        <Gruppe titel="Über Startklar">
          <p className="m-0 text-sm text-pine/70 leading-relaxed">
            Startklar ist keine Rechtsberatung. Angaben können sich ändern — wichtige Fristen und Beträge
            werden redaktionell geprüft und entsprechend gekennzeichnet.
          </p>
          <p className="m-0 text-sm">
            <Link to="/impressum" className="underline underline-offset-3 text-pine hover:text-olive transition">Impressum</Link>
            <span className="text-pine/40"> · </span>
            <Link to="/datenschutz" className="underline underline-offset-3 text-pine hover:text-olive transition">Datenschutz</Link>
          </p>
        </Gruppe>
      </div>
    </div>
  )
}
