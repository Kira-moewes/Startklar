import { journeys } from './index'
import { istRelevant } from './visibility'
import type { Profile } from './profile'
import type { Task, TaskCategory } from './types'

// Oberthemen: gruppieren Aufgaben aus allen Journeys nach Lebensbereich.
// Die Unterordner strukturieren zusätzlich die Dokumentenablage (/dokumente).
export type Thema = {
  id: string
  titel: string
  icon: string
  beschreibung: string
  kategorien: TaskCategory[]
  unterordner: string[]
}

export const themen: Thema[] = [
  {
    id: 'finanzen',
    titel: 'Finanzen',
    icon: '💶',
    beschreibung: 'Konto, Steuer, Sparen – dein Geld im Griff.',
    kategorien: ['finanzen'],
    unterordner: ['Verträge', 'Bescheide', 'Nachweise', 'Korrespondenz'],
  },
  {
    id: 'wohnen',
    titel: 'Wohnen',
    icon: '🏠',
    beschreibung: 'Alles rund um die erste eigene Wohnung.',
    kategorien: ['wohnen'],
    unterordner: ['Mietvertrag', 'Strom & Internet', 'Nebenkosten', 'Korrespondenz'],
  },
  {
    id: 'amt-recht',
    titel: 'Amt & Recht',
    icon: '🏛️',
    beschreibung: 'Anmeldung, Ausweis, deine Rechte ab 18.',
    kategorien: ['amt', 'recht'],
    unterordner: ['Ausweise', 'Bescheide', 'Anmeldungen', 'Sonstiges'],
  },
  {
    id: 'versicherungen',
    titel: 'Versicherungen',
    icon: '🛡️',
    beschreibung: 'Was du wirklich brauchst – und was nicht.',
    kategorien: ['versicherung'],
    unterordner: ['Policen', 'Schadensfälle', 'Korrespondenz'],
  },
  {
    id: 'mobilitaet',
    titel: 'Mobilität',
    icon: '🚗',
    beschreibung: 'Führerschein, erstes Auto, unterwegs sein.',
    kategorien: ['mobilitaet'],
    unterordner: ['Führerschein', 'Fahrzeug', 'Tickets'],
  },
  {
    id: 'gesundheit',
    titel: 'Gesundheit',
    icon: '🩺',
    beschreibung: 'Krankenkasse, Arzttermine, Vorsorge.',
    kategorien: ['gesundheit'],
    unterordner: ['Krankenkasse', 'Befunde', 'Impfungen & Ausweise'],
  },
  {
    id: 'arbeit',
    titel: 'Arbeit & Ausbildung',
    icon: '💼',
    beschreibung: 'Bewerbung, Ausbildung, erste Gehaltsabrechnung.',
    kategorien: ['arbeit'],
    unterordner: ['Verträge', 'Lohnabrechnungen', 'Bewerbungen', 'Zeugnisse'],
  },
]

export function thema(id: string): Thema | null {
  return themen.find(t => t.id === id) ?? null
}

// Alle für das Profil relevanten Aufgaben eines Themas, über alle Journeys.
export function tasksFuerThema(
  themaId: string,
  profile: Profile | null
): Array<{ journeyId: string; journeyTitel: string; task: Task }> {
  const t = thema(themaId)
  if (!t) return []
  const ergebnis: Array<{ journeyId: string; journeyTitel: string; task: Task }> = []
  for (const journey of journeys) {
    if (!istRelevant(profile, journey.id)) continue
    for (const task of journey.tasks) {
      if (!t.kategorien.includes(task.category)) continue
      if (!istRelevant(profile, journey.id, task.id)) continue
      ergebnis.push({ journeyId: journey.id, journeyTitel: journey.title, task })
    }
  }
  return ergebnis
}
