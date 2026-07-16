import type { Profile } from './profile'

// ---------------------------------------------------------------------------
// Portfolio-Katalog: die kleinen Apps rund um Startklar.
//
// PROTOTYP: bis auf Projektor (real, extern) sind das Platzhalter, damit das
// Ökosystem-Modell erlebbar wird. Editierbar – neue Apps hier eintragen.
//
//  art:
//   'erspielbar' – die EINE Kostprobe: für FREISCHALT_KOSTEN (800 ⭐) freischalten.
//   'pass'       – durch den Startklar+ Pass geöffnet.
//   'extern'     – reale Erweiterungs-App (Projektor), öffnet außerhalb.
//   'bald'       – Platzhalter „kommt bald".
// ---------------------------------------------------------------------------

export type PortfolioArt = 'erspielbar' | 'pass' | 'extern' | 'bald'

export type PortfolioApp = {
  id: string
  name: string
  emoji: string
  tagline: string
  kategorie: string
  art: PortfolioArt
  href?: string // nur für art:'extern'
  // Timing: trifft dieses Profil zu, wird die App „im richtigen Moment" empfohlen.
  timing?: (p: Profile) => boolean
}

export const portfolioApps: PortfolioApp[] = [
  {
    id: 'projektor',
    name: 'Projektor',
    emoji: '🎬',
    tagline: 'Eigene Projekte planen, brainstormen und mit anderen fertigstellen.',
    kategorie: 'Kreativ & Community',
    art: 'extern',
    href: '/',
  },
  {
    id: 'umzugshelfer',
    name: 'Umzugshelfer',
    emoji: '📦',
    tagline: 'Ummeldung, Nachsendeauftrag, Kaution – der ganze Umzug als Checkliste.',
    kategorie: 'Wohnen',
    art: 'erspielbar',
    timing: p => p.wohnsituation === 'auszug_geplant' || p.wohnsituation === 'ausgezogen',
  },
  {
    id: 'steuer-starter',
    name: 'Steuer-Starter',
    emoji: '🧾',
    tagline: 'Deine erste Steuererklärung – ohne Fachchinesisch, Schritt für Schritt.',
    kategorie: 'Finanzen',
    art: 'pass',
    timing: p => p.status === 'berufstaetig' || p.status === 'azubi' || p.einkommen === 'vollzeit',
  },
  {
    id: 'bewerbungs-coach',
    name: 'Bewerbungs-Coach',
    emoji: '💼',
    tagline: 'Lebenslauf, Anschreiben und Vorbereitung auf das erste Gespräch.',
    kategorie: 'Arbeit',
    art: 'pass',
    timing: p => p.status === 'suchend',
  },
  {
    id: 'budget-buddy',
    name: 'Budget-Buddy',
    emoji: '💸',
    tagline: 'Überblick über Geld, das erste eigene Budget und kleine Sparziele.',
    kategorie: 'Finanzen',
    art: 'pass',
    timing: p => p.einkommen === 'keins' || p.einkommen === 'minijob',
  },
  {
    id: 'bald',
    name: 'Kommt bald',
    emoji: '✨',
    tagline: 'Weitere Apps sind in Arbeit – dein Pass schaltet sie automatisch frei.',
    kategorie: '',
    art: 'bald',
  },
]

// Die eine Kostprobe-App (art:'erspielbar').
export const kostprobeApp = portfolioApps.find(a => a.art === 'erspielbar') ?? null

// Empfehlung „im richtigen Moment": erste App, deren Timing auf das Profil
// passt (Reihenfolge im Katalog = Priorität). Ohne Profil kein Vorschlag.
export function empfehlungFuerProfil(profile: Profile | null): PortfolioApp | null {
  if (!profile) return null
  return portfolioApps.find(a => a.timing?.(profile)) ?? null
}
