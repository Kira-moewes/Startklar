import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { relevanteTasks, istRelevant } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useAllProgress } from '../hooks/useProgress'
import { useTermine } from '../hooks/useTermine'
import { useCountUp } from '../hooks/useCountUp'
import Heatmap from '../components/ui/Heatmap'
import type { Task } from '../data/types'

const heute = () => new Date().toISOString().slice(0, 10)

function formatDatum(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long' })
}

const RING_UMFANG = 414.7 // 2 * PI * r66, wie im Redesign

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

  const animPct = useCountUp(stats.overallPercent)
  const animSchritte = useCountUp(stats.totalTasks)
  const animErledigt = useCountUp(stats.totalDone)
  const animOffen = useCountUp(stats.totalTasks - stats.totalDone)

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
      <div className="mx-auto max-w-[960px] px-7 py-14">
        <p className="text-pine/60">Lädt...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-[960px] w-full px-7 pt-14 pb-24">
        <h1 className="m-0 font-serif font-normal text-[clamp(38px,5vw,60px)] text-pine">
          Dein <em className="text-olive">Fortschritt</em>
        </h1>
        <p className="mt-3 text-[17px] text-pine/70">Schritt für Schritt. Wir zeigen dir, was noch zu tun ist.</p>
        <div className="mt-10 bg-cream-card border border-pine/14 rounded-[22px] p-8">
          <p className="text-pine/80 mb-5">
            Du hast noch keine Angaben gemacht. Lass uns mit einer Frage starten – dann zeigen wir dir nur, was für dich zählt.
          </p>
          <Link to="/onboarding" className="inline-block rounded-pill bg-pine px-7 py-3.5 font-semibold text-cream hover:bg-olive transition">
            Los geht's
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[960px] w-full px-7 pt-14 pb-24">
      <h1 className="m-0 font-serif font-normal text-[clamp(38px,5vw,60px)] text-pine" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        Dein <em className="text-olive">Fortschritt</em>
      </h1>
      <p className="mt-3 m-0 text-[17px] text-pine/70" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .05s both' }}>
        {stats.totalDone === 0 ? 'Schritt für Schritt. Wir zeigen dir, wo du anfängst.' : 'Schritt für Schritt. Du packst das.'}
      </p>

      {/* Kennzahlen */}
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4.5 items-stretch" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .1s both' }}>
        <div className="bg-pine text-cream rounded-[22px] p-7 flex flex-col items-center justify-center gap-2">
          <div className="relative size-[156px]">
            <svg width="156" height="156" viewBox="0 0 156 156" className="-rotate-90">
              <circle cx="78" cy="78" r="66" fill="none" stroke="rgba(254,250,224,.15)" strokeWidth="12" />
              <circle
                cx="78" cy="78" r="66" fill="none" stroke="#FEFAE0" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={RING_UMFANG}
                strokeDashoffset={RING_UMFANG * (1 - animPct / 100)}
              />
            </svg>
            <p className="absolute inset-0 m-0 flex items-center justify-center font-serif text-[40px]">{animPct} %</p>
          </div>
          <p className="m-0 text-sm text-cream/65">insgesamt geschafft</p>
        </div>
        <div className="flex flex-col gap-4.5">
          <div className="flex-1 bg-cream-card border border-pine/14 rounded-[22px] px-6.5 py-5.5">
            <p className="m-0 font-serif text-[42px] leading-none text-pine">{stats.numAreas}</p>
            <p className="mt-2 m-0 text-sm text-pine/60">Bereiche für dich</p>
          </div>
          <div className="flex-1 bg-cream-card border border-pine/14 rounded-[22px] px-6.5 py-5.5">
            <p className="m-0 font-serif text-[42px] leading-none text-pine">{animSchritte}</p>
            <p className="mt-2 m-0 text-sm text-pine/60">Schritte gesamt</p>
          </div>
        </div>
        <div className="flex flex-col gap-4.5">
          <div className="flex-1 bg-olive text-cream rounded-[22px] px-6.5 py-5.5">
            <p className="m-0 font-serif text-[42px] leading-none">{animErledigt}</p>
            <p className="mt-2 m-0 text-sm text-cream/75">erledigt</p>
          </div>
          <div className="flex-1 bg-cream-card border border-pine/14 rounded-[22px] px-6.5 py-5.5">
            <p className="m-0 font-serif text-[42px] leading-none text-pine">{animOffen}</p>
            <p className="mt-2 m-0 text-sm text-pine/60">noch offen</p>
          </div>
        </div>
      </div>

      {/* Termine-Vorschau */}
      {(naechsteTermine.length > 0 || ueberfaellig > 0) && (
        <section>
          <div className="mt-13 flex items-baseline justify-between gap-4">
            <h2 className="m-0 font-serif font-medium text-[28px] text-pine">Deine nächsten Termine</h2>
            <Link to="/termine" className="text-sm font-semibold text-olive hover:text-pine transition">Alle Termine →</Link>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {ueberfaellig > 0 && (
              <Link to="/termine" className="block rounded-[18px] border-[1.5px] border-olive bg-olive/7 px-5.5 py-4.5 font-semibold text-pine hover:border-pine transition">
                {ueberfaellig} {ueberfaellig === 1 ? 'Termin ist' : 'Termine sind'} überfällig – schau kurz rein.
              </Link>
            )}
            {naechsteTermine.map(t => (
              <div key={t.id} className="rounded-[18px] bg-cream-card border border-pine/14 px-5.5 py-4.5">
                <p className="m-0 font-serif text-[19px] font-medium text-pine">{t.titel}</p>
                <p className="mt-1 m-0 text-sm text-pine/65">{formatDatum(t.datum)}{t.uhrzeit ? `, ${t.uhrzeit} Uhr` : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bereichs-Fortschritt */}
      {stats.totalTasks > 0 && (
        <section>
          <h2 className="mt-13 m-0 font-serif font-medium text-[28px] text-pine">Deine Bereiche</h2>
          <div className="mt-5 flex flex-col gap-3.5">
            {progress.map((prog, i) => {
              const journey = journeyData.find(jd => jd.journey.id === prog.journeyId)?.journey
              if (!journey) return null
              const p = prog.taskCount ? Math.round((prog.doneCount / prog.taskCount) * 100) : 0
              return (
                <Link
                  key={prog.journeyId}
                  to={`/journey/${prog.journeyId}`}
                  className="block bg-cream-card border border-pine/14 rounded-[18px] px-6 py-5 hover:border-olive transition"
                  style={{ animation: `rise .55s cubic-bezier(.2,.7,.2,1) ${i * 0.08}s both` }}
                >
                  <span className="flex justify-between items-baseline gap-3.5">
                    <span className="font-serif text-xl font-medium text-pine">{journey.title}</span>
                    <span className="text-[13.5px] font-semibold text-olive">{prog.doneCount} von {prog.taskCount}</span>
                  </span>
                  <span className="block mt-3 h-2 rounded-pill bg-pine/12 overflow-hidden">
                    <span className="block h-full rounded-pill bg-olive transition-all duration-600" style={{ width: `${p}%` }} />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Aktivität */}
      {stats.totalDone > 0 && (
        <section>
          <h2 className="mt-13 m-0 font-serif font-medium text-[28px] text-pine">Aktivität</h2>
          <div className="mt-5">
            <Heatmap
              data={heatmapData}
              caption="Ein Feld pro Tag, kräftiger = mehr erledigt. (Letzte 5 Wochen)"
              cols={7}
            />
          </div>
        </section>
      )}

      {/* Zuletzt erledigt */}
      {zuletztErledigt.length > 0 && (
        <section>
          <h2 className="mt-13 m-0 font-serif font-medium text-[28px] text-pine">Zuletzt erledigt</h2>
          <div className="mt-5 flex flex-col gap-3">
            {zuletztErledigt.map(z => (
              <div key={`${z.journeyId}-${z.task.id}`} className="rounded-[18px] bg-cream-card border border-pine/14 px-5.5 py-4 flex items-center gap-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-olive text-cream text-xs font-bold">✓</span>
                <p className="m-0 flex-1 font-serif text-[19px] font-medium text-pine">{z.task.title}</p>
                <p className="m-0 text-sm text-pine/50">{formatDatum(z.datum)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nächste Schritte */}
      {nextTasks.length > 0 && (
        <section>
          <h2 className="mt-13 m-0 font-serif font-medium text-[28px] text-pine">Deine nächsten Schritte</h2>
          <div className="mt-5 flex flex-col gap-3">
            {nextTasks.map((nt, i) => {
              const journey = journeyData.find(jd => jd.journey.id === nt.journeyId)?.journey
              return (
                <Link
                  key={`${nt.journeyId}-${nt.task.id}`}
                  to={`/journey/${nt.journeyId}/task/${nt.task.id}`}
                  className="flex gap-4 items-start bg-cream-card border border-pine/14 rounded-[18px] px-5.5 py-4.5 hover:border-olive hover:translate-x-1 transition"
                  style={{ animation: `rise .55s cubic-bezier(.2,.7,.2,1) ${i * 0.08}s both` }}
                >
                  <span className="flex-none size-7 rounded-full bg-olive text-cream text-[13px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-serif text-[19px] font-medium text-pine">{nt.task.title}</span>
                    <span className="block mt-1 text-sm text-pine/65">{journey?.title ?? nt.task.summary}</span>
                  </span>
                  <span className="text-lg text-olive mt-0.5" aria-hidden="true">→</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {stats.totalTasks > 0 && stats.totalDone === 0 && (
        <div className="mt-13 rounded-[22px] bg-cream-card border border-pine/14 p-6.5">
          <p className="m-0 text-pine/80">
            Du hast noch nichts abgehakt – sehr normal! Fang mit einem der Schritte oben an, wann es passt.
          </p>
        </div>
      )}
    </div>
  )
}
