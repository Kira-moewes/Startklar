import { useEffect, useState } from 'react'

// Zählt beim Einblenden von 0 auf `target` hoch (ease-out cubic, ~1.4s),
// wie im Redesign. Bei reduzierter Bewegung wird direkt der Endwert gezeigt.
export function useCountUp(target: number, duration = 1400): number {
  const [t, setT] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(1)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setT(1 - Math.pow(1 - p, 3))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    setT(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  return Math.round(target * t)
}
