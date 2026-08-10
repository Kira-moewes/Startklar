import { useState } from 'react'
import AgentPanel from './AgentPanel'
import PaperPlane from '../PaperPlane'

// Schwebender Klaro-Knopf, auf allen Seiten sichtbar (im Layout eingehängt).
export default function AgentButton() {
  const [offen, setOffen] = useState(false)

  return (
    <>
      {!offen && (
        <button
          onClick={() => setOffen(true)}
          aria-label="Klaro fragen"
          className="no-print fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 rounded-pill bg-band text-paper pl-3.5 pr-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,.3)] hover:scale-105 transition"
        >
          <PaperPlane width={30} height={24} shadow={false} />
          <span className="font-serif text-lg leading-none">Klaro</span>
        </button>
      )}
      {offen && <AgentPanel onClose={() => setOffen(false)} />}
    </>
  )
}
