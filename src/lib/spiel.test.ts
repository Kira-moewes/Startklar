import { describe, expect, it } from 'vitest'
import {
  applyEreignis,
  FREISCHALTUNGEN,
  gebietMeisterschaft,
  gebietXp,
  leererSpielState,
  questLevel,
  type SpielState,
} from './spiel'

const D = '2026-07-07'

function orient(state: SpielState, quest: string) {
  return applyEreignis(state, { typ: 'QUEST_ORIENTED', gebiet: 'g', quest })
}
function complete(state: SpielState, quest: string, erledigt: boolean, gesamt: number) {
  return applyEreignis(state, {
    typ: 'QUEST_COMPLETED', gebiet: 'g', quest, titel: quest, erledigt, gesamtImGebiet: gesamt, datum: D,
  })
}

describe('applyEreignis', () => {
  it('QUEST_ORIENTED hebt auf L1 und vergibt 10 XP', () => {
    const { state, belohnungen } = orient(leererSpielState, 'a')
    expect(questLevel(state, 'g', 'a')).toBe(1)
    expect(gebietXp(state, 'g')).toBe(10)
    expect(belohnungen).toContainEqual({ typ: 'xp', gebiet: 'g', menge: 10 })
  })

  it('QUEST_COMPLETED direkt von L0 auf L2 gibt die volle XP-Summe (35), nicht doppelt', () => {
    const { state } = complete(leererSpielState, 'a', true, 3)
    expect(questLevel(state, 'g', 'a')).toBe(2)
    expect(gebietXp(state, 'g')).toBe(35)
  })

  it('erstes L2 im Gebiet schaltet das Entdecker-Set frei und schreibt ins Flugbuch', () => {
    const { state, belohnungen } = complete(leererSpielState, 'a', true, 3)
    expect(state.freigeschaltet).toContain(FREISCHALTUNGEN.entdecker.id)
    expect(belohnungen.some(b => b.typ === 'freischaltung' && b.id === FREISCHALTUNGEN.entdecker.id)).toBe(true)
    expect(state.flugbuch.length).toBe(1)
  })

  it('alle Aufgaben eines Gebiets erledigt schaltet das Meister-Set frei', () => {
    let s = leererSpielState
    s = complete(s, 'a', true, 3).state
    s = complete(s, 'b', true, 3).state
    const letzte = complete(s, 'c', true, 3)
    expect(letzte.state.freigeschaltet).toContain(FREISCHALTUNGEN.meister.id)
    expect(gebietMeisterschaft(letzte.state, 'g', 3)).toBe(1)
  })

  it('Rücknahme senkt L2 auf L1, aber XP und Freischaltungen bleiben (keine Verlust-Mechanik)', () => {
    const nachErledigt = complete(leererSpielState, 'a', true, 3).state
    const xpVorher = gebietXp(nachErledigt, 'g')
    const { state } = complete(nachErledigt, 'a', false, 3)
    expect(questLevel(state, 'g', 'a')).toBe(1)
    expect(gebietXp(state, 'g')).toBe(xpVorher) // XP sinkt nie
    expect(state.freigeschaltet).toContain(FREISCHALTUNGEN.entdecker.id) // bleibt frei
  })

  it('erneutes Erledigen vergibt keine XP doppelt', () => {
    const einmal = complete(leererSpielState, 'a', true, 3).state
    const nochmal = complete(einmal, 'a', true, 3).state
    expect(gebietXp(nochmal, 'g')).toBe(35)
  })

  it('CHECK_COMPLETED hebt auf L1 und legt ein Steckbrief-Artefakt ins Flugbuch', () => {
    const { state } = applyEreignis(leererSpielState, {
      typ: 'CHECK_COMPLETED', gebiet: 'g', quest: 'a', titel: 'Hausrat', datum: D,
    })
    expect(questLevel(state, 'g', 'a')).toBe(1)
    expect(state.flugbuch.some(e => e.text.includes('Hausrat'))).toBe(true)
  })

  it('lässt den Eingangszustand unverändert (Immutability)', () => {
    const vorher = leererSpielState
    orient(vorher, 'a')
    expect(vorher.quests).toEqual({})
    expect(vorher.xp).toEqual({})
  })

  it('gebietMeisterschaft ist 0 bei gesamt 0', () => {
    expect(gebietMeisterschaft(leererSpielState, 'g', 0)).toBe(0)
  })
})
