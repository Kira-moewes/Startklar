interface StatCardProps {
  label: string
  value: string | number
  className?: string
}

export default function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div
      className={`rounded-card bg-cream-card border border-pine-mist p-8 flex flex-col justify-between min-h-48 ${
        className ?? ''
      }`}
    >
      <p className="text-xs font-semibold tracking-widest text-ink/60 uppercase">{label}</p>
      <p className="font-serif text-5xl md:text-6xl font-bold text-coral leading-none">
        {value}
      </p>
    </div>
  )
}
