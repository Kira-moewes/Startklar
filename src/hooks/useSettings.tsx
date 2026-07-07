import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { einstellungenStore } from '../lib/stores'
import { ableitungen } from '../lib/farben'

export type Einstellungen = {
  theme: 'hell' | 'dunkel' | 'system'
  akzent: 'olive' | 'koralle' | 'himmel' | 'beere' | 'eigene'
  akzentHex: string
  schrift: 's' | 'm' | 'l'
  wenigerAnimation: boolean
  kiModus: boolean
  kiKontext: boolean
  kiHinweisGesehen: boolean
  // Spiel-Ebene „Himmel & Papierflieger"
  welt: 'himmel'
  startseite: 'spiel' | 'klassisch' // Umschalter: neue Spiel-Startseite oder klassische Ansicht
  ausruestung: string // angelegtes Kosmetik-Set der Flieger-Figur ('keine' | Freischaltungs-ID)
}

export const standardEinstellungen: Einstellungen = {
  theme: 'system',
  akzent: 'olive',
  akzentHex: '#606C38',
  schrift: 'm',
  wenigerAnimation: false,
  kiModus: false,
  kiKontext: false,
  kiHinweisGesehen: false,
  welt: 'himmel',
  startseite: 'spiel',
  ausruestung: 'keine',
}

// Hintergrundfarben der Themes (--t-bg in index.css) – für die PWA-/Browserleiste.
const THEME_COLOR = { hell: '#FEFAE0', dunkel: '#161C10' } as const

const SPIEGEL_KEY = 'startklar-anzeige'

// Attribute auf <html> anwenden – dieselbe Logik läuft als Inline-Script
// in index.html vor dem ersten Paint (Flash-Vermeidung).
function anwenden(e: Einstellungen) {
  const root = document.documentElement
  const dunkel = e.theme === 'dunkel' ||
    (e.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.setAttribute('data-theme', dunkel ? 'dunkel' : 'hell')
  root.setAttribute('data-akzent', e.akzent)
  root.setAttribute('data-schrift', e.schrift)
  root.setAttribute('data-motion', e.wenigerAnimation ? 'reduziert' : 'normal')
  root.setAttribute('data-welt', e.welt)
  // PWA-/Browserleiste folgt dem Theme (statisches Fallback steht in index.html)
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dunkel ? THEME_COLOR.dunkel : THEME_COLOR.hell)
  // Eigene Farbe: abgeleitete Stufen als Inline-Variablen (gewinnen gegen
  // die Preset-Selektoren); bei Presets wieder entfernen.
  let eigene: [string, string, string, string] | null = null
  if (e.akzent === 'eigene') {
    const a = ableitungen(e.akzentHex)
    eigene = [a.base, a.soft, a.deep, a.onAkzent]
    root.style.setProperty('--a-base', a.base)
    root.style.setProperty('--a-soft', a.soft)
    root.style.setProperty('--a-deep', a.deep)
    root.style.setProperty('--t-on-akzent', a.onAkzent)
  } else {
    for (const p of ['--a-base', '--a-soft', '--a-deep', '--t-on-akzent']) root.style.removeProperty(p)
  }
  try {
    localStorage.setItem(SPIEGEL_KEY, JSON.stringify({
      theme: e.theme, akzent: e.akzent, schrift: e.schrift, wenigerAnimation: e.wenigerAnimation,
      welt: e.welt, eigene,
    }))
  } catch { /* localStorage nicht verfügbar – Attribute reichen */ }
}

type SettingsContextValue = {
  einstellungen: Einstellungen
  setEinstellung: <K extends keyof Einstellungen>(key: K, wert: Einstellungen[K]) => void
  loading: boolean
}

const SettingsContext = createContext<SettingsContextValue>({
  einstellungen: standardEinstellungen,
  setEinstellung: () => {},
  loading: true,
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [einstellungen, setEinstellungen] = useState<Einstellungen>(standardEinstellungen)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void einstellungenStore.getItem<Partial<Einstellungen>>('einstellungen').then(saved => {
      const e = { ...standardEinstellungen, ...(saved ?? {}) }
      setEinstellungen(e)
      anwenden(e)
      setLoading(false)
    })
  }, [])

  // System-Modus folgt dem OS live
  useEffect(() => {
    if (einstellungen.theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => anwenden(einstellungen)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [einstellungen])

  const setEinstellung = useCallback(<K extends keyof Einstellungen>(key: K, wert: Einstellungen[K]) => {
    setEinstellungen(prev => {
      const next = { ...prev, [key]: wert }
      anwenden(next)
      void einstellungenStore.setItem('einstellungen', next)
      return next
    })
  }, [])

  return (
    <SettingsContext value={{ einstellungen, setEinstellung, loading }}>
      {children}
    </SettingsContext>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
