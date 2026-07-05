import { useCallback, useEffect, useState } from 'react'
import localforage from 'localforage'

export type ZahlungsmittelTyp = 'sepa' | 'paypal' | 'karte'

export type Zahlungsmittel = {
  id: string
  typ: ZahlungsmittelTyp
  label: string // maskiert, z. B. 'SEPA · DE89 **** 3000'
  details: Record<string, string> // nur maskierte Werte
}

export type AbschlussStatus = 'eingereicht' | 'bestaetigt' | 'aktiv' | 'gekuendigt'

export type Abschluss = {
  id: string
  angebotId: string
  kategorieId: string
  anbieter: string
  datum: string // ISO yyyy-mm-dd
  status: AbschlussStatus
  zahlungsmittelId?: string
  dokumentId?: string
}

export type WalletEreignis = {
  id: string
  datum: string // ISO yyyy-mm-dd
  text: string
}

// Persönliche Daten für den Checkout ("Für nächstes Mal merken").
export type CheckoutDaten = {
  name?: string
  adresse?: string
  geburtsdatum?: string
}

const store = localforage.createInstance({ name: 'startklar', storeName: 'wallet' })
const K_ZAHLUNG = 'zahlungsmittel'
const K_ABSCHLUESSE = 'abschluesse'
const K_VERLAUF = 'verlauf'
const K_DATEN = 'checkout-daten'

const heute = () => new Date().toISOString().slice(0, 10)

export function maskiereIban(iban: string) {
  const sauber = iban.replaceAll(/\s+/g, '').toUpperCase()
  if (sauber.length < 8) return '****'
  return `${sauber.slice(0, 4)} **** ${sauber.slice(-4)}`
}

export function useWallet() {
  const [zahlungsmittel, setZahlungsmittel] = useState<Zahlungsmittel[]>([])
  const [abschluesse, setAbschluesse] = useState<Abschluss[]>([])
  const [verlauf, setVerlauf] = useState<WalletEreignis[]>([])
  const [checkoutDaten, setCheckoutDaten] = useState<CheckoutDaten>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void Promise.all([
      store.getItem<Zahlungsmittel[]>(K_ZAHLUNG),
      store.getItem<Abschluss[]>(K_ABSCHLUESSE),
      store.getItem<WalletEreignis[]>(K_VERLAUF),
      store.getItem<CheckoutDaten>(K_DATEN),
    ]).then(([z, a, v, d]) => {
      if (!active) return
      setZahlungsmittel(z ?? [])
      setAbschluesse(a ?? [])
      setVerlauf(v ?? [])
      setCheckoutDaten(d ?? {})
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  const addZahlungsmittel = useCallback((z: Omit<Zahlungsmittel, 'id'>) => {
    const neu: Zahlungsmittel = { ...z, id: crypto.randomUUID() }
    setZahlungsmittel(prev => {
      const next = [...prev, neu]
      void store.setItem(K_ZAHLUNG, next)
      return next
    })
    return neu
  }, [])

  const removeZahlungsmittel = useCallback((id: string) => {
    setZahlungsmittel(prev => {
      const next = prev.filter(z => z.id !== id)
      void store.setItem(K_ZAHLUNG, next)
      return next
    })
  }, [])

  const addAbschluss = useCallback((a: Omit<Abschluss, 'id' | 'datum' | 'status'>) => {
    const neu: Abschluss = { ...a, id: crypto.randomUUID(), datum: heute(), status: 'eingereicht' }
    setAbschluesse(prev => {
      const next = [...prev, neu]
      void store.setItem(K_ABSCHLUESSE, next)
      return next
    })
    const ereignis: WalletEreignis = {
      id: crypto.randomUUID(),
      datum: heute(),
      text: `Abschluss eingereicht: ${a.anbieter}`,
    }
    setVerlauf(prev => {
      const next = [ereignis, ...prev]
      void store.setItem(K_VERLAUF, next)
      return next
    })
    return neu
  }, [])

  const speichereCheckoutDaten = useCallback((d: CheckoutDaten) => {
    setCheckoutDaten(d)
    void store.setItem(K_DATEN, d)
  }, [])

  return {
    zahlungsmittel,
    abschluesse,
    verlauf,
    checkoutDaten,
    addZahlungsmittel,
    removeZahlungsmittel,
    addAbschluss,
    speichereCheckoutDaten,
    loading,
  }
}
