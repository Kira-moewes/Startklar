import { useInView } from '../hooks/useInView'

// Scroll-Reveal: blendet Inhalte sanft ein, sobald sie in den Viewport
// scrollen (nur opacity/transform, GPU-freundlich). `delay` staffelt
// Gruppen; bei reduzierter Bewegung erscheint alles ohne Übergang.
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, '--reveal-y': `${y}px` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
