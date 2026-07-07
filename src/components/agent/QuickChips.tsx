export type QuickChip = { label: string; frage: string }

export default function QuickChips({ chips, onPick, disabled }: {
  chips: QuickChip[]
  onPick: (frage: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(c => (
        <button
          key={c.label}
          onClick={() => onPick(c.frage)}
          disabled={disabled}
          className="rounded-pill border border-pine/20 bg-cream-card text-pine px-3.5 py-1.5 text-[13px] font-semibold hover:border-olive transition disabled:opacity-50"
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
