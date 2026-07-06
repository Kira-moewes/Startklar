import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { relevanteTasks, istRelevant } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useAllProgress } from '../hooks/useProgress'
import { useTermine } from '../hooks/useTermine'
import { useWallet } from '../hooks/useWallet'
import { useDokumente } from '../hooks/useDokumente'
import Ring from '../components/ui/Ring'
import Bar from '../components/ui/Bar'
import StatCard from '../components/ui/StatCard'
import Heatmap from '../components/ui/Heatmap'
import VergleichChip from '../components/VergleichChip'
import NachfrageKarte from '../components/NachfrageKarte'
import { anbieterAngebot } from '../data/anbieter'
import { lernArtikel } from '../data/lernen'
import type { Task } from '../data/types'

const heute = () => new Date().toISOString().slice(0, 10)

function formatDatum(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long' })
}

function Widget({
  title,
  linkTo,
  linkText,
  className,
  children,
}: {
  title: string
  linkTo?: string
  linkText?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={`rounded-card bg-cream-card border border-pine-mist p-5 md:p-6 flex flex-col gap-4 ${className ?? ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-semibold tracking-widest text-ink/60 uppercase">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="text-sm text-pine underline underline-offset-2 hover:text-coral-deep whitespace-nowrap">
            {linkText ?? 'Alle'}
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile()
  const { termine } = useTermine()
  const { abschluesse } = useWallet()
  const { dokumente } = useDokumente()

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

  // Tage mit mindestens einer erledigten Aufgabe (letzte 5 Wochen)
  const aktiveTage = useMemo(() => {
    const today = new Date()
    const tage = new Set<string>()
    for (const iso of Object.values(dates)) {
      const diff = Math.floor((today.getTime() - new Date(iso + 'T00:00:00').getTime()) / 86400000)
      if (diff >= 0 && diff < 35) tage.add(iso)
    }
    return tage.size
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
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-ink/60">Lädt...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-pine">Dashboard</h1>
          <p className="mt-2 text-lg text-ink/80">
            Dein Überblick: Fortschritt, Termine und nächste Schritte auf einen Blick.
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

  const offen = stats.totalTasks - stats.totalDone
  const bestaetigteAbschluesse = abschluesse.filter(a => a.status !== 'angeklickt')
  const boniSumme = bestaetigteAbschluesse.reduce(
    (sum, a) => sum + (anbieterAngebot(a.angebotId)?.bonusFuerNutzer ?? 0),
    0
  )
  const tagesArtikel = lernArtikel[new Date().getDate() % lernArtikel.length]

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine">Dashboard</h1>
        <p className="mt-2 text-lg text-ink/80">
          {stats.totalDone === 0 ? 'Dein Überblick. Wir zeigen dir, wo du anfängst.' : 'Dein Überblick. Du packst das.'}
        </p>
      </div>

      <NachfrageKarte />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Hero: Gesamtfortschritt */}
        <section className="col-span-2 lg:row-span-2 rounded-card bg-pine text-cream p-6 md:p-8 flex flex-col justify-between gap-6">
          <h2 className="text-xs font-semibold tracking-widest text-cream/70 uppercase">Gesamtfortschritt</h2>
          <div className="flex items-center gap-6 md:gap-8">
            <Ring value={stats.overallPercent} size={150} label={`${stats.overallPercent}%`} labelClass="fill-cream" />
            <div>
              <p className="font-serif text-4xl font-bold leading-tight">
                {stats.totalDone} <span className="text-cream/70 text-2xl">von {stats.totalTasks}</span>
              </p>
              <p className="mt-1 text-cream/80">Schritten erledigt</p>
            </div>
          </div>
          <p className="text-sm text-cream/80">
            {stats.totalDone === 0
              ? 'Du hast noch nichts abgehakt – sehr normal! Fang einfach mit einem der nächsten Schritte an.'
              : offen === 0
                ? 'Alles erledigt – stark! Schau ab und zu rein, ob neue Schritte für dich dazukommen.'
                : `Noch ${offen} ${offen === 1 ? 'Schritt' : 'Schritte'} offen. Einer nach dem anderen.`}
          </p>
        </section>

        {/* Stat-Kacheln */}
        <StatCard label="Erledigt" value={stats.totalDone} />
        <StatCard label="Offen" value={offen} />
        <StatCard label="Bereiche" value={stats.numAreas} hint="für dich relevant" />
        <StatCard label="Aktive Tage" value={aktiveTage} hint="letzte 5 Wochen" />

        {/* Wallet */}
        <Widget title="Wallet" linkTo="/wallet" linkText="Öffnen">
          <div className="flex flex-col gap-1">
            <p className="font-serif text-4xl font-bold text-coral leading-none">{bestaetigteAbschluesse.length}</p>
            <p className="text-xs text-ink/50">
              {bestaetigteAbschluesse.length === 1 ? 'Abschluss' : 'Abschlüsse'} über Startklar
            </p>
            {bestaetigteAbschluesse.length > 0 && (
              <p className="mt-1 text-sm text-pine font-medium truncate">
                {bestaetigteAbschluesse[bestaetigteAbschluesse.length - 1].anbieter} · {
                  { angeklickt: 'Offen', selbst_bestaetigt: 'Bestätigt', aktiv: 'Aktiv', gekuendigt: 'Gekündigt' }[
                    bestaetigteAbschluesse[bestaetigteAbschluesse.length - 1].status
                  ]
                }
              </p>
            )}
            {boniSumme > 0 && (
              <p className="mt-1 text-sm text-pine font-medium">💶 Boni mitgenommen: bis zu {boniSumme} €</p>
            )}
          </div>
        </Widget>

        {/* Dokumente */}
        <Widget title="Dokumente" linkTo="/dokumente" linkText="Öffnen">
          <div className="flex flex-col gap-1">
            <p className="font-serif text-4xl font-bold text-coral leading-none">{dokumente.length}</p>
            <p className="text-xs text-ink/50">automatisch sortiert</p>
            {dokumente.length > 0 && (
              <p className="mt-1 text-sm text-pine font-medium truncate">
                zuletzt: {[...dokumente].sort((a, b) => (a.datum < b.datum ? 1 : -1))[0].titel}
              </p>
            )}
          </div>
        </Widget>

        {/* Bereichs-Fortschritt */}
        {stats.totalTasks > 0 && (
          <Widget title="Deine Bereiche" className="col-span-2">
            <div className="flex flex-col gap-4">
              {progress.map(prog => {
                const journey = journeyData.find(jd => jd.journey.id === prog.journeyId)?.journey
                if (!journey) return null
                return (
                  <Link key={prog.journeyId} to={`/journey/${prog.journeyId}`} className="group">
                    <Bar label={journey.title} value={prog.doneCount} max={prog.taskCount} />
                  </Link>
                )
              })}
            </div>
          </Widget>
        )}

        {/* Aktivität */}
        {stats.totalDone > 0 && (
          <Widget title="Aktivität" className="col-span-2">
            <Heatmap
              data={heatmapData}
              caption="Ein Feld pro Tag, kräftiger = mehr erledigt. (Letzte 5 Wochen)"
              cols={7}
            />
          </Widget>
        )}

        {/* Nächste Schritte */}
        {nextTasks.length > 0 && (
          <Widget title="Deine nächsten Schritte" className="col-span-2">
            <div className="flex flex-col gap-3">
              {nextTasks.map((nt, i) => (
                <div
                  key={`${nt.journeyId}-${nt.task.id}`}
                  className="flex items-start gap-3 rounded-field border border-pine-mist p-3 hover:border-coral transition group"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-coral text-cream font-display font-semibold text-xs">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <Link to={`/journey/${nt.journeyId}/task/${nt.task.id}`} className="block">
                      <p className="font-display font-semibold text-pine group-hover:text-coral transition">
                        {nt.task.title}
                      </p>
                      <p className="text-sm text-ink/60 mt-0.5">{nt.task.summary}</p>
                    </Link>
                    <div className="mt-1.5 empty:hidden">
                      <VergleichChip journeyId={nt.journeyId} taskId={nt.task.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Widget>
        )}

        {/* Termine */}
        <Widget title="Deine nächsten Termine" linkTo="/termine" linkText="Alle Termine" className="col-span-2">
          {ueberfaellig > 0 && (
            <Link to="/termine" className="block rounded-field border-2 border-coral p-3 text-coral-deep text-sm font-medium hover:bg-cream transition">
              {ueberfaellig} {ueberfaellig === 1 ? 'Termin ist' : 'Termine sind'} überfällig – schau kurz rein.
            </Link>
          )}
          {naechsteTermine.length > 0 ? (
            <div className="flex flex-col gap-3">
              {naechsteTermine.map(t => (
                <div key={t.id} className="rounded-field border border-pine-mist p-3">
                  <p className="font-display font-semibold text-pine">{t.titel}</p>
                  <p className="text-sm text-ink/70">{formatDatum(t.datum)}{t.uhrzeit ? `, ${t.uhrzeit} Uhr` : ''}</p>
                </div>
              ))}
            </div>
          ) : (
            ueberfaellig === 0 && (
              <p className="text-sm text-ink/60">
                Keine Termine geplant.{' '}
                <Link to="/termine?neu=1" className="text-pine underline underline-offset-2 hover:text-coral-deep">
                  Termin anlegen
                </Link>
              </p>
            )
          )}
        </Widget>

        {/* Wusstest du? (Lern-Teaser, rotiert täglich) */}
        <Widget title="Wusstest du?" linkTo="/lernen" linkText="Alle Artikel" className="col-span-2">
          <Link to={`/lernen/${tagesArtikel.id}`} className="group">
            <p className="font-display text-lg font-semibold text-pine group-hover:text-coral transition">
              📖 {tagesArtikel.titel}
            </p>
            <p className="mt-1 text-sm text-ink/70">{tagesArtikel.teaser}</p>
            <p className="mt-2 text-xs text-ink/50">{tagesArtikel.minuten} Min. · ohne Werbung</p>
          </Link>
        </Widget>

        {/* Zuletzt erledigt */}
        {zuletztErledigt.length > 0 && (
          <Widget title="Zuletzt erledigt" className="col-span-2">
            <div className="flex flex-col gap-3">
              {zuletztErledigt.map(z => (
                <div key={`${z.journeyId}-${z.task.id}`} className="flex items-center gap-3 rounded-field border border-pine-mist p-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pine text-cream text-xs">✓</span>
                  <p className="flex-1 font-display text-pine">{z.task.title}</p>
                  <p className="text-sm text-ink/50 whitespace-nowrap">{formatDatum(z.datum)}</p>
                </div>
              ))}
            </div>
          </Widget>
        )}
      </div>
    </div>
  )
}
