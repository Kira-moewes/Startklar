import type { Profile } from '../profile'
import type { WizardFrage } from '../../components/FragenWizard'

// Fragebogen-Frage eines Bedarfschecks. Kann eine Antwort aus dem Profil
// vorbelegen (damit Bekanntes nicht erneut gefragt wird).
export type BedarfsFrage = WizardFrage & {
  vorbelegung?: (profil: Profile) => string | undefined
}

export type ZielStatus = 'erfuellt' | 'nicht-erfuellt' | 'unklar'

// Ein individueller Zielwert aus dem Bedarfscheck. `pruefe` (optional) bewertet
// einen eingetragenen Angebotswert; fehlt es, wird der Zielwert nur angezeigt.
export type Zielwert = {
  kriteriumKey?: string             // Bezug zu einer Vergleichs-Kriteriumsspalte
  label: string
  ziel: string                      // menschenlesbar, z. B. 'mind. 50 Mio. €'
  pruefe?: (wert: string) => ZielStatus
}

export type BedarfsErgebnis = {
  stufe: 'wichtig' | 'pruefen' | 'verzichtbar'
  titel: string
  begruendung: string
  zielwerte: Zielwert[]
  // Empfohlene Tarif-Bausteine ohne Kriterium-Bezug (Teil des Steckbriefs),
  // z. B. 'Elementarschäden' oder 'Weltweiter Schutz ≥ 1 Jahr'.
  bausteine?: string[]
  hinweise: string[]
}

export type BedarfsCheck = {
  kategorieId: string
  titel: string
  intro: string
  fragen: BedarfsFrage[]
  auswerten: (antworten: Record<string, string>, profil: Profile | null) => BedarfsErgebnis
}
