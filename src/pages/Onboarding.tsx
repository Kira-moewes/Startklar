import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fragen, type Profile } from '../data/profile'
import { useProfile } from '../hooks/useProfile'

export default function Onboarding() {
  const navigate = useNavigate()
  const { profile, save } = useProfile()
  const [antworten, setAntworten] = useState<Profile>(profile ?? {})
  const [index, setIndex] = useState(0)

  const frage = fragen[index]
  const letzte = index === fragen.length - 1
  const gewaehlt = antworten[frage.feld]

  const waehle = (wert: string) => {
    const next = { ...antworten, [frage.feld]: wert } as Profile
    setAntworten(next)
    if (letzte) {
      void save(next).then(() => navigate('/'))
    } else {
      setIndex(i => i + 1)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12 flex flex-col gap-8">
      <div className="flex items-center gap-2" aria-label={`Frage ${index + 1} von ${fragen.length}`}>
        {fragen.map((f, i) => (
          <span key={f.feld} className={`h-2 flex-1 rounded-pill ${i <= index ? 'bg-coral' : 'bg-pine-mist'}`} />
        ))}
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold text-pine">{frage.titel}</h1>
        {frage.hinweis && <p className="mt-2 text-ink/70">{frage.hinweis}</p>}
      </div>

      <div className="flex flex-col gap-3" role="group" aria-label={frage.titel}>
        {frage.optionen.map(o => (
          <button
            key={o.wert}
            onClick={() => waehle(o.wert)}
            className={`min-h-14 rounded-card border-2 px-5 text-left font-display font-semibold transition
              ${gewaehlt === o.wert
                ? 'border-coral bg-coral text-white'
                : 'border-pine-mist bg-cream-card text-pine active:border-coral'}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        {index > 0 ? (
          <button onClick={() => setIndex(i => i - 1)}
                  className="min-h-12 rounded-pill border-2 border-pine px-5 font-display font-semibold text-pine">
            ← Zurück
          </button>
        ) : <span />}
        <button onClick={() => navigate('/')} className="text-sm text-ink/60 underline underline-offset-2">
          Später machen
        </button>
      </div>
    </div>
  )
}
