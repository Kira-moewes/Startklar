import { Link, useNavigate } from 'react-router-dom'
import { ersteWohnungJourney } from '../data'
import { useSpiel } from '../hooks/useSpiel'
import { gebietMeisterschaft, gebietXp, questLevel } from '../lib/spiel'
import { useSettings } from '../hooks/useSettings'
import Flieger from '../components/spiel/Flieger'
import HimmelsTour from '../components/spiel/HimmelsTour'
import FlugWeltHero from '../components/spiel/FlugWeltHero'

const GEBIET = ersteWohnungJourney.id

// Leicht wechselnde horizontale Auslenkung – ergibt einen fliegenden Zickzack-
// Pfad die Inseln entlang.
const VERSATZ = ['-14%', '12%', '-10%', '14%', '-8%', '10%']

export default function Himmel() {
  const navigate = useNavigate()
  const { state } = useSpiel()
  const { einstellungen, setEinstellung, loading } = useSettings()
  const tasks = ersteWohnungJourney.tasks

  // Beim ersten Himmel-Besuch die geführte Tour zeigen.
  const zeigeTour = !loading && !einstellungen.tourGesehen

  const level = (id: string) => questLevel(state, GEBIET, id)
  const naechsterIndex = tasks.findIndex(t => level(t.id) < 2)
  const alleGeschafft = naechsterIndex === -1
  const xp = gebietXp(state, GEBIET)
  const meisterschaft = gebietMeisterschaft(state, GEBIET, tasks.length)

  return (
    <div
      className="relative min-h-dvh overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, var(--sky-1) 0%, var(--sky-2) 55%, var(--sky-3) 100%)',
      }}
    >
      {/* Sterne (nur nachts sichtbar – Farbe ist tags transparent) */}
      {[
        [12, 14], [28, 8], [46, 18], [66, 10], [82, 22], [90, 12], [20, 30], [74, 34],
      ].map(([l, t], i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: `${l}%`, top: `${t}%`, width: 4, height: 4,
            background: 'var(--stern)',
            animation: einstellungen.wenigerAnimation ? undefined : `blink ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
      {/* Wolken */}
      {[
        { l: '-6%', t: '16%', s: 150, d: '0s' },
        { l: '70%', t: '30%', s: 190, d: '1.5s' },
        { l: '30%', t: '62%', s: 130, d: '0.8s' },
      ].map((c, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute rounded-full blur-md"
          style={{
            left: c.l, top: c.t, width: c.s, height: c.s * 0.42,
            background: 'var(--cloud)', opacity: 0.55,
            animation: einstellungen.wenigerAnimation ? undefined : `drift ${16 + i * 4}s ease-in-out ${c.d} infinite`,
          }}
        />
      ))}

      {/* 3D-Flugwelt als Hero (mit 2D-Fallback für schwache Geräte) */}
      <FlugWeltHero className="h-[42vh] min-h-[280px] w-full" />

      <div className="relative mx-auto max-w-[720px] px-6 pt-6 pb-28">
        {/* Kopf: Begrüßung + Fortschritt */}
        <header style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>
          <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.16em] text-pine/60">
            Dein Flug ins echte Leben
          </p>
          <h1 className="mt-1.5 mb-0 font-serif font-normal text-[clamp(30px,5vw,44px)] leading-[1.1] text-pine">
            {alleGeschafft ? 'Gebiet gemeistert – frei geflogen.' : 'Erste Wohnung'}
          </h1>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="rounded-pill bg-olive text-on-akzent px-3.5 py-1.5 text-sm font-semibold">
              {xp} Flugmeilen
            </span>
            <div className="flex-1 min-w-[140px] h-2.5 rounded-pill bg-pine/12 overflow-hidden">
              <span
                className="block h-full rounded-pill bg-olive transition-[width] duration-700"
                style={{ width: `${Math.round(meisterschaft * 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-pine/70">
              {tasks.filter(t => level(t.id) === 2).length}/{tasks.length} Inseln
            </span>
          </div>
        </header>

        {/* Post-Einstieg (Angst-Moment) – bewusst prominent, ruhiger Ton */}
        <Link
          to="/post"
          className="mt-7 flex items-center gap-4 rounded-[20px] border-[1.5px] border-pine/20 bg-cream-card/80 backdrop-blur px-5 py-4 hover:border-olive transition"
          style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .06s both' }}
        >
          <span className="grid place-items-center size-11 rounded-full bg-olive/12 text-xl">✉️</span>
          <span className="flex-1">
            <span className="block font-semibold text-pine">Ich hab Post und versteh sie nicht</span>
            <span className="block text-[13.5px] text-pine/65">In Ruhe erklärt – kein Notfall, ein Schritt nach dem anderen.</span>
          </span>
          <span className="text-olive font-semibold">→</span>
        </Link>

        {/* Insel-Reise */}
        <div className="relative mt-10">
          {/* Flugpfad-Linie */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 border-l-2 border-dashed border-pine/25"
          />
          <ol className="relative m-0 p-0 list-none flex flex-col gap-8">
            {tasks.map((task, i) => {
              const lv = level(task.id)
              const done = lv === 2
              const istNaechste = i === naechsterIndex
              return (
                <li
                  key={task.id}
                  className="relative flex justify-center"
                  style={{ animation: `rise .5s cubic-bezier(.2,.7,.2,1) ${0.1 + i * 0.06}s both` }}
                >
                  <div style={{ transform: `translateX(${VERSATZ[i % VERSATZ.length]})` }} className="w-[74%] max-w-[380px]">
                    {/* Flieger sitzt an der aktuellen Insel */}
                    {istNaechste && (
                      <div className="flex justify-center mb-1">
                        <Flieger size={96} zustand="fliegen" ausruestung={einstellungen.ausruestung} />
                      </div>
                    )}
                    {alleGeschafft && i === tasks.length - 1 && (
                      <div className="flex justify-center mb-1">
                        <Flieger size={104} zustand="feiern" ausruestung={einstellungen.ausruestung} />
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/journey/${GEBIET}/task/${task.id}`)}
                      className={`w-full text-left rounded-[22px] px-5 py-4 border transition hover:scale-[1.02] ${
                        done
                          ? 'bg-olive text-on-akzent border-olive shadow-[0_0_0_4px_var(--t-akzent-soft)]'
                          : istNaechste
                            ? 'bg-cream-card border-olive'
                            : 'bg-cream-card/70 border-pine/15'
                      }`}
                      style={{ filter: 'drop-shadow(0 14px 20px rgba(40,54,24,.18))' }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`grid place-items-center size-7 rounded-full text-[13px] font-bold ${
                          done ? 'bg-on-akzent/20 text-on-akzent' : 'bg-olive text-on-akzent'
                        }`}>
                          {done ? '✓' : lv === 1 ? '·' : i + 1}
                        </span>
                        <span className={`text-[15px] font-semibold leading-tight ${done ? 'text-on-akzent' : 'text-pine'}`}>
                          {task.title.split(' — ')[0]}
                        </span>
                      </span>
                      <span className={`mt-1 block text-[13px] ${done ? 'text-on-akzent/85' : 'text-pine/60'}`}>
                        {done ? 'Erschlossen ✦' : istNaechste ? 'Hier weiterfliegen' : lv === 1 ? 'Verstanden – noch nicht gemacht' : 'Noch dunkel'}
                      </span>
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Fußzeile: Sammlung + klassische Ansicht */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link to="/sammlung" className="font-semibold text-olive hover:underline">Deine Sammlung ✦</Link>
          <Link to="/fortschritt" className="text-pine/70 hover:text-olive transition">Alle Bereiche</Link>
          <Link to="/profil" className="text-pine/70 hover:text-olive transition">
            Klassische Ansicht in den Einstellungen
          </Link>
        </div>
      </div>

      {zeigeTour && <HimmelsTour onFertig={() => setEinstellung('tourGesehen', true)} />}
    </div>
  )
}
