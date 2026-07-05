import { Link } from 'react-router-dom'
import { kategorie, vergleichFuerTask } from '../data/vergleich'

// Kleiner Pill-Link von einer Aufgabe direkt ins passende Vergleichsmodul.
export default function VergleichChip({ journeyId, taskId }: { journeyId: string; taskId: string }) {
  const katIds = vergleichFuerTask[`${journeyId}:${taskId}`] ?? []
  if (katIds.length === 0) return null
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {katIds.map(id => {
        const kat = kategorie(id)
        if (!kat) return null
        return (
          <Link
            key={id}
            to={`/vergleich/${id}`}
            className="rounded-pill bg-pine-mist px-2.5 py-1 text-xs font-display font-semibold text-pine hover:bg-coral hover:text-white transition"
          >
            ⚖ Vergleich: {kat.titel} →
          </Link>
        )
      })}
    </span>
  )
}
