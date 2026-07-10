// Iglu-Demo — Scroll-Erlebnis im Stil von igloo.inc, mit eigener Startklar-Story.
// Die 3D-Szene liegt fixiert im Hintergrund, die Seite liefert nur Scrollweg
// und Text-Overlays, deren Sichtbarkeit direkt am Scrollfortschritt hängt.
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import IglooScene from '../components/igloo/IglooScene'
import './Igloo.css'

type Section = {
  mid: number // Scrollfortschritt (0..1), bei dem die Sektion voll sichtbar ist
  width: number // halbe Sichtbarkeitsbreite
  eyebrow?: string
  title: string
  text?: string
  big?: boolean
}

const SECTIONS: Section[] = [
  { mid: 0.03, width: 0.09, title: 'Startklar', text: 'Scrollen, um zu bauen', big: true },
  {
    mid: 0.28,
    width: 0.1,
    eyebrow: 'Schritt für Schritt',
    title: 'Stein auf Stein.',
    text: 'Große Aufgaben bestehen aus vielen kleinen Bausteinen. Jeder einzelne zählt.',
  },
  {
    mid: 0.52,
    width: 0.1,
    eyebrow: 'Aus vielen Teilen',
    title: 'Ein Zuhause entsteht.',
    text: 'Was eben noch verstreut war, fügt sich zu etwas Stabilem zusammen.',
  },
  {
    mid: 0.74,
    width: 0.08,
    eyebrow: 'Fast geschafft',
    title: 'Tritt ein.',
    text: 'Hinter jedem Schritt wartet der nächste — und irgendwann ein Ort, der trägt.',
  },
  {
    mid: 0.96,
    width: 0.08,
    eyebrow: 'Der Kern',
    title: 'Bereit fürs echte Leben.',
    text: 'Startklar begleitet dich beim Erwachsenwerden — einfach und ohne Bürokratie.',
  },
]

export default function Igloo() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const s = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      SECTIONS.forEach((sec, i) => {
        const el = sectionRefs.current[i]
        if (!el) return
        const o = Math.min(1, Math.max(0, 1 - Math.abs(s - sec.mid) / sec.width))
        el.style.opacity = String(o)
        el.style.transform = `translateY(${(1 - o) * 18}px)`
        el.style.visibility = o <= 0.01 ? 'hidden' : 'visible'
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="iglu-page">
      <IglooScene />

      {/* Minimale UI in den Ecken, wie beim Original */}
      <header className="iglu-ui">
        <span className="iglu-ui__brand">Startklar</span>
        <Link className="iglu-ui__back" to="/">
          Zurück zur App
        </Link>
      </header>

      {/* Text-Overlays, per Scrollfortschritt ein- und ausgeblendet */}
      <div className="iglu-overlays">
        {SECTIONS.map((sec, i) => (
          <div
            key={sec.mid}
            ref={(el) => {
              sectionRefs.current[i] = el
            }}
            className={`iglu-section${sec.big ? ' iglu-section--hero' : ''}`}
          >
            {sec.eyebrow && <p className="iglu-section__eyebrow">{sec.eyebrow}</p>}
            <h2 className="iglu-section__title">{sec.title}</h2>
            {sec.text && <p className="iglu-section__text">{sec.text}</p>}
            {sec.big && <div className="iglu-scrollhint" aria-hidden="true" />}
          </div>
        ))}
      </div>

      {/* Unsichtbarer Scrollweg: bestimmt die Länge der Kamerafahrt */}
      <div className="iglu-track" aria-hidden="true" />
    </div>
  )
}
