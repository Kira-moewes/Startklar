import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import localforage from 'localforage'

const store = localforage.createInstance({ name: 'startklar', storeName: 'tools' })

type Result = 'likely' | 'unlikely' | null

export default function SteuerCheck() {
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<Result>(null)
  const [answers, setAnswers] = useState({ income: null as boolean | null, expenses: null as boolean | null, education: null as boolean | null })

  useEffect(() => {
    store.getItem<{ result: Result; answers: any }>('stuercheck').then(data => {
      if (data?.result) {
        setResult(data.result)
        setAnswers(data.answers)
      }
    })
  }, [])

  const handleAnswer = (key: keyof typeof answers, value: boolean) => {
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    if (step === 0) {
      setStep(1)
    } else if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      const finalResult = calculateResult(newAnswers)
      setResult(finalResult)
      store.setItem('stuercheck', { result: finalResult, answers: newAnswers })
    }
  }

  const calculateResult = (ans: any) => {
    // If ANY factor suggests it might be worth it, lean toward "likely"
    if (ans.income || ans.expenses || ans.education) {
      return 'likely'
    }
    return 'unlikely'
  }

  const reset = () => {
    setStep(0)
    setResult(null)
    setAnswers({ income: null, expenses: null, education: null })
    store.removeItem('stuercheck')
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-8">
        <div>
          <Link to="/tools" className="text-sm text-pine underline">← Zurück zu Tools</Link>
          <h1 className="font-serif text-4xl font-bold text-pine mt-4">SteuerCheck</h1>
        </div>

        <div className="rounded-card bg-cream-card border border-pine-mist p-8">
          <p className="text-sm text-ink/60 uppercase font-semibold tracking-widest mb-2">Dein Ergebnis</p>
          <h2 className="font-serif text-3xl font-bold text-coral mb-6">
            {result === 'likely'
              ? 'Wahrscheinlich lohnt es sich'
              : 'Eher nicht dringend'}
          </h2>
          <p className="text-lg text-ink/80 mb-6">
            {result === 'likely'
              ? 'Eine Steuererklärung könnte dir Geld zurückbringen. Schau dir an, wie es funktioniert.'
              : 'Bei deiner Situation ist eine Steuererklärung eher nicht notwendig. Falls sich das ändert, kommen wir gerne darauf zurück.'}
          </p>

          <div className="space-y-3 mb-8">
            <Link
              to="/journey/finanzen/task/steuererklaerung"
              className="block p-4 rounded-card bg-pine text-cream hover:bg-forest transition font-display font-semibold text-center"
            >
              Zur Steuererklärung-Aufgabe
            </Link>
            <button
              onClick={reset}
              className="block w-full p-4 rounded-card border-2 border-pine text-pine hover:bg-cream transition font-display font-semibold"
            >
              Noch einmal durchgehen
            </button>
          </div>
        </div>

        <p className="text-xs text-ink/60">Keine Steuerberatung. Angaben können sich ändern.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-8">
      <Link to="/tools" className="text-sm text-pine underline">← Zurück zu Tools</Link>

      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">SteuerCheck</h1>
        <p className="mt-2 text-ink/80">3 einfache Fragen – dann weißt du Bescheid.</p>
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
            <p className="font-display text-xl font-semibold text-pine mb-6">
              Hast du in diesem Jahr Einkommen gehabt (Gehalt, Ausbildungsvergütung, Freelance)?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('income', true)}
                className="block w-full p-4 rounded-card bg-coral text-cream hover:bg-coral-deep transition font-semibold"
              >
                Ja
              </button>
              <button
                onClick={() => handleAnswer('income', false)}
                className="block w-full p-4 rounded-card border-2 border-pine text-pine hover:bg-cream transition font-semibold"
              >
                Nein
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="font-display text-xl font-semibold text-pine mb-6">
              Hattest du Werbungskosten oder Homeoffice-Kosten zum Absetzen?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('expenses', true)}
                className="block w-full p-4 rounded-card bg-coral text-cream hover:bg-coral-deep transition font-semibold"
              >
                Ja, einige
              </button>
              <button
                onClick={() => handleAnswer('expenses', false)}
                className="block w-full p-4 rounded-card border-2 border-pine text-pine hover:bg-cream transition font-semibold"
              >
                Nein, keine
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="font-display text-xl font-semibold text-pine mb-6">
              Bist du Azubi, Studi oder in einer Ausbildung?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('education', true)}
                className="block w-full p-4 rounded-card bg-coral text-cream hover:bg-coral-deep transition font-semibold"
              >
                Ja
              </button>
              <button
                onClick={() => handleAnswer('education', false)}
                className="block w-full p-4 rounded-card border-2 border-pine text-pine hover:bg-cream transition font-semibold"
              >
                Nein
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-ink/60">Keine Steuerberatung. Angaben können sich ändern.</p>
    </div>
  )
}
