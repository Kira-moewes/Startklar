import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTermine, terminAlsIcs, type Termin } from '../hooks/useTermine'
import { journeys } from '../data'

const heute = () => new Date().toISOString().slice(0, 10)

function formatDatum(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long' })
}

type Gruppe = { titel: string; ton: 'alarm' | 'heute' | 'normal'; termine: Termin[] }

function gruppiere(termine: Termin[]): Gruppe[] {
  const t = heute()
  const inSieben = new Date()
  inSieben.setDate(inSieben.getDate() + 7)
  const woche = inSieben.toISOString().slice(0, 10)

  const offen = termine.filter(x => !x.erledigt).sort((a, b) =>
    (a.datum + (a.uhrzeit ?? '')) < (b.datum + (b.uhrzeit ?? '')) ? -1 : 1)

  return [
    { titel: 'Überfällig', ton: 'alarm' as const, termine: offen.filter(x => x.datum < t) },
    { titel: 'Heute', ton: 'heute' as const, termine: offen.filter(x => x.datum === t) },
    { titel: 'Nächste 7 Tage', ton: 'normal' as const, termine: offen.filter(x => x.datum > t && x.datum <= woche) },
    { titel: 'Später', ton: 'normal' as const, termine: offen.filter(x => x.datum > woche) },
  ].filter(g => g.termine.length > 0)
}

