import { useState } from 'react'
import { tourSchritte } from '../../data/story'
import { Sprechblase } from './Charakter'

// Geführte Himmelstour: Fiete & Klaro erklären beim ersten Besuch die App.
// Bewusst als robuster Dialog am unteren Rand (kein zerbrechliches Anheften an
// Koordinaten). onFertig markiert die Tour als gesehen (im Profil wiederholbar).
export default function HimmelsTour({ onFertig }: { onFertig: () => void }) {
  const [i, setI] = useState(0)
  const schritt = tourSchritte[i]
  const letzter = i === tourSchritte.length - 1

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center px-5 pb-8" role="dialog" aria-label="Kurze Tour">
      {/* sanfter Schleier, damit der Fokus auf der Erklärung liegt */}
      <div className="absolute inset-0 bg-pine/25 backdrop-blur-[1px]" aria-hidden onClick={onFertig} />
      <div className="relative w-full max-w-[520px]">
        <Sprechblase
          wer={schritt.wer}
          name={schritt.name}
          text={schritt.text}
          onWeiter={() => (letzter ? onFertig() : setI(i + 1))}
          weiterLabel={schritt.weiterLabel ?? 'Weiter'}
          onSkip={letzter ? undefined : onFertig}
          skipLabel="Tour überspringen"
          fortschritt={`${i + 1} / ${tourSchritte.length}`}
        />
      </div>
    </div>
  )
}
