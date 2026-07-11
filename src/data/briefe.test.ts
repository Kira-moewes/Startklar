import { describe, expect, it } from 'vitest'
import { briefarten, briefart, findeBriefarten, krisenhilfen } from './briefe'

describe('Brief-Entschlüsseler – Inhalts-Vollständigkeit', () => {
  it('jede Briefart hat alle Pflichtfelder gefüllt', () => {
    for (const b of briefarten) {
      expect(b.id, 'id').toBeTruthy()
      expect(b.titel, `titel (${b.id})`).toBeTruthy()
      expect(b.stichworte.length, `stichworte (${b.id})`).toBeGreaterThan(0)
      expect(b.einordnung.length, `einordnung (${b.id})`).toBeGreaterThan(20)
      expect(b.frist, `frist (${b.id})`).toBeTruthy()
      expect(b.ersterSchritt, `ersterSchritt (${b.id})`).toBeTruthy()
      // Neu (r7 Kap. 2.4 + 4b.2): jeder Brief braucht den schamfreien
      // Zu-spät-Zweig und ein wörtliches Allein-Skript.
      expect(b.zuSpaet.length, `zuSpaet (${b.id})`).toBeGreaterThan(20)
      expect(b.alleinSkript.length, `alleinSkript (${b.id})`).toBeGreaterThan(20)
      expect(b.quest.journeyId, `quest.journeyId (${b.id})`).toBeTruthy()
      expect(b.quest.taskId, `quest.taskId (${b.id})`).toBeTruthy()
    }
  })

  it('hat eindeutige IDs', () => {
    const ids = briefarten.map(b => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('findeBriefarten', () => {
  it('gibt ohne Suche alle Briefe zurück', () => {
    expect(findeBriefarten('')).toHaveLength(briefarten.length)
    expect(findeBriefarten('   ')).toHaveLength(briefarten.length)
  })

  it('findet per Stichwort (klein-/großgeschrieben)', () => {
    expect(findeBriefarten('GEZ').map(b => b.id)).toContain('rundfunkbeitrag')
    expect(findeBriefarten('kaution').map(b => b.id)).toContain('mietvertrag-kaution')
    expect(findeBriefarten('zähler').map(b => b.id)).toContain('strom-grundversorgung')
  })

  it('findet per Titel-Teilstring', () => {
    expect(findeBriefarten('Nebenkosten').map(b => b.id)).toContain('nebenkostenabrechnung')
  })

  it('gibt bei Unbekanntem eine leere Liste zurück', () => {
    expect(findeBriefarten('völligerunsinnxyz')).toHaveLength(0)
  })
})

describe('briefart(id)', () => {
  it('findet einen bekannten Brief und meldet Unbekanntes als undefined', () => {
    expect(briefart('rundfunkbeitrag')?.titel).toBeTruthy()
    expect(briefart('gibtsnicht')).toBeUndefined()
  })
})

describe('Krisenhilfen', () => {
  it('bietet mindestens eine echte, kontaktierbare Hilfe', () => {
    expect(krisenhilfen.length).toBeGreaterThan(0)
    for (const h of krisenhilfen) {
      expect(h.titel).toBeTruthy()
      expect(h.kontakt).toBeTruthy()
      expect(h.hinweis).toBeTruthy()
    }
  })
})
