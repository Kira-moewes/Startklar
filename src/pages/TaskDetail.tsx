import { Link, useNavigate, useParams } from 'react-router-dom'
import { journeys } from '../data'
import { faktum, fuelleFakten } from '../data/fakten'
import { kategorie, vergleichFuerTask } from '../data/vergleich'
import { relevanteTasks } from '../data/visibility'
import { useProfile } from '../hooks/useProfile'
import { useProgress } from '../hooks/useProgress'
import CategoryBadge from '../components/CategoryBadge'
import DokumenteSection from '../components/DokumenteSection'
import { dokumentKeyTask } from '../data/dokumente'
import { hatBedarfsCheck } from '../data/bedarf'
import { useBedarf } from '../hooks/useBedarf'

function hostLabel(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'Quelle' }
}

export default function TaskDetail() {
  const { journeyId = '', taskId = '' } = useParams()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const journey = journeys.find(j => j.id === journeyId)
  const tasks = journey ? relevanteTasks(journey, profile) : []
  const taskIds = tasks.map(t => t.id)
  const { done, toggle } = useProgress(journeyId, taskIds)
  // Versicherungs-Tasks: verknüpfte Vergleichskategorie mit Bedarfscheck (sonst '').
  const checkKatId = (vergleichFuerTask[`${journeyId}:${taskId}`] ?? []).find(hatBedarfsCheck) ?? ''
  const { antworten: checkAntworten, ergebnis: checkErgebnis } = useBedarf(checkKatId)

  if (!journey) return <p className="p-6">Nicht gefunden. <Link to="/" className="underline">Zur Startseite</Link></p>
  const task = journey.tasks.find(t => t.id === taskId)
  if (!task) return <p className="p-6">Aufgabe nicht gefunden. <Link to={`/journey/${journey.id}`} className="underline">Zur Übersicht</Link></p>

  const idx = tasks.findIndex(t => t.id === taskId)
  const prev = tasks[idx - 1]
  const next = tasks[idx + 1]
  const isDone = done[task.id] ?? false
  const factEntries = (task.faktenKeys ?? []).map(key => faktum(key)).filter(Boolean)
  const hasUnverified = factEntries.some(entry => entry?.geprueft === null)
  const latestDate = factEntries
    .map(entry => entry?.geprueft)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null

  const hilfeLinks = task.hilfen ?? []
  const quellLinks = Array.from(
    new Map(
      (task.faktenKeys ?? [])
        .map(key => faktum(key)?.quelle)
        .filter((u): u is string => Boolean(u))
        .map(u => [u, { label: hostLabel(u), url: u }] as const)
    ).values()
  )

  return (
    <div className="mx-auto max-w-[780px] w-full px-7 pt-12 pb-24">
      <Link to={`/journey/${journey.id}`} className="text-sm font-semibold text-olive">← {journey.title}</Link>
      <div className="mt-4.5 flex items-center gap-3 flex-wrap">
        <h1 className="m-0 font-serif font-normal text-[clamp(30px,4.4vw,46px)] leading-[1.12] text-pine" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>
          {task.title}
        </h1>
        <CategoryBadge category={task.category} />
      </div>
      <p className="mt-3.5 m-0 text-[17px] leading-[1.55] text-pine/75" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .07s both' }}>
        {fuelleFakten(task.summary)}
      </p>

      <section
        aria-label="Schritt für Schritt"
        className="mt-8 bg-cream-card border border-pine/14 rounded-[20px] p-7"
        style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .14s both' }}
      >
        <h2 className="m-0 font-serif font-medium text-2xl text-pine">So gehst du vor</h2>
        <ol className="mt-5 m-0 p-0 list-none flex flex-col gap-4.5">
          {checkKatId && (
            <li className="flex gap-4 items-start" style={{ animation: 'rise .5s cubic-bezier(.2,.7,.2,1) 0s both' }}>
              <span className={`flex-none size-8 rounded-full text-sm font-semibold flex items-center justify-center ${
                checkAntworten ? 'bg-olive text-on-akzent' : 'bg-pine text-cream'
              }`}>
                {checkAntworten ? '✓' : 1}
              </span>
              <div className="mt-[3px] flex-1">
                <p className="m-0 text-[15.5px] leading-[1.55] text-pine/85">
                  {checkAntworten && checkErgebnis
                    ? <>Fragebogen ausgefüllt – dein Ergebnis: <strong>{checkErgebnis.titel}</strong>.</>
                    : 'Fragebogen ausfüllen – zeigt dir, was DU wirklich brauchst (≈ 3 Minuten).'}
                </p>
                <Link
                  to={`/vergleich/${checkKatId}/check`}
                  className="mt-1.5 inline-block rounded-pill border-[1.5px] border-olive px-4 py-1.5 text-sm font-semibold text-olive hover:bg-olive hover:text-on-akzent transition"
                >
                  {checkAntworten ? 'Ergebnis ansehen' : 'Fragebogen starten'}
                </Link>
              </div>
            </li>
          )}
          {task.steps.map((step, i) => (
            <li key={i} className="flex gap-4 items-start" style={{ animation: `rise .5s cubic-bezier(.2,.7,.2,1) ${(i + (checkKatId ? 1 : 0)) * 0.08}s both` }}>
              <span className="flex-none size-8 rounded-full bg-pine text-cream text-sm font-semibold flex items-center justify-center">{i + (checkKatId ? 2 : 1)}</span>
              <p className="m-0 mt-[3px] text-[15.5px] leading-[1.55] text-pine/85">{fuelleFakten(step)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-label="Was, wenn nicht?"
        className="mt-5 border-[1.5px] border-olive rounded-[20px] p-7 bg-olive/7"
        style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .24s both' }}
      >
        <h2 className="m-0 font-serif font-medium text-2xl text-pine">Was, wenn nicht?</h2>
        <p className="mt-3 m-0 text-[15px]"><span className="font-bold text-olive">Frist:</span> {fuelleFakten(task.deadline)}</p>
        <p className="mt-2.5 m-0 text-[15.5px] leading-[1.55] text-pine/85">{fuelleFakten(task.consequence)}</p>
        <p className="mt-3.5 m-0 text-[13.5px] text-pine/55">Kein Grund zur Panik — jetzt weißt du ja Bescheid.</p>
        {task.faktenKeys && task.faktenKeys.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {hasUnverified ? (
              <span className="rounded-pill border border-olive/40 px-3 py-1 text-[13px] font-semibold text-olive">Wird gerade geprüft</span>
            ) : latestDate ? (
              <span className="text-pine/70">Zuletzt geprüft am {latestDate}</span>
            ) : null}
          </div>
        )}
      </section>

      {(hilfeLinks.length > 0 || quellLinks.length > 0) && (
        <section aria-label="Offizielle Hilfen und Portale" className="mt-5 bg-cream-card border border-pine/14 rounded-[20px] p-7" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .27s both' }}>
          <h2 className="m-0 font-serif font-medium text-2xl text-pine">Offizielle Hilfen &amp; Portale</h2>
          {hilfeLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {hilfeLinks.map(l => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-pill border-[1.5px] border-olive px-4 py-1.5 text-sm font-semibold text-olive hover:bg-olive hover:text-on-akzent transition">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
          {quellLinks.length > 0 && (
            <div className="mt-4">
              <p className="m-0 text-[13px] text-pine/55">Belege zu den genannten Fristen und Beträgen:</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {quellLinks.map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-olive underline underline-offset-2 hover:text-pine transition">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {(vergleichFuerTask[`${journey.id}:${task.id}`] ?? []).length > 0 && (
        <section aria-label="Passender Vergleich" className="mt-5 bg-band rounded-[20px] p-7 text-paper" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .3s both' }}>
          <h2 className="m-0 font-serif font-medium text-2xl">Anbieter vergleichen</h2>
          <p className="mt-2 m-0 text-[15px] text-paper/85 leading-[1.55]">
            Zu diesem Schritt gibt es einen neutralen Vergleich — trag deine Angebote ein und behalte den Überblick.
          </p>
          <div className="mt-4.5 flex flex-wrap gap-3">
            {(vergleichFuerTask[`${journey.id}:${task.id}`] ?? []).map(katId => {
              const kat = kategorie(katId)
              if (!kat) return null
              return (
                <Link
                  key={katId}
                  to={`/vergleich/${katId}`}
                  className="rounded-pill bg-paper text-band px-5.5 py-2.75 text-sm font-semibold hover:bg-olive-soft hover:text-on-akzent transition"
                >
                  {kat.titel} →
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <div className="mt-5">
        <DokumenteSection bezugKey={dokumentKeyTask(journey.id, task.id)} />
      </div>

      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => toggle(task.id)}
          className={`flex-1 min-h-14 rounded-pill px-8 text-[17px] font-semibold text-on-akzent transition hover:scale-[1.02] ${isDone ? 'bg-pine text-cream' : 'bg-olive'}`}
        >
          {isDone ? '✓ Erledigt — rückgängig machen' : 'Als erledigt markieren'}
        </button>
        <Link
          to={`/termine?neu=1&titel=${encodeURIComponent(task.title)}&journey=${journey.id}&task=${task.id}`}
          className="min-h-14 rounded-pill border-[1.5px] border-pine/30 px-8 text-[15px] font-semibold text-pine flex items-center justify-center hover:border-pine transition"
        >
          Termin dazu anlegen
        </Link>
      </div>

      <nav aria-label="Aufgaben-Navigation" className="mt-8 flex justify-between gap-3">
        {prev ? (
          <button
            onClick={() => navigate(`/journey/${journey.id}/task/${prev.id}`)}
            className="rounded-pill border-[1.5px] border-pine/30 px-5.5 py-3 text-sm font-semibold text-pine max-w-[46%] overflow-hidden text-ellipsis whitespace-nowrap hover:border-pine transition"
          >
            ← {prev.title}
          </button>
        ) : <span />}
        {next && (
          <button
            onClick={() => navigate(`/journey/${journey.id}/task/${next.id}`)}
            className="ml-auto rounded-pill border-[1.5px] border-pine/30 px-5.5 py-3 text-sm font-semibold text-pine max-w-[46%] overflow-hidden text-ellipsis whitespace-nowrap hover:border-pine transition"
          >
            {next.title} →
          </button>
        )}
      </nav>
    </div>
  )
}
