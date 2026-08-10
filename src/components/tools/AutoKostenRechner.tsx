import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import localforage from 'localforage'

const store = localforage.createInstance({ name: 'startklar', storeName: 'tools' })

interface CostData {
  insurance: number
  tax: number
  fuel: number
  maintenance: number
  tuev: number
}

export default function AutoKostenRechner() {
  const [costs, setCosts] = useState<CostData>({
    insurance: 0,
    tax: 0,
    fuel: 0,
    maintenance: 0,
    tuev: 0,
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    store.getItem<CostData>('autokostenrechner').then(data => {
      if (data) {
        setCosts(data)
        setSubmitted(true)
      }
    })
  }, [])

  const handleChange = (key: keyof CostData, value: string) => {
    setCosts(prev => ({ ...prev, [key]: parseFloat(value) || 0 }))
  }

  const handleSubmit = () => {
    store.setItem('autokostenrechner', costs)
    setSubmitted(true)
  }

  const handleReset = () => {
    setCosts({ insurance: 0, tax: 0, fuel: 0, maintenance: 0, tuev: 0 })
    setSubmitted(false)
    store.removeItem('autokostenrechner')
  }

  const monthlyTotal = Object.values(costs).reduce((a, b) => a + b, 0)
  const yearlyTotal = monthlyTotal * 12

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-8">
        <div>
          <Link to="/tools" className="text-sm text-pine underline">← Zurück zu Tools</Link>
          <h1 className="font-serif text-4xl font-bold text-pine mt-4">AutoKostenRechner</h1>
        </div>

        <p className="text-sm text-ink/60">Deine eigenen Zahlen — wir raten nichts.</p>

        <div className="space-y-6">
          <div className="rounded-card bg-cream-card border border-pine-mist p-8">
            <p className="text-sm text-ink/60 uppercase font-semibold tracking-widest mb-4">Pro Monat</p>
            <p className="font-serif text-5xl font-bold text-coral">{monthlyTotal.toFixed(2).replace('.', ',')} €</p>
          </div>

          <div className="rounded-card bg-cream-card border border-pine-mist p-8">
            <p className="text-sm text-ink/60 uppercase font-semibold tracking-widest mb-4">Pro Jahr</p>
            <p className="font-serif text-5xl font-bold text-coral">{yearlyTotal.toFixed(2).replace('.', ',')} €</p>
          </div>

          <div className="rounded-card bg-cornsilk p-6">
            <p className="text-sm mb-3">
              <span className="font-semibold">Versicherung:</span> {costs.insurance.toFixed(2).replace('.', ',')} € / Mo.
            </p>
            <p className="text-sm mb-3">
              <span className="font-semibold">Kfz-Steuer:</span> {costs.tax.toFixed(2).replace('.', ',')} € / Mo.
            </p>
            <p className="text-sm mb-3">
              <span className="font-semibold">Sprit:</span> {costs.fuel.toFixed(2).replace('.', ',')} € / Mo.
            </p>
            <p className="text-sm mb-3">
              <span className="font-semibold">Wartung:</span> {costs.maintenance.toFixed(2).replace('.', ',')} € / Mo.
            </p>
            <p className="text-sm">
              <span className="font-semibold">TÜV:</span> {costs.tuev.toFixed(2).replace('.', ',')} € / Mo.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="block w-full p-4 rounded-card border-2 border-pine text-pine hover:bg-cream transition font-display font-semibold"
          >
            Zahlen ändern
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-8">
      <Link to="/tools" className="text-sm text-pine underline">← Zurück zu Tools</Link>

      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">AutoKostenRechner</h1>
        <p className="mt-2 text-ink/80">Gib deine eigenen Zahlen ein – monatlich oder jährlich, wie du magst.</p>
      </div>

      <div className="rounded-card bg-cream-card border border-pine-mist p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            Versicherung (€/Monat)
          </label>
          <input
            type="number"
            value={costs.insurance}
            onChange={e => handleChange('insurance', e.target.value)}
            className="w-full p-3 rounded-card border border-pine-mist focus:border-coral outline-none"
            placeholder="z. B. 120"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            Kfz-Steuer (€/Monat)
          </label>
          <input
            type="number"
            value={costs.tax}
            onChange={e => handleChange('tax', e.target.value)}
            className="w-full p-3 rounded-card border border-pine-mist focus:border-coral outline-none"
            placeholder="z. B. 25"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            Sprit (€/Monat)
          </label>
          <input
            type="number"
            value={costs.fuel}
            onChange={e => handleChange('fuel', e.target.value)}
            className="w-full p-3 rounded-card border border-pine-mist focus:border-coral outline-none"
            placeholder="z. B. 150"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            Wartung & Reparatur (€/Monat)
          </label>
          <input
            type="number"
            value={costs.maintenance}
            onChange={e => handleChange('maintenance', e.target.value)}
            className="w-full p-3 rounded-card border border-pine-mist focus:border-coral outline-none"
            placeholder="z. B. 50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink/80 mb-2">
            TÜV & Abgasuntersuchung (€/Monat)
          </label>
          <input
            type="number"
            value={costs.tuev}
            onChange={e => handleChange('tuev', e.target.value)}
            className="w-full p-3 rounded-card border border-pine-mist focus:border-coral outline-none"
            placeholder="z. B. 30"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="block w-full p-4 rounded-pill bg-coral text-cream hover:bg-coral-deep transition font-display font-semibold"
        >
          Berechnen
        </button>
      </div>

      <p className="text-xs text-ink/60">Deine Daten speichern wir lokal auf deinem Gerät.</p>
    </div>
  )
}
