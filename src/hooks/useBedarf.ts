import { useCallback, useEffect, useState } from 'react'
import { bedarfStore } from '../lib/stores'
import { bedarfsCheck, bedarfsChecks } from '../data/bedarf'
import type { BedarfsErgebnis } from '../data/bedarf/types'
import type { Profile } from '../data/profile'
import { useProfile } from './useProfile'

type Gespeichert = {
  antworten: Record<string, string>
  stand: string
  // Snapshot der Profil-Vorbelegungen zum Zeitpunkt des Checks – erkennt
  // später, ob eine Profil-Antwort geändert wurde, die den Check speist.
  profilStand?: Record<string, string | undefined>
}

// Vorbelegungs-Werte aller Fragen eines Checks aus dem Profil ableiten.
function profilVorbelegungen(kategorieId: string, profil: Profile | null): Record<string, string | undefined> {
  const check = bedarfsCheck(kategorieId)
  const werte: Record<string, string | undefined> = {}
  if (!check || !profil) return werte
  for (const f of check.fragen) {
    if (f.vorbelegung) werte[f.key] = f.vorbelegung(profil)
  }
  return werte
}

// Lädt/speichert die Antworten eines Bedarfschecks (per Kategorie) und leitet
// das Ergebnis bei jedem Rendern frisch aus den Antworten + Profil ab, damit
// Regelverbesserungen rückwirkend greifen.
export function useBedarf(kategorieId: string) {
  const { profile } = useProfile()
  const [gespeichert, setGespeichert] = useState<Gespeichert | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    void bedarfStore.getItem<Gespeichert>(kategorieId).then(g => {
      if (active) {
        setGespeichert(g ?? null)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [kategorieId])

  const speichern = useCallback(async (neu: Record<string, string>) => {
    const eintrag: Gespeichert = {
      antworten: neu,
      stand: new Date().toISOString(),
      profilStand: profilVorbelegungen(kategorieId, profile),
    }
    await bedarfStore.setItem<Gespeichert>(kategorieId, eintrag)
    setGespeichert(eintrag)
  }, [kategorieId, profile])

  const zuruecksetzen = useCallback(async () => {
    await bedarfStore.removeItem(kategorieId)
    setGespeichert(null)
  }, [kategorieId])

  const antworten = gespeichert?.antworten ?? null
  const check = bedarfsCheck(kategorieId)
  const ergebnis: BedarfsErgebnis | null = antworten && check ? check.auswerten(antworten, profile) : null

  // „Passt nicht mehr": eine Profil-Antwort, die eine Vorbelegung speist,
  // weicht vom Snapshot zum Check-Zeitpunkt ab. Alte Einträge ohne Snapshot
  // lösen bewusst keinen Fehlalarm aus.
  let profilGeaendert = false
  if (gespeichert?.profilStand) {
    const aktuell = profilVorbelegungen(kategorieId, profile)
    profilGeaendert = Object.keys(gespeichert.profilStand).some(
      key => aktuell[key] !== gespeichert.profilStand![key]
    )
  }

  return { antworten, ergebnis, profilGeaendert, speichern, zuruecksetzen, loading }
}

// Für die Übersicht: welche Kategorien haben einen abgeschlossenen Check?
export function useBedarfUebersicht(kategorieIds: string[]) {
  const [status, setStatus] = useState<Record<string, boolean>>({})
  const signature = kategorieIds.join('|')

  useEffect(() => {
    let active = true
    const ids = signature ? signature.split('|') : []
    void (async () => {
      const map: Record<string, boolean> = {}
      for (const id of ids) map[id] = (await bedarfStore.getItem(id)) != null
      if (active) setStatus(map)
    })()
    return () => { active = false }
  }, [signature])

  return status
}

export type BedarfsUebersicht = { kategorieId: string; titel: string; ergebnis: BedarfsErgebnis }

// Alle abgeschlossenen Bedarfschecks samt frisch ausgewertetem Ergebnis –
// damit Klaro auf „brauche ich …?" das eigene Check-Ergebnis nennen kann.
export function useAlleBedarfsErgebnisse(): BedarfsUebersicht[] {
  const { profile } = useProfile()
  const [liste, setListe] = useState<BedarfsUebersicht[]>([])

  useEffect(() => {
    let active = true
    void (async () => {
      const ergebnisse: BedarfsUebersicht[] = []
      for (const check of Object.values(bedarfsChecks)) {
        const g = await bedarfStore.getItem<Gespeichert>(check.kategorieId)
        if (!g?.antworten) continue
        ergebnisse.push({
          kategorieId: check.kategorieId,
          titel: check.titel,
          ergebnis: check.auswerten(g.antworten, profile),
        })
      }
      if (active) setListe(ergebnisse)
    })()
    return () => { active = false }
  }, [profile])

  return liste
}
