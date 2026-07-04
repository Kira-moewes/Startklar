interface BarProps {
  label: string
  value: number
  max: number
}

export default function Bar({ label, value, max }: BarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div
      className="flex items-center gap-4"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-ink/70 mb-2">{label}</p>
        <div className="h-3 rounded-full bg-pine-mist overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-olive to-coral transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div
        className="font-serif text-3xl font-bold text-coral min-w-16 text-right"
        aria-hidden="false"
      >
        {value}/{max}
      </div>
    </div>
  )
}
