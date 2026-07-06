import type { BedarfsCheck } from './types'
import { haftpflichtCheck } from './haftpflicht'
import { hausratCheck } from './hausrat'
import { kfzCheck } from './kfz'

// Registry aller Bedarfschecks, per Vergleichs-Kategorie-ID.
export const bedarfsChecks: Record<string, BedarfsCheck> = {
  haftpflicht: haftpflichtCheck,
  hausrat: hausratCheck,
  kfz: kfzCheck,
}

export function bedarfsCheck(kategorieId: string): BedarfsCheck | null {
  return bedarfsChecks[kategorieId] ?? null
}

export function hatBedarfsCheck(kategorieId: string): boolean {
  return kategorieId in bedarfsChecks
}
