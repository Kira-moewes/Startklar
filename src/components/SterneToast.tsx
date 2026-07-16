import { useEffect, useRef, useState } from 'react'
import { useGuthaben } from '../hooks/useGuthaben'

// Leises „+N ⭐"-Feedback. Reagiert NUR auf eine echte Erhöhung des Guthabens
// (vergleicht den vorherigen Kontostand), zeigt also nichts beim erneuten
// Abhaken eines bereits belohnten Schritts. Zeigt auch den Journey-Bonus
// mit an (z. B. +110 beim letzten Schritt einer Journey).
export default function SterneToast() {
  const { guthaben, loading } = useGuthaben()
  const vorher = useRef<number | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const [delta, setDelta] = useState<number | null>(null)

  useEffect(() => {
    if (loading) return
    const sterne = guthaben.sterne
    if (vorher.current === null) {
      vorher.current = sterne // Basiswert nach dem ersten Laden – kein Toast
      return
    }
    if (sterne > vorher.current) {
      setDelta(sterne - vorher.current)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setDelta(null), 2600)
    }
    vorher.current = sterne
  }, [guthaben.sterne, loading])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (delta === null) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
    >
      <div
        className="flex items-baseline gap-2 rounded-pill bg-olive text-on-akzent px-5 py-2.5 shadow-lg shadow-pine/25"
        style={{ animation: 'rise .5s cubic-bezier(.2,.7,.2,1) both' }}
      >
        <span className="font-serif text-[22px] leading-none" style={{ animation: 'coinDrop .9s cubic-bezier(.2,.7,.2,1) both' }}>
          +{delta} ⭐
        </span>
        <span className="text-sm font-semibold opacity-85">verdient</span>
      </div>
    </div>
  )
}
