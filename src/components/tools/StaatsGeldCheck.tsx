import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import localforage from 'localforage'

const store = localforage.createInstance({ name: 'startklar', storeName: 'tools' })

interface Result {
  bafog: boolean
  wohngeld: boolean
  status: string
  wohnsituation: string
  support: string
}

export default function StaatsGeldCheck() {
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [answers, setAnswers] = useState({
    status: null as string | null,
    wohnsituation: null as string | null,
    support: null as string | null,
  })

  useEffect(() => {
    store.getItem<{ result: Result; answers: any }>('staatsgeldcheck').then(data => {
      if (data?.result) {
        setResult(data.result)
        setAnswers(data.answers)
      }
    })
  }, [])

  const handleAnswer = (key: keyof typeof answers, value: string) => {
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    if (step === 0) {
      setStep(1)
    } else if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      const finalResult = calculateResult(newAnswers)
      setResult(finalResult)
      store.setItem('staatsgeldcheck', { result: finalResult, answers: newAnswers })
    }
  }

  const calculateResult = (ans: any) => ({
    bafog: ans.status === 'student' || ans.status === 'azubi',
    wohngeld: ans.wohnsituation === 'ausgezogen' && ans.support === 'etwas',
    status: ans.status,
    wohnsituation: ans.wohnsituation,
    support: ans.support,
  })

  const reset = () => {
    setStep(0)
    setResult(null)
    setAnswers({ status: null, wohnsituation: null, support: null })
    store.removeItem('staatsgeldcheck')
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-8">
        <div>
          <Link to="/tools" className="text-sm text-pine underline">← Zurück zu Tools</Link>
          <h1 className="font-serif text-4xl font-bold text-pine mt-4">StaatsGeldCheck</h1>
        </div>

        <div className="space-y-6">
          {result.bafog && (
            <div className="rounded-card bg-cream-card border border-pine-mist p-8">
              <p className="text-sm text-ink/60 uppercase font-semibold tracking-widest mb-2">BAföG</p>
              <h2 className="font-serif text-2xl font-bold text-coral mb-4">Könnte für dich in Frage kommen</h2>
              <p className="text-ink/80 mb-4">
                BAföG unterstützt Studi und Auszubildende. Eine offizielle Stelle hilft dir weiter.
              </p>
              <Link
                to="/journey/start/task/bafoeg"
                className="block p-3 rounded-card bg-pine text-cream hover:bg-forest transition font-display font-semibold text-center text-sm"
              >
                Zur BAföG-Aufgabe
              </Link>
            </div>
          )}

          {result.wohngeld && (
            <div className="rounded-card bg-cream-card border border-pine-mist p-8">
              <p className="text-sm text-ink/60 uppercase font-semibold tracking-widest mb-2">Wohngeld</p>
              <h2 className="font-serif text-2xl font-bold text-coral mb-4">Könnte für dich in Frage kommen</h2>
              <p className="text-ink/80 mb-4">
                Wohngeld hilft, wenn die Miete schwer zu tragen ist. Es ist nicht zu schade, danach zu fragen.
              </p>
            </div>
          )}

          {!result.bafog && !result.wohngeld && (
            <div className="rounded-card bg-cream-card border border-pine-mist p-8">
              <p className="text-sm text-ink/60 uppercase font-semibold tracking-widest mb-2">Ergebnis</p>
              <h2 className="font-serif text-2xl font-bold text-coral mb-4">Gerade keine Angebote erkannt</h2>
              <p className="text-ink/80">
                Das bedeutet nicht, dass nichts für dich da ist. Schau gerne bei offiziellen Stellen vorbei – manchmal gibt es Überraschungen.
              </p>
            </div>
          )}

          <button
            onClick={reset}
            className="block w-full p-4 rounded-card border-2 border-pine text-pine hover:bg-cream transition font-display font-semibold"
          >
            Noch einmal durchgehen
          </button>
        </div>

        <p className="text-xs text-ink/60">Keine Finanzberatung. Erkundige dich bei offiziellen Stellen.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-8">
      <Link to="/tools" className="text-sm text-pine underline">← Zurück zu Tools</Link>

      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">StaatsGeldCheck</h1>
        <p className="mt-2 text-ink/80">Kurz checken, welche Unterstützung passen könnte.</p>
      </div>

      <div className="rounded-card bg-cream-card border border-pine-mist p-8">
        <div className="mb-6">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`h-1 flex-1 rounded ${i < step ? 'bg-coral' : i === step ? 'bg-pine' : 'bg-pine-mist'}`}
              />
            ))}
          </div>
        </div>

        {step === 0 && (
          <div>
            <p className="font-display text-xl font-semibold text-pine mb-6">Was beschreibt dich gerade?</p>
            <div className="space-y-3">
              {[
                { val: 'student', label: 'Student:in' },
                { val: 'azubi', label: 'Azubi' },
                { val: 'berufstaetig', label: 'Bereits berufstätig' },
                { val: 'suchend', label: 'Auf der Suche' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer('status', opt.val)}
                  className="block w-full p-4 rounded-card bg-coral text-cream hover:bg-coral-deep transition font-semibold text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="font-display text-xl font-semibold text-pine mb-6">Wo wohnst du?</p>
            <div className="space-y-3">
              {[
                { val: 'eltern', label: 'Bei meinen Eltern' },
                { val: 'ausgezogen', label: 'Allein oder mit anderen' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer('wohnsituation', opt.val)}
                  className="block w-full p-4 rounded-card bg-coral text-cream hover:bg-coral-deep transition font-semibold text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="font-display text-xl font-semibold text-pine mb-6">Wie sieht es mit Unterstützung von Familie aus?</p>
            <div className="space-y-3">
              {[
                { val: 'viel', label: 'Viel unterstützt' },
                { val: 'etwas', label: 'Etwas, aber nicht alles' },
                { val: 'kaum', label: 'Kaum oder gar nicht' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer('support', opt.val)}
                  className="block w-full p-4 rounded-card bg-coral text-cream hover:bg-coral-deep transition font-semibold text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
