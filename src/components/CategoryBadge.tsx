import type { TaskCategory } from '../data/types'

const labels: Record<TaskCategory, string> = {
  amt: 'Amt',
  versicherung: 'Versicherung',
  wohnen: 'Wohnen',
  finanzen: 'Finanzen',
  mobilitaet: 'Mobilität',
  gesundheit: 'Gesundheit',
  recht: 'Recht',
  arbeit: 'Arbeit',
}

export default function CategoryBadge({ category }: { category: TaskCategory }) {
  return (
    <span className="inline-block rounded-pill border border-olive/40 px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[.06em] uppercase text-olive">
      {labels[category]}
    </span>
  )
}
