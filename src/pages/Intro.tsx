import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { introBeats } from '../data/story'
import { useProfile } from '../hooks/useProfile'
import { useSettings } from '../hooks/useSettings'
import PaperPlane from '../components/PaperPlane'
import { Fiete, Klaro, Sprechblase } from '../components/spiel/Charakter'

// Prolog „Der erste Flug" – animierter Story-Intro. Führt Fiete & Klaro ein und
// erklärt die Welt (Himmel = echtes Leben, Inseln = Aufgaben, Nebel = das
// Ungewisse, das sich lichtet). Skippbar, wiederholbar (Profil), reduced-motion.
export default function Intro() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { einstellungen, setEinstellung } = useSettings()
  const ruhig = einstellungen.wenigerAnimation
  const [i, setI] = useState(0)

  const beat = introBeats[i]
  const letzter = i === introBeats.length - 1

  const weiterZumSpiel = () => {
    setEinstellung('introGesehen', true)
    navigate(profile ? '/himmel' : '/onboarding')
  }
  const weiter = () => (letzter ? weiterZumSpiel() : setI(i + 1))

  const zeigeFiete = beat.sprecher === 'fiete' || beat.szene === 'ankunft' || beat.szene === 'aufbruch'
  const zeigeKlaro = beat.sprecher === 'klaro' || beat.szene === 'funk'

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--sky-1) 0%, var(--sky-2) 52%, var(--sky-3) 100%)' }}
    >
      {/* Sterne (nur nachts sichtbar) */}
      {[[14, 16], [30, 10], [52, 20], [70, 12], [86, 24], [22, 30]].map(([l, t], k) => (
        <span key={k} aria-hidden className="absolute rounded-full" style={{
          left: `${l}%`, top: `${t}%`, width: 4, height: 4, background: 'var(--stern)',
          animation: ruhig ? undefined : `blink ${2 + (k % 3)}s ease-in-out ${k * 0.4}s infinite`,
        }} />
      ))}

      {/* Titel beim ersten Beat */}
      {i === 0 && (
        <div className="absolute top-[14%] left-0 right-0 text-center px-6" style={{ animation: 'fadeIn 1.4s ease both' }}>
          <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.22em] text-pine/55">Startklar</p>
          <h1 className="mt-2 mb-0 font-serif font-normal italic text-[clamp(34px,8vw,64px)] leading-[1.05] text-pine">
            Über dem Nebel
          </h1>
        </div>
      )}

      {/* Bühne: Insel, Wolken, Figuren */}
      <div className="absolute inset-0">
        {/* Klaro fliegt oben rechts ein */}
        {zeigeKlaro && (
          <div className="absolute right-[8%] top-[26%]" style={{ animation: `${ruhig ? 'fadeIn .6s ease both' : 'flyIn 1.3s cubic-bezier(.2,.7,.2,1) both'}` }}>
            <div style={{ animation: ruhig ? undefined : 'glide 5s ease-in-out infinite' }}>
              <Klaro size={110} />
            </div>
          </div>
        )}

        {/* Papierflieger beim Aufbruch */}
        {beat.szene === 'aufbruch' && (
          <div className="absolute left-[16%] top-[30%]" style={{ animation: ruhig ? 'fadeIn .6s ease both' : 'flyIn 1.4s cubic-bezier(.3,.6,.2,1) both' }}>
            <div style={{ animation: ruhig ? undefined : 'glide 4s ease-in-out infinite' }}>
              <PaperPlane width={130} height={104} />
            </div>
          </div>
        )}

        {/* Heiminsel unten mittig */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[24%] flex flex-col items-center">
          {zeigeFiete && (
            <div className="mb-[-6px] z-10" style={{ animation: ruhig ? 'fadeIn .5s ease both' : 'rise .7s cubic-bezier(.2,.7,.2,1) both' }}>
              <Fiete size={128} pose={beat.szene === 'ankunft' ? 'winkt' : beat.szene === 'aufbruch' ? 'jubelt' : 'ruhig'} />
            </div>
          )}
          {/* Insel */}
          <svg width="260" height="120" viewBox="0 0 260 120" aria-hidden style={{ filter: 'drop-shadow(0 24px 30px rgba(40,54,24,.28))' }}>
            <ellipse cx="130" cy="34" rx="120" ry="30" fill="var(--insel)" />
            <path d="M12 34 Q40 116 130 116 Q220 116 248 34 Q210 60 130 60 Q50 60 12 34 Z" fill="var(--fels)" />
            <ellipse cx="130" cy="30" rx="118" ry="24" fill="var(--insel)" />
          </svg>
        </div>

        {/* Nebelbänke unten */}
        {[0, 1, 2].map(n => (
          <div key={n} aria-hidden className="absolute left-0 right-0 blur-xl" style={{
            bottom: `${-4 + n * 6}%`, height: '22%',
            background: 'var(--cloud)', opacity: 0.5 - n * 0.08,
            animation: ruhig ? undefined : `nebelWogen ${7 + n * 2}s ease-in-out ${n * 0.8}s infinite`,
          }} />
        ))}
      </div>

      {/* Skip oben rechts */}
      <button
        onClick={weiterZumSpiel}
        className="absolute top-5 right-5 rounded-pill bg-cream-card/85 backdrop-blur px-4 py-2 text-[13.5px] font-semibold text-pine/70 hover:text-pine transition"
      >
        Überspringen ✕
      </button>

      {/* Dialog unten */}
      <div className="absolute left-0 right-0 bottom-0 px-5 pb-8 flex justify-center">
        {beat.sprecher === 'erzaehler' ? (
          <div
            className="w-full max-w-[520px] rounded-[22px] bg-cream-card/92 backdrop-blur border border-pine/12 p-5 text-center shadow-[0_16px_40px_rgba(40,54,24,.22)]"
            style={{ animation: 'panel-in .45s cubic-bezier(.2,.7,.2,1) both' }}
          >
            <p className="m-0 font-serif italic text-[18px] leading-[1.5] text-pine">{beat.text}</p>
            <button onClick={weiter} className="mt-4 rounded-pill bg-olive text-on-akzent px-6 py-2 text-sm font-semibold hover:scale-[1.03] transition">
              Weiter
            </button>
          </div>
        ) : (
          <Sprechblase
            wer={beat.sprecher}
            name={beat.name ?? (beat.sprecher === 'fiete' ? 'Fiete' : 'Klaro')}
            text={beat.text}
            onWeiter={weiter}
            weiterLabel={letzter ? 'Losfliegen ✈' : 'Weiter'}
            fortschritt={`${i + 1} / ${introBeats.length}`}
          />
        )}
      </div>
    </div>
  )
}
