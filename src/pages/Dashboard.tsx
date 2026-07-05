import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { relevanteTasks, istRelevant } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useAllProgress } from '../hooks/useProgress'
import { useTermine } from '../hooks/useTermine'
import Ring from '../components/ui/Ring'
import Bar from '../components/ui/Bar'
import StatCard from '../components/ui/StatCard'
import Heatmap from '../components/ui/Heatmap'
import type { Task } from '../data/types'

const heute = () => new Date().toISOString().slice(0, 10)

function formatDatum(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long' })
}

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile()
  const { termine } = useTermine()

  const journeyData = useMemo(() => {
    return journeys
      .filter(j => istRelevant(profile, j.id))
      .map(journey => {
        const tasks = relevanteTasks(journey, profile)
        return { journey, tasks, taskIds: tasks.map(t => t.id) }
      })
  }, [profile])

  const progressItems = useMemo(
    () => journeyData.map(jd => ({ journeyId: jd.journey.id, taskIds: jd.taskIds })),
    [journeyData]
  )
  const { progress, dates, loading: progressLoading } = useAllProgress(progressItems)

  const stats = useMemo(() => {
    const totalDone = progress.reduce((sum, p) => sum + p.doneCount, 0)
    const totalTasks = progress.reduce((sum, p) => sum + p.taskCount, 0)
    return {
      totalDone,
      totalTasks,
      overallPercent: totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0,
      numAreas: journeyData.length,
    }
  }, [progress, journeyData])

  // Echte Aktivität: erledigte Aufgaben der letzten 5 Wochen, ein Feld pro Tag.
  const heatmapData = useMemo(() => {
    const cellCount = 35
    const cells = new Array(cellCount).fill(0)
    const today = new Date()
    for (const iso of Object.values(dates)) {
      const diff = Math.floor((today.getTime() - new Date(iso + 'T00:00:00').getTime()) / 86400000)
      if (diff >= 0 && diff < cellCount) cells[cellCount - 1 - diff] += 1
    }
    return cells
  }, [dates])

  // Zuletzt erledigte Aufgaben mit Datum
  const zuletztErledigt = useMemo(() => {
    const list: Array<{ journeyId: string; task: Task; datum: string }> = []
    journeyData.forEach(jd => {
      jd.tasks.forEach(task => {
        const d = dates[`${jd.journey.id}:${task.id}`]
        if (d) list.push({ journeyId: jd.journey.id, task, datum: d })
      })
    })
    return list.sort((a, b) => (a.datum < b.datum ? 1 : -1)).slice(0, 3)
  }, [journeyData, dates])

  const nextTasks = useMemo(() => {
    const notDone: Array<{ journeyId: string; task: Task }> = []
    journeyData.forEach(jd => {
      const journeyProgress = progress.find(p => p.journeyId === jd.journey.id)
      if (journeyProgress) {
        jd.tasks.forEach(task => {
          if (!journeyProgress.done[task.id]) notDone.push({ journeyId: jd.journey.id, task })
        })
      }
    })
    return notDone.slice(0, 3)
  }, [journeyData, progress])

  const naechsteTermine = useMemo(
    () => termine
      .filter(t => !t.erledigt && t.datum >= heute())
      .sort((a, b) => ((a.datum + (a.uhrzeit ?? '')) < (b.datum + (b.uhrzeit ?? '')) ? -1 : 1))
      .slice(0, 3),
    [termine]
  )
  const ueberfaellig = useMemo(
    () => termine.filter(t => !t.erledigt && t.datum < heute()).length,
    [termine]
  )

  if (profileLoading || progressLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-ink/60">Lädt...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-pine">Dein Fortschritt</h1>
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-12">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine">Dein Fortschritt</h1>
        <p className="mt-2 text-lg text-ink/80">
          {stats.totalDone === 0 ? 'Schritt für Schritt. Wir zeigen dir, wo du anfängst.' : 'Schritt für Schritt. Du packst das.'}
        </p>
      </div>

      {/* Kennzahlen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        <div className="flex justify-center">
          <Ring
            value={stats.overallPercent}
            size={140}
            label={`${stats.overallPercent}%`}
          />
        </div>
        <StatCard label="Bereiche für dich" value={stats.numAreas} />
        <StatCard label="Schritte gesamt" value={stats.totalTasks} />
        <StatCard label="Erledigt" value={stats.totalDone} />
      </div>

      {/* Termine-Vorschau */}
      {(naechsteTermine.length > 0 || ueberfaellig > 0) && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold text-pine">Deine nächsten Termine</h2>
            <Link to="/termine" className="text-sm text-pine underline underline-offset-2 hover:text-coral-deep">
              Alle Termine
            </Link>
          </div>
          {ueberfaellig > 0 && (
            <Link to="/termine" className="block rounded-card border-2 border-coral bg-cream-card p-4 text-coral-deep font-medium hover:bg-cream transition">
              {ueberfaellig} {ueberfaellig === 1 ? 'Termin ist' : 'Termine sind'} überfällig – schau kurz rein.
            </Link>
          )}
          <div className="space-y-3">
            {naechsteTermine.map(t => (
              <div key={t.id} className="rounded-card bg-cream-card border border-pine-mist p-4">
                <p className="font-display font-semibold text-pine">{t.titel}</p>
                <p className="text-sm text-ink/70">{formatDatum(t.datum)}{t.uhrzeit ? `, ${t.uhrzeit} Uhr` : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bereichs-Fortschritt */}
      {stats.totalTasks > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-xl font-semibold text-pine">Deine Bereiche</h2>
          <div className="space-y-4">
            {progress.map(prog => {
              const journey = journeyData.find(jd => jd.journey.id === prog.journeyId)?.journey
              if (!journey) return null
              return (
                <Link
                  key={prog.journeyId}
                  to={`/journey/${prog.journeyId}`}
                  className="block p-5 rounded-card bg-cream-card border border-pine-mist hover:border-coral transition"
                >
                  <p className="text-sm font-medium text-ink/60 mb-3">{journey.title}</p>
                  <Bar label="" value={prog.doneCount} max={prog.taskCount} />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Aktivität */}
      {stats.totalDone > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-pine">Aktivität</h2>
          <Heatmap
            data={heatmapData}
            caption="Ein Feld pro Tag, kräftiger = mehr erledigt. (Letzte 5 Wochen)"
            cols={7}
          />
        </section>
      )}

      {/* Zuletzt erledigt */}
      {zuletztErledigt.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-pine">Zuletzt erledigt</h2>
          <div className="space-y-3">
            {zuletztErledigt.map(z => (
              <div key={`${z.journeyId}-${z.task.id}`} className="rounded-card bg-cream-card border border-pine-mist p-4 flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pine text-cream text-xs">✓</span>
                <p className="flex-1 font-display text-pine">{z.task.title}</p>
                <p className="text-sm text-ink/50">{formatDatum(z.datum)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nächste Schritte */}
      {nextTasks.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-pine">Deine nächsten Schritte</h2>
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

      {stats.totalTasks > 0 && stats.totalDone === 0 && (
        <div className="rounded-card bg-cream-card border border-pine-mist p-6">
          <p className="text-ink/80">
            Du hast noch nichts abgehakt – sehr normal! Fang mit einem der Schritte oben an, wann es passt.
          </p>
        </div>
      )}
    </div>
  )
}
