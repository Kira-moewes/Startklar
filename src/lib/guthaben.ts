import { guthabenStore, progressStore, profilStore } from './stores'
import { journeys } from '../data'
import { relevanteTasks } from '../data/visibility'
import type { Profile } from '../data/profile'

// ---------------------------------------------------------------------------
// Guthaben/Sterne-Engine (lokaler Prototyp des Startklar+ Ökosystems)
//
// Sterne werden durch Aktivität in Startklar verdient und schalten – als
// „Kostprobe" – eine Portfolio-App frei. Ein (im Prototyp gemockter) Pass
// öffnet das ganze Portfolio; das Guthaben *rabattiert* den Pass, verbraucht
// dafür aber keine Sterne. Alles bleibt lokal (IndexedDB via localforage).
//
// Wichtig: Diese Datei importiert NIE einen Hook. Der Fortschritt wird direkt
// aus progressStore gelesen. So bleibt der Graph useProgress → guthaben →
// { stores, data } azyklisch.
// ---------------------------------------------------------------------------

export type GuthabenGrund =
  | { art: 'schritt'; journeyId: string; taskId: string }   // +10
  | { art: 'journey'; journeyId: string }                   // +100
  | { art: 'referral' }                                     // +500 (kein Auto-Trigger)
  | { art: 'kauf-demo'; paket: string }                     // Mock-Kauf mit „echtem" Geld
  | { art: 'freischaltung'; appId: string }                 // -800 (Kostprobe)
  | { art: 'pass-demo' }                                    // 0, Mock-Aktivierung

export type GuthabenEreignis = {
  id: string          // eindeutige ID
  betrag: number      // vorzeichenbehaftet: +10, +100, +500, +N, -800, 0
  grund: GuthabenGrund
  am: string          // ISO-Zeitstempel
}

// Wird als EIN Objekt unter dem Key 'guthaben' gespeichert (wie profil/einstellungen).
export type Guthaben = {
  version: 1
  sterne: number            // aktueller Kontostand
  vergeben: string[]        // Idempotenz-Keys: "journeyId:taskId", "journey:journeyId", "referral"
  freigeschaltet: string[]  // erspielte App-IDs (Kostprobe)
  passAktiv: boolean
  passSeit: string | null   // ISO-Datum der (Mock-)Aktivierung
  verlauf: GuthabenEreignis[] // Ledger (Einnahmen UND Ausgaben), neueste zuerst
}

export const standardGuthaben: Guthaben = {
  version: 1,
  sterne: 0,
  vergeben: [],
  freigeschaltet: [],
  passAktiv: false,
  passSeit: null,
  verlauf: [],
}

// --- Konstanten (transparent, kein Zufall) --------------------------------
export const SCHRITT_BONUS = 10
export const JOURNEY_BONUS = 100
export const REFERRAL_BONUS = 500
export const FREISCHALT_KOSTEN = 800

export const PASS_BASIS_CENT = 399
export const PASS_MIN_CENT = 200          // 50 %-Deckel von 3,99 € → 2,00 €
export const STERNE_PRO_STUFE = 200
export const RABATT_PRO_STUFE_CENT = 100  // 200 ⭐ = 1,00 € Rabatt

// Reiner Preis-Helfer (nur Ganzzahl-Cent, ohne I/O – leicht testbar).
// Der Rabatt SPIEGELT den Kontostand, er verbraucht keine Sterne.
export function passPreisCent(sterne: number): number {
  const stufen = Math.floor(Math.max(0, sterne) / STERNE_PRO_STUFE)
  return Math.max(PASS_MIN_CENT, PASS_BASIS_CENT - stufen * RABATT_PRO_STUFE_CENT)
}

export function formatiereEuro(cent: number): string {
  return (cent / 100).toFixed(2).replace('.', ',') + ' €'
}

// --- State außerhalb von React --------------------------------------------
// Awards feuern aus schreibeErledigt (nicht aus einem Hook), deshalb leben
// Cache, Listener und Speichern hier in der lib.
let cache: Guthaben | null = null
let ladeP: Promise<Guthaben> | null = null
const listeners = new Set<(g: Guthaben) => void>()

function mische(saved: Partial<Guthaben> | null): Guthaben {
  return { ...standardGuthaben, ...(saved ?? {}) }
}

export function ladeGuthaben(): Promise<Guthaben> {
  if (!ladeP) {
    ladeP = guthabenStore
      .getItem<Partial<Guthaben>>('guthaben')
      .then(saved => (cache = mische(saved)))
  }
  return ladeP
}

export function aktuellesGuthaben(): Guthaben | null {
  return cache
}

export function abonniere(fn: (g: Guthaben) => void): void {
  listeners.add(fn)
}

export function deabonniere(fn: (g: Guthaben) => void): void {
  listeners.delete(fn)
}

