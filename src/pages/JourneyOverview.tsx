import { Link, useParams } from 'react-router-dom'
import { journeys } from '../data'
import { relevanteTasks } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useProgress } from '../hooks/useProgress'
import CategoryBadge from '../components/CategoryBadge'

export default function JourneyOverview() {
  const { journeyId = '' } = useParams()
  const { profile } = useProfile()
  const journey = journeys.find(j => j.id === journeyId)
  const tasks = journey ? relevanteTasks(journey, profile) : []
  const taskIds = tasks.map(t => t.id)
  const { done, toggle, doneCount, loading } = useProgress(journeyId, taskIds)

  if (!journey) return <p className="p-6">Diesen Bereich gibt es nicht. <Link to="/" className="underline">Zur Startseite</Link></p>

  const total = tasks.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0
  const allDone = !loading && total > 0 && doneCount === total

  return (
    <div className="mx-auto max-w-[860px] w-full px-7 pt-12 pb-24">
      <Link to="/" className="text-sm font-semibold text-olive">← Alle Bereiche</Link>
      <h1 className="mt-4.5 m-0 font-serif font-normal text-[clamp(36px,5vw,56px)] leading-[1.08] text-pine" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        {journey.title}
      </h1>
      <p className="mt-3 m-0 text-[17px] text-pine/70" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .05s both' }}>
        {journey.subtitle}
      </p>

      <section
        aria-label="Fortschritt"
        className="mt-8 bg-band text-paper rounded-[20px] px-7 py-6"
        style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .1s both' }}
      >
        <div className="flex justify-between items-baseline gap-4">
          <p className="m-0 font-semibold text-base">{doneCount} von {total} erledigt</p>
          <p className="m-0 font-serif text-[26px]">{pct} %</p>
        </div>
        <div className="mt-3.5 h-2.5 rounded-pill bg-paper/18 overflow-hidden" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={total}>
          <div className="h-full rounded-pill bg-paper transition-all duration-600" style={{ width: `${pct}%` }} />
        </div>
        {allDone && (
          <p className="mt-3.5 m-0 text-[15px] text-[#C9D3A0]">
            Alles erledigt — stark! Du hast die wichtigsten Schritte hinter dir.
          </p>
        )}
      </section>

      <ul aria-label="Aufgaben" className="mt-7 flex flex-col gap-3.5 list-none p-0 m-0">
        {tasks.map((task, i) => {
          const isDone = done[task.id] ?? false
          return (
            <li
              key={task.id}
              className="bg-cream-card border border-pine/14 rounded-[18px] px-5.5 py-5 flex gap-4 items-start transition hover:border-olive hover:translate-x-1"
              style={{ animation: `rise .55s cubic-bezier(.2,.7,.2,1) ${i * 0.06}s both` }}
            >
              <button
                onClick={() => toggle(task.id)}
                aria-label={`${task.title} als erledigt markieren`}
                aria-pressed={isDone}
                className={`flex-none mt-0.5 size-[30px] rounded-full border-2 text-cream text-[15px] font-bold flex items-center justify-center transition-colors duration-250
                  ${isDone ? 'border-olive bg-olive' : 'border-pine/35 bg-transparent'}`}
              >
                {isDone ? '✓' : ''}
              </button>
              <Link to={`/journey/${journey.id}/task/${task.id}`} className="flex-1 min-w-0">
                <span className="flex items-center gap-2.5 flex-wrap">
                  <span className={`font-serif text-[21px] font-medium ${isDone ? 'text-pine/40 line-through' : 'text-pine'}`}>
                    {task.title}
                  </span>
                  <CategoryBadge category={task.category} />
                </span>
                <span className="block mt-1.5 text-[14.5px] leading-relaxed text-pine/70">{task.summary}</span>
                <span className="block mt-2 text-[13.5px] font-semibold text-olive">Frist: {task.deadline}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
