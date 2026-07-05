const chips = [
  'Was ist mein nächster Schritt?',
  'Was ist überfällig?',
  'Wie weit bin ich?',
  'Was kannst du?',
]

export default function QuickChips({ onPick, disabled }: { onPick: (frage: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(c => (
        <button
          key={c}
          onClick={() => onPick(c)}
          disabled={disabled}
          className="rounded-pill border border-pine/20 bg-cream-card text-pine px-3.5 py-1.5 text-[13px] font-semibold hover:border-olive transition disabled:opacity-50"
        >
          {c}
        </button>
      ))}
    </div>
  )
}
