// Spiel-Logik als reiner Reducer – keine Seiteneffekte, keine Zeit-/Zufalls-
// quelle (Datum kommt via Ereignis herein), damit sie vollständig testbar ist.
// Grundsätze aus dem Konzept r7: keine Verlust-Mechanik (XP und Freischaltungen
// sinken nie), Belohnung für Meisterschaft statt fürs bloße Abhaken,
// Freischaltungen deterministisch und vorher sichtbar.

// L0 = nichts, L1 = „Verstanden" (Einordnung/Check gesehen),
// L2 = „Gemacht" (real erledigt).
export type Level = 0 | 1 | 2

export type QuestFortschritt = { level: Level }

export type FlugbuchEintrag = { text: string; datum: string }

export type SpielState = {
  version: 1
  xp: Record<string, number> // je Gebiet (journeyId) → XP
  quests: Record<string, QuestFortschritt> // Schlüssel `${gebiet}:${quest}`
  freigeschaltet: string[] // Freischaltungs-IDs (Ausrüstung/Sets)
  flugbuch: FlugbuchEintrag[] // Sammel-/Meilenstein-Einträge
}

export const leererSpielState: SpielState = {
  version: 1,
  xp: {},
  quests: {},
  freigeschaltet: [],
  flugbuch: [],
}

export type SpielEreignis =
  | { typ: 'QUEST_ORIENTED'; gebiet: string; quest: string }
  | { typ: 'CHECK_COMPLETED'; gebiet: string; quest: string; titel: string; datum: string }
  | {
      typ: 'QUEST_COMPLETED'
      gebiet: string
      quest: string
      titel: string
      erledigt: boolean
      gesamtImGebiet: number
      datum: string
    }

export type Belohnung =
  | { typ: 'xp'; gebiet: string; menge: number }
  | { typ: 'level'; gebiet: string; quest: string; level: Level }
  | { typ: 'freischaltung'; id: string; titel: string }
  | { typ: 'flugbuch'; text: string }

// Kumulative XP je erreichtem Level – die Differenz wird vergeben, damit ein
// Sprung von L0 direkt auf L2 die volle Summe bringt und nie doppelt zählt.
const XP_KUMULATIV: Record<Level, number> = { 0: 0, 1: 10, 2: 35 }

// Deterministische Freischaltungen (vorher sichtbar, siehe Konzept).
export const FREISCHALTUNGEN = {
  entdecker: { id: 'gear-entdecker', titel: 'Entdecker-Set (Fliegerbrille)' },
  meister: { id: 'gear-meister', titel: 'Meister-Set (Goldener Schal)' },
} as const

function levelVon(state: SpielState, key: string): Level {
  return state.quests[key]?.level ?? 0
}

function zahlL2ImGebiet(state: SpielState, gebiet: string): number {
  let n = 0
  for (const [key, q] of Object.entries(state.quests)) {
    if (key.startsWith(`${gebiet}:`) && q.level === 2) n += 1
  }
  return n
}

// Hebt ein Quest auf mindestens `ziel`; vergibt die XP-Differenz. Senkt nie.
function hebeLevel(
  state: SpielState,
  belohnungen: Belohnung[],
  gebiet: string,
  quest: string,
  ziel: Level,
): void {
  const key = `${gebiet}:${quest}`
  const vorher = levelVon(state, key)
  if (ziel <= vorher) return
  state.quests = { ...state.quests, [key]: { level: ziel } }
  const delta = XP_KUMULATIV[ziel] - XP_KUMULATIV[vorher]
  if (delta > 0) {
    state.xp = { ...state.xp, [gebiet]: (state.xp[gebiet] ?? 0) + delta }
    belohnungen.push({ typ: 'xp', gebiet, menge: delta })
  }
  belohnungen.push({ typ: 'level', gebiet, quest, level: ziel })
}

function freischalten(
  state: SpielState,
  belohnungen: Belohnung[],
  eintrag: { id: string; titel: string },
): void {
  if (state.freigeschaltet.includes(eintrag.id)) return
  state.freigeschaltet = [...state.freigeschaltet, eintrag.id]
  belohnungen.push({ typ: 'freischaltung', id: eintrag.id, titel: eintrag.titel })
}

function insFlugbuch(
  state: SpielState,
  belohnungen: Belohnung[],
  text: string,
  datum: string,
): void {
  if (state.flugbuch.some(e => e.text === text)) return
  state.flugbuch = [...state.flugbuch, { text, datum }]
  belohnungen.push({ typ: 'flugbuch', text })
}

// Wendet ein Ereignis an und liefert den neuen Zustand + die dabei entstandenen
// Belohnungen (für Feedback-Popups). Der Eingangszustand bleibt unverändert.
export function applyEreignis(
  vorher: SpielState,
  e: SpielEreignis,
): { state: SpielState; belohnungen: Belohnung[] } {
  const state: SpielState = {
    version: 1,
    xp: { ...vorher.xp },
    quests: { ...vorher.quests },
    freigeschaltet: [...vorher.freigeschaltet],
    flugbuch: [...vorher.flugbuch],
  }
  const belohnungen: Belohnung[] = []

  switch (e.typ) {
    case 'QUEST_ORIENTED':
      hebeLevel(state, belohnungen, e.gebiet, e.quest, 1)
      break

    case 'CHECK_COMPLETED':
      hebeLevel(state, belohnungen, e.gebiet, e.quest, 1)
      insFlugbuch(state, belohnungen, `Steckbrief erstellt: ${e.titel}`, e.datum)
      break

    case 'QUEST_COMPLETED':
      if (e.erledigt) {
        hebeLevel(state, belohnungen, e.gebiet, e.quest, 2)
        const l2 = zahlL2ImGebiet(state, e.gebiet)
        if (l2 === 1) {
          freischalten(state, belohnungen, FREISCHALTUNGEN.entdecker)
          insFlugbuch(state, belohnungen, `Erste Insel erschlossen: ${e.titel}`, e.datum)
        }
        if (e.gesamtImGebiet > 0 && l2 >= e.gesamtImGebiet) {
          freischalten(state, belohnungen, FREISCHALTUNGEN.meister)
          insFlugbuch(state, belohnungen, 'Ein ganzes Gebiet gemeistert – du fliegst frei.', e.datum)
        }
      } else {
        // Rücknahme: Meisterschaft fällt auf „Verstanden" zurück, aber XP,
        // Freischaltungen und Flugbuch bleiben erhalten (keine Verlust-Mechanik).
        const key = `${e.gebiet}:${e.quest}`
        if (levelVon(state, key) === 2) {
          state.quests = { ...state.quests, [key]: { level: 1 } }
        }
      }
      break
  }

  return { state, belohnungen }
}

// Abgeleitete Kennzahlen für die UI.
export function gebietXp(state: SpielState, gebiet: string): number {
  return state.xp[gebiet] ?? 0
}

export function questLevel(state: SpielState, gebiet: string, quest: string): Level {
  return levelVon(state, `${gebiet}:${quest}`)
}

export function gebietMeisterschaft(
  state: SpielState,
  gebiet: string,
  gesamt: number,
): number {
  if (gesamt <= 0) return 0
  return zahlL2ImGebiet(state, gebiet) / gesamt
}
