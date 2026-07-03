import type { TaskCategory } from '../data/types'

const meta: Record<TaskCategory, { label: string; cls: string }> = {
  amt: { label: 'Amt', cls: 'bg-pine text-cream' },
  versicherung: { label: 'Versicherung', cls: 'bg-pine-soft text-cream' },
  wohnen: { label: 'Wohnen', cls: 'bg-coral text-white' },
  finanzen: { label: 'Finanzen', cls: 'bg-coral-deep text-white' },
  mobilitaet: { label: 'Mobilität', cls: 'bg-pine-mist text-pine' },
}

export default function CategoryBadge({ category }: { category: TaskCategory }) {
  const m = meta[category]
  return (
    <span className={`inline-block rounded-pill px-3 py-1 text-xs font-display font-semibold ${m.cls}`}>
      {m.label}
    </span>
  )
}
