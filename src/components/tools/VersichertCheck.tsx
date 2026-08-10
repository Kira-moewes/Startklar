import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import localforage from 'localforage'
import { faktum } from '../../data/fakten'

const store = localforage.createInstance({ name: 'startklar', storeName: 'tools' })

interface Result {
  status: string
  volljaehrig: string
  message: string
}

export default function VersichertCheck() {
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [answers, setAnswers] = useState({
    volljaehrig: null as string | null,
    status: null as string | null,
  })

  useEffect(() => {
    store.getItem<{ result: Result; answers: any }>('versichertcheck').then(data => {
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
      const finalResult = calculateResult(newAnswers)
      setResult(finalResult)
      store.setItem('versichertcheck', { result: finalResult, answers: newAnswers })
    }
  }

  const calculateResult = (ans: any): Result => {
    if (ans.volljaehrig === 'ja' && ans.status === 'student') {
      return {
        volljaehrig: 'ja',
        status: 'student',
        message: 'Vermutlich noch familienversichert – aber prüfe es kurz mit deinen Eltern oder der Krankenkasse.',
      }
    }
    if (ans.volljaehrig === 'nein') {
      return {
        volljaehrig: 'nein',
        status: ans.status,
        message: 'Deine Eltern können dich über ihre Versicherung mitversichern – sehr wahrscheinlich kostenlos.',
      }
    }
    return {
      volljaehrig: ans.volljaehrig,
      status: ans.status,
      message: 'Du solltest dich selbst anmelden oder klären, wie es mit deiner Versicherung aussieht.',
    }
  }

  const reset = () => {
    setStep(0)
    setResult(null)
    setAnswers({ volljaehrig: null, status: null })
    store.removeItem('versichertcheck')
  }

  const fristFamilienversicherung = faktum('FRIST_FAMILIENVERSICHERUNG')

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-8">
        <div>
          <Link to="/tools" className="text-sm text-pine underline">← Zurück zu Tools</Link>
          <h1 className="font-serif text-4xl font-bold text-pine mt-4">VersichertCheck</h1>
        </div>

        <div className="rounded-card bg-cream-card border border-pine-mist p-8">
          <p className="text-sm text-ink/60 uppercase font-semibold tracking-widest mb-2">Deine Situation</p>
          <h2 className="font-serif text-2xl font-bold text-coral mb-6">{result.message}</h2>

          <div className="space-y-3 mb-8 bg-cornsilk p-4 rounded-card">
            <p className="text-sm font-semibold text-ink/80">
              {fristFamilienversicherung?.geprueft === null ? (
                <span>Die Frist läuft oft bis {fristFamilienversicherung?.wert}</span>
              ) : (
                <span>Prüfe die aktuelle Frist – sie kann sich ändern.</span>
              )}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <Link
              to="/journey/start/task/krankenkasse-check"
              className="block p-3 rounded-card bg-pine text-cream hover:bg-forest transition font-display font-semibold text-center text-sm"
            >
              Zur Krankenversicherung-Aufgabe
            </Link>
            <button
              onClick={reset}
              className="block w-full p-3 rounded-card border-2 border-pine text-pine hover:bg-cream transition font-display font-semibold text-sm"
            >
              Noch einmal durchgehen
            </button>
          </div>
        </div>

        <p className="text-xs text-ink/60">Keine Versicherungsberatung. Fragen stellen, klären, sicher gehen.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-8">
      <Link to="/tools" className="text-sm text-pine underline">← Zurück zu Tools</Link>

      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">VersichertCheck</h1>
        <p className="mt-2 text-ink/80">Bin ich noch in der Familienversicherung?</p>
      </div>

      <div className="rounded-card bg-cream-card border border-pine-mist p-8">
        <div className="mb-6">
          <div className="flex gap-1">
            {[0, 1].map(i => (
              <div
                key={i}
                className={`h-1 flex-1 rounded ${i < step ? 'bg-coral' : i === step ? 'bg-pine' : 'bg-pine-mist'}`}
              />
            ))}
          </div>
        </div>

        {step === 0 && (
          <div>
            <p className="font-display text-xl font-semibold text-pine mb-6">Bist du schon 18?</p>
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('volljaehrig', 'ja')}
                className="block w-full p-4 rounded-card bg-coral text-cream hover:bg-coral-deep transition font-semibold"
              >
                Ja
              </button>
              <button
                onClick={() => handleAnswer('volljaehrig', 'nein')}
                className="block w-full p-4 rounded-card border-2 border-pine text-pine hover:bg-cream transition font-semibold"
              >
                Noch nicht
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="font-display text-xl font-semibold text-pine mb-6">Was beschreibt dich gerade?</p>
            <div className="space-y-3">
              {[
                { val: 'schueler', label: 'Schüler:in' },
                { val: 'student', label: 'Student:in' },
                { val: 'azubi', label: 'Azubi' },
                { val: 'berufstaetig', label: 'Berufstätig' },
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
      </div>
    </div>
  )
}
