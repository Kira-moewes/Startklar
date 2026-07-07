import type { AgentMessage } from '../../data/agent/types'

export default function MessageBubble({ msg, onLink }: { msg: AgentMessage; onLink: (route: string) => void }) {
  if (msg.rolle === 'nutzer') {
    return (
      <div className="flex justify-end">
        <p className="m-0 max-w-[85%] rounded-2xl rounded-br-md bg-pine text-cream px-4 py-2.5 text-[15px] leading-relaxed">
          {msg.text}
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-cream-card border border-pine/14 px-4 py-3">
        <p className="m-0 text-[15px] leading-relaxed text-pine/90 whitespace-pre-wrap">{msg.text}</p>
        {msg.quelle === 'ki' && (
          <p className="m-0 mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-olive/80">KI-Antwort</p>
        )}
        {msg.quelle === 'lokal' && (
          <p className="m-0 mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-pine/45">Lokal – auf deinem Gerät</p>
        )}
      </div>
      {msg.links && msg.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {msg.links.map((l, i) => (
            <button
              key={`${l.route}-${i}`}
              onClick={() => onLink(l.route)}
              className="rounded-pill border-[1.5px] border-olive/50 text-olive px-3.5 py-1.5 text-[13px] font-semibold hover:bg-olive hover:text-cream transition"
            >
              {l.label} →
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