export default function Termine() {
  const { termine, add, update, remove, loading } = useTermine()
  const [params, setParams] = useSearchParams()
  const [zeigeForm, setZeigeForm] = useState(params.get('neu') === '1')
  const [titel, setTitel] = useState(params.get('titel') ?? '')
  const [datum, setDatum] = useState(heute())
  const [uhrzeit, setUhrzeit] = useState('')
  const [ort, setOrt] = useState('')
  const [notiz, setNotiz] = useState('')

  const taskRef = useMemo(() => {
    const journeyId = params.get('journey')
    const taskId = params.get('task')
    if (!journeyId || !taskId) return undefined
    return { journeyId, taskId }
  }, [params])

  const gruppen = useMemo(() => gruppiere(termine), [termine])
  const erledigte = useMemo(
    () => termine.filter(t => t.erledigt).sort((a, b) => (a.datum < b.datum ? 1 : -1)),
    [termine]
  )

  const speichern = (e: React.FormEvent) => {
    e.preventDefault()
    if (!titel.trim() || !datum) return
    add({
      titel: titel.trim(),
      datum,
      uhrzeit: uhrzeit || undefined,
      ort: ort.trim() || undefined,
      notiz: notiz.trim() || undefined,
      journeyId: taskRef?.journeyId,
      taskId: taskRef?.taskId,
    })
    setTitel(''); setUhrzeit(''); setOrt(''); setNotiz(''); setDatum(heute())
    setZeigeForm(false)
    setParams({}, { replace: true })
  }

  const taskLink = (t: Termin) => {
    if (!t.journeyId || !t.taskId) return null
    const journey = journeys.find(j => j.id === t.journeyId)
    const task = journey?.tasks.find(x => x.id === t.taskId)
    if (!journey || !task) return null
    return { to: `/journey/${t.journeyId}/task/${t.taskId}`, label: task.title }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">Deine Termine</h1>
        <p className="mt-2 text-lg text-ink/80">
          Bürgeramt, Beratung, Übergabe – hier landet alles mit Datum. Nichts geht verloren.
        </p>
      </div>

      {!zeigeForm && (
        <button
          onClick={() => setZeigeForm(true)}
          className="self-start rounded-pill bg-coral px-6 py-3 font-display font-semibold text-white hover:bg-coral-deep transition"
        >
          + Termin anlegen
        </button>
      )}

      {zeigeForm && (
        <form onSubmit={speichern} className="rounded-card bg-cream-card border border-pine-mist p-6 flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold text-pine">Neuer Termin</h2>
          {taskRef && (
            <p className="text-sm text-ink/70 rounded-field bg-pine-mist/50 px-3 py-2">
              Wird mit der Aufgabe „{taskLink({ journeyId: taskRef.journeyId, taskId: taskRef.taskId } as Termin)?.label ?? taskRef.taskId}" verknüpft.
            </p>
          )}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink/80">Was steht an?</span>
            <input
              value={titel}
              onChange={e => setTitel(e.target.value)}
              required
              placeholder="z. B. Termin beim Bürgeramt"
              className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-ink/80">Datum</span>
              <input
                type="date"
                value={datum}
                onChange={e => setDatum(e.target.value)}
                required
                className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-ink/80">Uhrzeit (optional)</span>
              <input
                type="time"
                value={uhrzeit}
                onChange={e => setUhrzeit(e.target.value)}
                className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink/80">Ort (optional)</span>
            <input
              value={ort}
              onChange={e => setOrt(e.target.value)}
              placeholder="z. B. Bürgeramt Mitte, Raum 2.04"
              className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink/80">Notiz (optional)</span>
            <textarea
              value={notiz}
              onChange={e => setNotiz(e.target.value)}
              rows={2}
              placeholder="z. B. Perso und Mietvertrag mitnehmen"
              className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
            />
          </label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-pill bg-pine px-6 py-3 font-display font-semibold text-cream hover:bg-forest transition">
              Speichern
            </button>
            <button
              type="button"
              onClick={() => { setZeigeForm(false); setParams({}, { replace: true }) }}
              className="rounded-pill border-2 border-pine px-6 py-3 font-display font-semibold text-pine"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {!loading && termine.length === 0 && !zeigeForm && (
        <div className="rounded-card bg-cream-card border border-pine-mist p-8">
          <p className="text-ink/80">
            Noch keine Termine. Wenn du bei einer Aufgabe einen Termin ausmachst – etwa beim Bürgeramt –
            trag ihn hier ein. Wir sortieren ihn dir automatisch in deine Agenda.
          </p>
        </div>
      )}

      {gruppen.map(g => (
        <section key={g.titel} className="space-y-3">
          <h2 className={`font-display text-xl font-semibold ${g.ton === 'alarm' ? 'text-coral-deep' : 'text-pine'}`}>
            {g.titel}
          </h2>
          {g.termine.map(t => {
            const link = taskLink(t)
            return (
              <div
                key={t.id}
                className={`rounded-card bg-cream-card border p-5 flex gap-4 items-start ${g.ton === 'alarm' ? 'border-coral' : 'border-pine-mist'}`}
              >
                <input
                  type="checkbox"
                  checked={t.erledigt}
                  onChange={() => update(t.id, { erledigt: !t.erledigt })}
                  aria-label={`${t.titel} als erledigt markieren`}
                  className="mt-1 size-6 shrink-0 accent-[#F47B5B] rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-pine">{t.titel}</p>
                  <p className="text-sm text-ink/70 mt-0.5">
                    {formatDatum(t.datum)}{t.uhrzeit ? `, ${t.uhrzeit} Uhr` : ''}{t.ort ? ` · ${t.ort}` : ''}
                  </p>
                  {t.notiz && <p className="text-sm text-ink/60 mt-1">{t.notiz}</p>}
                  {link && (
                    <Link to={link.to} className="inline-block mt-2 text-sm text-pine underline underline-offset-2 hover:text-coral-deep">
                      Zur Aufgabe: {link.label}
                    </Link>
                  )}
                  <div className="mt-3 flex gap-4 text-sm">
                    <button onClick={() => terminAlsIcs(t)} className="text-pine underline underline-offset-2 hover:text-coral-deep">
                      In Kalender (.ics)
                    </button>
                    <button onClick={() => remove(t.id)} className="text-ink/50 underline underline-offset-2 hover:text-coral-deep">
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      ))}

      {erledigte.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-pine/60">Erledigt</h2>
          {erledigte.map(t => (
            <div key={t.id} className="rounded-card bg-cream-card border border-pine-mist p-4 flex gap-4 items-center opacity-70">
              <input
                type="checkbox"
                checked
                onChange={() => update(t.id, { erledigt: false })}
                aria-label={`${t.titel} wieder öffnen`}
                className="size-6 shrink-0 accent-[#F47B5B] rounded"
              />
              <p className="flex-1 font-display text-ink/50 line-through">{t.titel}</p>
              <button onClick={() => remove(t.id)} className="text-sm text-ink/40 underline underline-offset-2 hover:text-coral-deep">
                Löschen
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
