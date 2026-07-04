import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { relevanteTasks, istRelevant } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useProgress } from '../hooks/useProgress'
import Ring from '../components/ui/Ring'
import Bar from '../components/ui/Bar'
import StatCard from '../components/ui/StatCard'
import Heatmap from '../components/ui/Heatmap'

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile()

  // Get relevant journeys
  const relevantJourneys = useMemo(
    () => journeys.filter(j => istRelevant(profile, j.id)),
    [profile]
  )

  // For each relevant journey, collect tasks and progress
  const journeyData = useMemo(() => {
    return relevantJourneys.map(journey => {
      const tasks = relevanteTasks(journey, profile)
      return {
        journey,
        tasks,
        taskCount: tasks.length,
      }
    })
  }, [relevantJourneys, profile])

  // Load progress for all journeys by calling useProgress for each one
  const progressByJourney = journeyData.map(jd => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const taskIds = jd.tasks.map(t => t.id)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { done, doneCount } = useProgress(jd.journey.id, taskIds)
    return { journeyId: jd.journey.id, done, doneCount, taskCount: taskIds.length }
  })

  // Calculate aggregated stats
  const stats = useMemo(() => {
    const totalDone = progressByJourney.reduce((sum, p) => sum + p.doneCount, 0)
    const totalTasks = progressByJourney.reduce((sum, p) => sum + p.taskCount, 0)
    const overallPercent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0
    return {
      totalDone,
      totalTasks,
      overallPercent,
      numAreas: journeyData.length,
    }
  }, [progressByJourney, journeyData])

  // Create heatmap data: 5 weeks × 7 days grid
  // Distribute done count across cells
  const heatmapData = useMemo(() => {
    const cellCount = 35 // 5 weeks × 7 days
    const cells = new Array(cellCount).fill(0)
    const totalDone = stats.totalDone

    if (totalDone > 0) {
      // Distribute tasks proportionally across cells, with later cells getting more density
      for (let i = 0; i < cellCount; i++) {
        const weight = 1 + (i / cellCount) * 0.5 // Later cells are slightly heavier
        cells[i] = Math.round((totalDone / cellCount) * weight)
      }
    }

    return cells
  }, [stats.totalDone])

  // Find next tasks (first 1-3 not done from relevant journeys)
  const nextTasks = useMemo(() => {
    const notDone: Array<{ journeyId: string; task: any }> = []

    journeyData.forEach(jd => {
      const journeyProgress = progressByJourney.find(p => p.journeyId === jd.journey.id)
      if (journeyProgress) {
        jd.tasks.forEach(task => {
          if (!journeyProgress.done[task.id]) {
            notDone.push({ journeyId: jd.journey.id, task })
          }
        })
      }
    })

    return notDone.slice(0, 3)
  }, [journeyData, progressByJourney])

  if (profileLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-ink/60">Lädt...</p>
      </div>
    )
  }

  // Empty state
  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-pine">Dein Überblick</h1>
          <p className="mt-2 text-lg text-ink/80">
            Schritt für Schritt. Wir zeigen dir, was noch zu tun ist.
          </p>
        </div>
        <div className="rounded-card bg-cream-card border border-pine-mist p-8">
          <p className="text-ink/80 mb-4">Du hast noch keine Angaben gemacht. Lass uns mit einer Frage starten – dann zeigen wir dir nur, was für dich zählt.</p>
          <Link
            to="/onboarding"
            className="inline-block rounded-pill bg-pine px-6 py-3 font-display font-semibold text-cream hover:bg-forest transition"
          >
            Los geht's
          </Link>
        </div>
      </div>
    )
  }

  // Nothing done yet
  if (stats.totalDone === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-pine">Dein Überblick</h1>
          <p className="mt-2 text-lg text-ink/80">
            Schritt für Schritt. Wir zeigen dir, was noch zu tun ist.
          </p>
        </div>
        <div className="rounded-card bg-cream-card border border-pine-mist p-8">
          <p className="text-ink/80 mb-6">
            Du hast noch nichts angefangen – sehr normal! Wähle einen Bereich und leg los, wann es passt.
          </p>
          {journeyData.length > 0 && (
            <div className="space-y-3">
              {journeyData.slice(0, 2).map(jd => (
                <Link
                  key={jd.journey.id}
                  to={`/journey/${jd.journey.id}`}
                  className="block p-4 rounded-card bg-cream border border-pine-mist hover:border-coral transition"
                >
                  <p className="font-display font-semibold text-pine">{jd.journey.title}</p>
                  <p className="text-sm text-ink/70">{jd.taskCount} Schritte</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-12">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine">Dein Überblick</h1>
        <p className="mt-2 text-lg text-ink/80">
          Schritt für Schritt. Du packst das.
        </p>
      </div>

      {/* Top row: Big Ring + 3 StatCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        <div className="flex justify-center">
          <Ring
            value={stats.overallPercent}
            size={140}
            label={`${stats.overallPercent}%`}
          />
        </div>
        <StatCard
          label="Bereiche für dich"
          value={stats.numAreas}
        />
        <StatCard
          label="Schritte gesamt"
          value={stats.totalTasks}
        />
        <StatCard
          label="Erledigt"
          value={stats.totalDone}
        />
      </div>

      {/* Per-journey bars */}
      {progressByJourney.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-xl font-semibold text-pine">Deine Bereiche</h2>
          <div className="space-y-4">
            {progressByJourney.map((prog, idx) => {
              const journey = journeyData[idx].journey
              return (
                <Link
                  key={prog.journeyId}
                  to={`/journey/${prog.journeyId}`}
                  className="block p-5 rounded-card bg-cream-card border border-pine-mist hover:border-coral transition"
                >
                  <p className="text-sm font-medium text-ink/60 mb-3">{journey.title}</p>
                  <Bar
                    label=""
                    value={prog.doneCount}
                    max={prog.taskCount}
                  />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Heatmap */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-pine">Aktivität</h2>
        <Heatmap
          data={heatmapData}
          caption="Heller = mehr geschafft. (Letzte 5 Wochen)"
          cols={7}
        />
      </section>

      {/* Next tasks */}
      {nextTasks.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-pine">Zuletzt verpasst?</h2>
          <p className="text-sm text-ink/70 mb-4">Das sind deine nächsten Schritte:</p>
          <div className="space-y-3">
            {nextTasks.map((nt, i) => (
              <Link
                key={`${nt.journeyId}-${nt.task.id}`}
                to={`/journey/${nt.journeyId}/task/${nt.task.id}`}
                className="block p-4 rounded-card bg-cream-card border border-pine-mist hover:border-coral transition group"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-coral text-cream font-display font-semibold text-xs">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-pine group-hover:text-coral transition">
                      {nt.task.title}
                    </p>
                    <p className="text-sm text-ink/60 mt-1">{nt.task.summary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
