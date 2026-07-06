import type { AgentAction } from '../../data/agent/types'

function beschreibung(action: AgentAction): string {
  switch (action.typ) {
    case 'navigiere': return action.label
    case 'termin-vorschlag': return action.titel ? `Termin zu „${action.titel}" vorbereiten` : 'Neuen Termin vorbereiten'
    case 'erledigt-vorschlag': return `„${action.titel}" als erledigt markieren`
  }
}

export default function ActionCard({ action, onConfirm, onDecline }: {
  action: AgentAction
  onConfirm: (action: AgentAction) => void
  onDecline: () => void
}) {
  return (
    <div className="rounded-[14px] border-[1.5px] border-olive bg-olive/8 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <p className="m-0 text-sm font-semibold text-pine">{beschreibung(action)}</p>
      <span className="flex gap-2">
        <button
          onClick={() => onConfirm(action)}
          className="rounded-pill bg-olive text-cream px-4 py-1.5 text-[13px] font-semibold hover:opacity-90 transition"
        >
          Ja, machen
        </button>
        <button
          onClick={onDecline}
          className="rounded-pill border-[1.5px] border-pine/30 text-pine px-4 py-1.5 text-[13px] font-semibold hover:border-pine transition"
        >
          Lieber nicht
        </button>
      </span>
    </div>
  )
}
