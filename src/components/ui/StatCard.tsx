interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  className?: string
}

export default function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div
      className={`rounded-card bg-cream-card border border-pine-mist p-5 md:p-6 flex flex-col justify-between gap-3 min-h-32 ${
        className ?? ''
      }`}
    >
      <p className="text-xs font-semibold tracking-widest text-ink/60 uppercase">{label}</p>
      <div>
        <p className="font-serif text-4xl md:text-5xl font-bold text-coral leading-none">{value}</p>
        {hint && <p className="mt-2 text-xs text-ink/50">{hint}</p>}
      </div>
    </div>
  )
}
