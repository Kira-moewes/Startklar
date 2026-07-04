import type { Profile } from './profile'
import type { Journey, Task } from './types'

type Bedingung = { feld: keyof Profile; einesVon: string[] }

// Aufgabe/Journey erscheint, wenn ALLE Bedingungen passen.
// Unbeantwortete Felder blockieren nie (default: sichtbar).
export const sichtbarkeit: Record<string, Bedingung[]> = {
  'erste-wohnung': [
    { feld: 'wohnsituation', einesVon: ['auszug_geplant', 'ausgezogen', 'wg'] },
  ],
  'mobilitaet': [
    { feld: 'mobilitaet', einesVon: ['fs_laeuft', 'fs_ohne_auto', 'auto_geplant', 'auto'] },
  ],
  'mobilitaet:kfz-anmelden': [
    { feld: 'mobilitaet', einesVon: ['auto_geplant', 'auto'] },
  ],
  'mobilitaet:kfz-versicherung': [
    { feld: 'mobilitaet', einesVon: ['auto_geplant', 'auto'] },
  ],
  'mobilitaet:fuehrerschein-fristen': [
    { feld: 'mobilitaet', einesVon: ['fs_laeuft'] },
  ],
  'finanzen:steuererklaerung': [
    { feld: 'einkommen', einesVon: ['minijob', 'ausbildung', 'vollzeit', 'werkstudent'] },
  ],
  'finanzen:lohnabrechnung': [
    { feld: 'einkommen', einesVon: ['minijob', 'ausbildung', 'vollzeit', 'werkstudent'] },
  ],
  'finanzen:familienversicherung-check': [
    { feld: 'krankenversicherung', einesVon: ['familie', 'unklar'] },
  ],
  // start journey
  'start:bafoeg': [
    { feld: 'status', einesVon: ['student'] },
  ],
  // start:minijob: (einkommen [keins, minijob] OR status [schueler, student]) - kept visible for all
  // since current AND-only engine doesn't support OR; permissive visibility is correct
  'start:bewerbung-ausbildung': [
    { feld: 'status', einesVon: ['schueler', 'suchend'] },
  ],
  'start:krankenkasse-check': [
    { feld: 'krankenversicherung', einesVon: ['familie', 'unklar'] },
  ],
  // start:kindergeld-ab-18: visible for all (volljaehrig [nein, ja] would be all)
}

export function istRelevant(profile: Profile | null, journeyId: string, taskId?: string): boolean {
  if (!profile) return true
  const bedingungen = sichtbarkeit[taskId ? `${journeyId}:${taskId}` : journeyId]
  if (!bedingungen) return true
  return bedingungen.every(b => {
    const wert = profile[b.feld]
    if (!wert) return true
    return b.einesVon.includes(wert as string)
  })
}

export function relevanteTasks(journey: Journey, profile: Profile | null): Task[] {
  if (!istRelevant(profile, journey.id)) return []
  return journey.tasks.filter(t => istRelevant(profile, journey.id, t.id))
}
