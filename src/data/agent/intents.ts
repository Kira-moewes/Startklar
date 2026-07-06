import type { Journey, Task } from '../types'
import type { Profile } from '../profile'
import type { Termin } from '../../hooks/useTermine'
import type { AgentAction, AgentLink, AgentMessage } from './types'
import { normalisiere, suche } from '../../lib/retrieval'
import { wissensbasis } from './wissensbasis'

export type AgentKontext = {
  profile: Profile | null
  bereiche: Array<{ journey: Journey; tasks: Task[]; done: Record<string, boolean> }>
  termine: Termin[]
}

const heute = () => new Date().toISOString().slice(0, 10)

function nachricht(text: string, links?: AgentLink[], actions?: AgentAction[]): AgentMessage {
  return { id: crypto.randomUUID(), rolle: 'klaro', text, links, actions, quelle: 'lokal', zeit: new Date().toISOString() }
}

function offeneSchritte(ctx: AgentKontext): Array<{ journey: Journey; task: Task }> {
  const offen: Array<{ journey: Journey; task: Task }> = []
  for (const b of ctx.bereiche) {
    for (const task of b.tasks) {
      if (!b.done[task.id]) offen.push({ journey: b.journey, task })
    }
  }
  return offen
}

// Reihenfolge = Priorität. Liefert null, wenn kein Intent passt (→ Retrieval).
export function beantworteIntent(frage: string, ctx: AgentKontext): AgentMessage | null {
  const f = normalisiere(frage.trim())

  // Begrüßung / „Was kannst du?"
  if (f.length === 0 || /(^|\s)(hallo|hey|hi|moin|servus)(\s|$|!|\?)/.test(f) || /was kannst du|wer bist du|hilfe$|^hilfe/.test(f)) {
    return nachricht(
      'Hey! Ich bin Klaro und kenne alle Schritte, Vergleiche und Funktionen von Startklar – und deinen Stand. Frag mich z. B. „Was ist mein nächster Schritt?", „Was bedeutet Kaution?" oder „Wie exportiere ich meine Daten?". Ich verlinke dir immer die passende Stelle in der App.',
      [
        { label: 'Dein Fortschritt', route: '/fortschritt' },
        { label: 'Deine Termine', route: '/termine' },
        { label: 'Profil & Einstellungen', route: '/profil' },
      ]
    )
  }

  // Nächster Schritt
  if (/naechst(er|es|e)? schritt|womit (fange|starte|beginne)|wo (fange|starte) ich|was (soll|kann|muss) ich (als naechstes |zuerst |jetzt )?(tun|machen|angehen)/.test(f)) {
    const offen = offeneSchritte(ctx)
    if (offen.length === 0) {
      return nachricht(
        ctx.bereiche.length === 0
          ? 'Du hast noch kein Profil – beantworte kurz die 7 Fragen, dann sage ich dir genau, wo du anfängst.'
          : 'Stark – du hast alle für dich relevanten Schritte erledigt! Schau ab und zu rein, ob sich bei dir etwas geändert hat.',
        ctx.bereiche.length === 0 ? [{ label: 'Onboarding starten', route: '/onboarding' }] : [{ label: 'Zum Fortschritt', route: '/fortschritt' }]
      )
    }
    const { journey, task } = offen[0]
    const route = `/journey/${journey.id}/task/${task.id}`
    return nachricht(
      `Dein nächster Schritt: „${task.title}" (Bereich ${journey.title}). ${task.summary}${offen.length > 1 ? ` Danach warten noch ${offen.length - 1} weitere Schritte.` : ''}`,
      [{ label: task.title, route }],
      [{ typ: 'navigiere', route, label: 'Bring mich hin' }]
    )
  }

  // Überfällig
  if (/ueberfaellig|verpasst|frist(en)? (abgelaufen|verpasst|versaeumt)|deadline/.test(f)) {
    const faellig = ctx.termine.filter(t => !t.erledigt && t.datum < heute())
    if (faellig.length === 0) {
      const kommend = ctx.termine.filter(t => !t.erledigt && t.datum >= heute()).length
      return nachricht(
        `Nichts ist überfällig – gut unterwegs!${kommend > 0 ? ` ${kommend} ${kommend === 1 ? 'Termin steht' : 'Termine stehen'} noch an.` : ''}`,
        [{ label: 'Zu den Terminen', route: '/termine' }]
      )
    }
    const liste = faellig.slice(0, 3).map(t => `„${t.titel}" (${t.datum})`).join(', ')
    return nachricht(
      `${faellig.length === 1 ? 'Ein Termin ist' : `${faellig.length} Termine sind`} überfällig: ${liste}. Schau kurz rein und hak ab oder verschiebe.`,
      [{ label: 'Termine öffnen', route: '/termine' }],
      [{ typ: 'navigiere', route: '/termine', label: 'Termine öffnen' }]
    )
  }

  // Fortschritt
  if (/wie weit bin ich|fortschritt|wie ?viel (habe ich )?(geschafft|erledigt)|was habe ich (schon )?(geschafft|erledigt)/.test(f)) {
    const gesamt = ctx.bereiche.reduce((n, b) => n + b.tasks.length, 0)
    const erledigt = ctx.bereiche.reduce((n, b) => n + b.tasks.filter(t => b.done[t.id]).length, 0)
    if (gesamt === 0) {
      return nachricht('Ich kenne deine Situation noch nicht – nach den 7 Onboarding-Fragen kann ich dir deinen Stand zeigen.', [{ label: 'Onboarding starten', route: '/onboarding' }])
    }
    const pct = Math.round((erledigt / gesamt) * 100)
    const jeBereich = ctx.bereiche
      .map(b => `${b.journey.title}: ${b.tasks.filter(t => b.done[t.id]).length}/${b.tasks.length}`)
      .join(' · ')
    return nachricht(
      `Du hast ${erledigt} von ${gesamt} Schritten geschafft (${pct} %). ${jeBereich}. ${erledigt === 0 ? 'Fang einfach mit dem ersten an – ich zeig ihn dir, wenn du nach dem nächsten Schritt fragst.' : 'Weiter so!'}`,
      [{ label: 'Zum Fortschritt', route: '/fortschritt' }]
    )
  }

  // Erledigt melden („hab die Anmeldung erledigt")
  const erledigtMatch = /(hab|habe|ist) .*(erledigt|geschafft|gemacht|abgeschlossen|fertig)|hak(e)? .*ab|als erledigt/.test(f)
  if (erledigtMatch) {
    const offen = offeneSchritte(ctx)
    const treffer = suche(f, wissensbasis().filter(e => e.art === 'task'), 1)[0]
    const passend = treffer && treffer.punkte >= 3 && treffer.eintrag.journeyId && treffer.eintrag.taskId
      ? offen.find(o => o.journey.id === treffer.eintrag.journeyId && o.task.id === treffer.eintrag.taskId)
      : undefined
    if (passend) {
      return nachricht(
        `Klingt gut! Soll ich „${passend.task.title}" für dich als erledigt markieren?`,
        undefined,
        [{ typ: 'erledigt-vorschlag', journeyId: passend.journey.id, taskId: passend.task.id, titel: passend.task.title }]
      )
    }
    return nachricht(
      'Stark! Sag mir, welcher Schritt es war (z. B. „Anmeldung erledigt"), oder hak ihn direkt im Bereich ab – der Kreis links neben der Aufgabe.',
      [{ label: 'Zum Fortschritt', route: '/fortschritt' }]
    )
  }

  // Termin anlegen / Erinnerung
  if (/erinner|termin (anlegen|erstellen|eintragen|machen)|neuer termin|neuen termin/.test(f)) {
    const treffer = suche(f, wissensbasis().filter(e => e.art === 'task'), 1)[0]
    if (treffer && treffer.punkte >= 3) {
      return nachricht(
        `Gern – soll ich einen Termin zu „${treffer.eintrag.titel}" vorbereiten? Datum und Uhrzeit wählst du dann selbst.`,
        undefined,
        [{ typ: 'termin-vorschlag', titel: treffer.eintrag.titel, journeyId: treffer.eintrag.journeyId, taskId: treffer.eintrag.taskId }]
      )
    }
    return nachricht(
      'Klar – ich bereite dir einen neuen Termin vor, Datum und Details trägst du dann ein.',
      undefined,
      [{ typ: 'termin-vorschlag', titel: '' }]
    )
  }

  // Profil ändern / Lebenssituation geändert
  if (/profil (aendern|anpassen)|bin (um)?gezogen|habe jetzt ein auto|hab jetzt ein auto|situation .*(geaendert|anders)|bin jetzt (student|azubi|berufstaetig)/.test(f)) {
    return nachricht(
      'Das änderst du auf deiner Profilseite – tippe einfach die passende Frage an und wähl die neue Antwort. Ich passe die Schritte danach automatisch an.',
      [{ label: 'Profil öffnen', route: '/profil' }],
      [{ typ: 'navigiere', route: '/profil', label: 'Profil öffnen' }]
    )
  }

  return null
}

// Kurze, lokale Zusammenfassung für den (optionalen) KI-Modus –
// wird nur gesendet, wenn „Kontext mitschicken" aktiv ist.
export function kontextZusammenfassung(ctx: AgentKontext): string {
  const teile: string[] = []
  if (ctx.profile) {
    const p = ctx.profile
    teile.push(`Profil: ${[p.status, p.wohnsituation, p.mobilitaet, p.einkommen].filter(Boolean).join(', ')}`)
  }
  const offen = offeneSchritte(ctx).slice(0, 3).map(o => o.task.title)
  if (offen.length) teile.push(`Nächste offene Schritte: ${offen.join('; ')}`)
  const faellig = ctx.termine.filter(t => !t.erledigt && t.datum < heute()).length
  if (faellig > 0) teile.push(`${faellig} Termin(e) überfällig`)
  return teile.join('. ').slice(0, 500)
}
