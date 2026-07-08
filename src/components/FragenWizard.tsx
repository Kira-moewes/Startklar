import { useState } from 'react'
import KlaroPlane from './KlaroPlane'

// Generischer Ein-Frage-pro-Schritt-Wizard. Aus dem Onboarding extrahiert,
// damit ihn auch die Bedarfschecks nutzen können. Optik/Verhalten identisch
// zum bisherigen Onboarding.
export type WizardFrage = {
  key: string
  titel: string
  hinweis?: string
  optionen: { wert: string; label: string }[]
}

type Props = {
  fragen: WizardFrage[]
  initial?: Record<string, string>
  abschlussLabel?: string
  onFertig: (antworten: Record<string, string>) => void
  onAbbruch: () => void
}

export default function FragenWizard({ fragen, initial, abschlussLabel = 'Später machen', onFertig, onAbbruch }: Props) {
  const [antworten, setAntworten] = useState<Record<string, string>>(initial ?? {})
  const [index, setIndex] = useState(0)

  const frage = fragen[index]
  const letzte = index === fragen.length - 1
  const gewaehlt = antworten[frage.key]
  const pct = Math.round((index / (fragen.length - 1)) * 100)

  const waehle = (wert: string) => {
    const next = { ...antworten, [frage.key]: wert }
    setAntworten(next)
    if (letzte) {
      onFertig(next)
    } else {
      setIndex(i => i + 1)
    }
  }

  return (
    <div className="mx-auto max-w-[660px] w-full px-7 pt-16 pb-24">
      {/* Fortschritt: gestrichelte Linie, der Papierflieger wandert mit */}
      <div className="relative h-11" aria-label={`Frage ${index + 1} von ${fragen.length}`} style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        <div className="absolute inset-x-0 top-[27px] border-t-2 border-dashed border-pine/25" />
        <div
          className="absolute left-0 top-[26px] border-t-[3px] border-olive rounded-pill transition-[width] duration-600"
          style={{ width: `${pct}%`, transitionTimingFunction: 'cubic-bezier(.2,.7,.2,1)' }}
        />
        <div
          className="absolute top-0 transition-[left] duration-600"
          style={{ left: `${pct}%`, transitionTimingFunction: 'cubic-bezier(.2,.7,.2,1)' }}
        >
          <div style={{ transform: 'translateX(-40%)', filter: 'drop-shadow(0 6px 10px rgba(40,54,24,.25))' }}>
            <KlaroPlane width={46} height={37} shadow={false} />
          </div>
        </div>
      </div>

      {/* Frageblock tritt bei jedem Wechsel neu und gestaffelt ein */}
      <div key={index}>
        <p className="mt-8.5 m-0 text-[13px] font-semibold tracking-[.18em] uppercase text-olive" style={{ animation: 'rise .5s var(--ease-out) both' }}>
          Frage {index + 1} von {fragen.length}
        </p>
        <h1 className="mt-3 m-0 font-serif font-normal text-[clamp(30px,4.4vw,44px)] leading-[1.15] text-pine" style={{ animation: 'rise .55s var(--ease-out) .06s both' }}>
          {frage.titel}
        </h1>
        {frage.hinweis && <p className="mt-3 text-base text-pine/65" style={{ animation: 'rise .55s var(--ease-out) .1s both' }}>{frage.hinweis}</p>}

        <div className="mt-8 flex flex-col gap-3" role="group" aria-label={frage.titel}>
          {frage.optionen.map((o, i) => (
            <button
              key={o.wert}
              onClick={() => waehle(o.wert)}
              className={`min-h-[58px] text-left rounded-2xl px-5.5 py-4 text-[17px] font-semibold border-[1.5px] transition-[transform,border-color,background-color,color] duration-200 hover:translate-x-1.5 active:scale-[.99]
                ${gewaehlt === o.wert
                  ? 'border-olive bg-olive text-cream'
                  : 'border-pine/20 bg-cream-card text-pine hover:border-olive/60'}`}
              style={{ animation: `rise .5s var(--ease-out) ${0.12 + i * 0.05}s both` }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-9 flex justify-between items-center">
        {index > 0 ? (
          <button
            onClick={() => setIndex(i => i - 1)}
            className="rounded-pill border-[1.5px] border-pine/30 px-5.5 py-2.75 text-sm font-semibold text-pine hover:border-pine transition"
          >
            ← Zurück
          </button>
        ) : <span />}
        <button onClick={onAbbruch} className="ml-auto text-sm text-pine/55 underline underline-offset-3">
          {abschlussLabel}
        </button>
      </div>
    </div>
  )
}