// --- Serialisierte Mutationen ---------------------------------------------
// Jede Mutation liest zu Beginn den PERSISTIERTEN Stand neu (nicht den evtl.
// veralteten Cache) und läuft durch eine Promise-Kette. So können zwei schnelle
// Awards sich nicht gegenseitig überschreiben, und Writes aus anderen Tabs
// werden mitgenommen.
let kette: Promise<unknown> = Promise.resolve()

function seriell<T>(fn: (g: Guthaben) => Promise<T> | T): Promise<T> {
  const run = async () => {
    const saved = await guthabenStore.getItem<Partial<Guthaben>>('guthaben')
    return fn(mische(saved))
  }
  const next = kette.then(run, run)
  kette = next.catch(() => {})
  return next
}

async function speichere(next: Guthaben): Promise<void> {
  cache = next
  await guthabenStore.setItem('guthaben', next)
  listeners.forEach(fn => fn(next))
}

const neueId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${listeners.size}-${Math.round(Math.random() * 1e9)}`

const ereignis = (betrag: number, grund: GuthabenGrund): GuthabenEreignis => ({
  id: neueId(),
  betrag,
  grund,
  am: new Date().toISOString(),
})

// Liest den Fortschritt direkt aus progressStore (gleiche Key-Konvention wie
// useProgress), ohne den Hook zu importieren → kein Zyklus.
async function istJourneyKomplett(journeyId: string): Promise<boolean> {
  const journey = journeys.find(j => j.id === journeyId)
  if (!journey) return false
  // Der Bonus greift, wenn alle für DIESES Profil sichtbaren Aufgaben erledigt
  // sind – deckungsgleich mit den „100 %", die der/die Nutzer:in im Dashboard
  // sieht (relevanteTasks blendet je nach Profil Aufgaben aus).
  const profile = await profilStore.getItem<Profile>('profil')
  const tasks = relevanteTasks(journey, profile ?? null)
  if (tasks.length === 0) return false
  for (const t of tasks) {
    const erledigt = (await progressStore.getItem<boolean>(`${journeyId}:${t.id}`)) ?? false
    if (!erledigt) return false
  }
  return true
}

// --- Öffentliche Mutatoren -------------------------------------------------

// +10 einmalig pro Schritt, danach +100 einmalig, falls die Journey jetzt
// komplett ist. Wird von schreibeErledigt NUR im „erledigt=true"-Zweig
// aufgerufen (Ent-Haken zieht nie Sterne ab, erneutes Haken vergibt nichts neu).
export async function belohneSchritt(journeyId: string, taskId: string): Promise<void> {
  await seriell(async g => {
    const schrittKey = `${journeyId}:${taskId}`
    const journeyKey = `journey:${journeyId}`
    let sterne = g.sterne
    const vergeben = [...g.vergeben]
    const verlauf = [...g.verlauf]

    if (!vergeben.includes(schrittKey)) {
      vergeben.push(schrittKey)
      sterne += SCHRITT_BONUS
      verlauf.unshift(ereignis(SCHRITT_BONUS, { art: 'schritt', journeyId, taskId }))
    }
    // Journey-Bonus: läuft NACH dem committeten Progress-Write (schreibeErledigt
    // hat sein setItem bereits awaited), der letzte Schritt zählt also mit.
    if (!vergeben.includes(journeyKey) && (await istJourneyKomplett(journeyId))) {
      vergeben.push(journeyKey)
      sterne += JOURNEY_BONUS
      verlauf.unshift(ereignis(JOURNEY_BONUS, { art: 'journey', journeyId }))
    }

    if (sterne !== g.sterne) await speichere({ ...g, sterne, vergeben, verlauf })
  })
}

// -800 für eine Kostprobe. Liefert false, wenn schon frei oder zu wenig Sterne.
export async function freischalten(appId: string): Promise<boolean> {
  return seriell(async g => {
    if (g.freigeschaltet.includes(appId)) return false
    if (g.sterne < FREISCHALT_KOSTEN) return false
    await speichere({
      ...g,
      sterne: g.sterne - FREISCHALT_KOSTEN,
      freigeschaltet: [...g.freigeschaltet, appId],
      verlauf: [ereignis(-FREISCHALT_KOSTEN, { art: 'freischaltung', appId }), ...g.verlauf],
    })
    return true
  })
}

// Mock – setzt das Pass-Flag; kostet keine Sterne.
export async function passAktivieren(): Promise<void> {
  await seriell(async g => {
    if (g.passAktiv) return
    await speichere({
      ...g,
      passAktiv: true,
      passSeit: new Date().toISOString().slice(0, 10),
      verlauf: [ereignis(0, { art: 'pass-demo' }), ...g.verlauf],
    })
  })
}

// Mock-Kauf mit „echtem" Geld (in der UI klar als Demo gekennzeichnet).
export async function kaufeSterneDemo(anzahl: number, paket: string): Promise<void> {
  await seriell(async g => {
    await speichere({
      ...g,
      sterne: g.sterne + anzahl,
      verlauf: [ereignis(anzahl, { art: 'kauf-demo', paket }), ...g.verlauf],
    })
  })
}
