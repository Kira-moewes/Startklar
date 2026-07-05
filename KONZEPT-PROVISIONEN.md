# Startklar – Konzept Runde 3: Provisions-Partner & Monetarisierung (vollständige Planung)

> Stand: Juli 2026. Code-fertige Spezifikation: Nach diesem Dokument muss nur
> noch programmiert werden (plus die unter §8 gelisteten organisatorischen
> To-dos, die nur Kira erledigen kann: Gewerbeanmeldung, Netzwerk-Accounts).
> Provisionsangaben sind recherchierte Richtwerte (Quellen in §9) – die exakten
> Sätze stehen erst nach Freischaltung im jeweiligen Netzwerk fest.

---

## 1. Kritische Prüfung der Ideen (Tabelle von Kira)

| Idee | Bewertung | Ergebnis |
|---|---|---|
| **Girokonto**: comdirect, Tarifcheck, ING, C24, DKB | ✅ Gut. Alle über Affiliate-Netzwerke verfügbar (financeAds, Awin, Tarifcheck-eigenes Programm). C24 zahlt ~50 €/Konto, Tarifcheck ~40 €, ING läuft über Tarifcheck/financeAds. | Übernommen. Partner-Slot: **C24 Bank (~50 €)**; provisionsfrei: Trade Republic (kein klassisches Partnerprogramm). |
| **Steuererklärung**: WISO, Taxfix, Steuerbot | ✅ Sehr gut – hohe Relevanz für die Zielgruppe („erste Steuererklärung"). Taxfix ~23 €/Lead, WISO ~15 €/Abschluss (Awin), Steuerbot ~10 €/abgegebener Erklärung (eigenes Programm). Es fehlt aber eine **Vergleichskategorie „Steuer-Software"** in der App → wird neu angelegt. | Übernommen + erweitert. Partner-Slot: **Taxfix (~23 €)**; provisionsfrei: **ELSTER** (staatlich, kostenlos). |
| **Lohnabrechnung**: kein Affiliate, eigener Content | ✅ Richtig erkannt. Es gibt kein sinnvolles Partnerprodukt; die Aufgabe `finanzen:lohnabrechnung` bleibt reiner Content. | Übernommen (kein Änderungsbedarf). |
| **Haftpflicht**: Verivox, Tarifcheck | ⚠️ Gut, aber **rechtlich heikel**: Bei Versicherungen ist nur das „Tippgeber"-Modell erlaubnisfrei (§ 34d GewO). Unser aktueller **In-App-Checkout für Versicherungen muss weg** – erlaubt ist nur die klar gekennzeichnete Weiterleitung auf das fremde Portal (Details §3). Tarifcheck zahlt für Versicherungen bis ~100 €/Abschluss, Verivox im Schnitt ~20–55 €. | Übernommen mit Umbau. Partner-Slot: **Tarifcheck (bis ~100 €)** als externer Partner-Link; provisionsfrei: HUK24-Direktlink. |
| **SCHUFA**: meineSCHUFA | ❌ **Abgelehnt, Alternative eingesetzt.** meineSCHUFA zahlt zwar ~15 €/Sale, ist aber ein **kostenpflichtiges Abo** (~4–6 €/Monat) für etwas, das es gleichwertig kostenlos gibt (bonify, DSGVO-Datenkopie nach Art. 15). Einer jungen Zielgruppe ein Abo zu verkaufen, nur weil die Provision höher ist, zerstört das Vertrauen und kollidiert mit unserer Qualitätsregel (§2). | Ersetzt. Partner-Slot: **bonify (~5 €, für Nutzer:innen kostenlos)**; provisionsfrei: **DSGVO-Datenkopie** direkt bei der SCHUFA. |
| **Depot**: comdirect, Scalable, finanzen.net zero, Consorsbank | ✅ Gut. comdirect zahlt mit ~140 €/Depot die höchste Provision (financeAds), Consorsbank ~80 €, Scalable ~25–50 €. finanzen.net zero hat kein relevantes Partnerprogramm → wird provisionsfreie Alternative. Achtung: **keine konkrete Anlageberatung** in den Texten (bleibt Bildungs-Content, wie bisher). | Übernommen. Partner-Slot: **comdirect (~140 €)**; provisionsfrei: finanzen.net zero / Trade Republic. |
| **Altersvorsorge**: Verivox, Tarifcheck | ⚠️ Nur eingeschränkt. Private Renten sind Versicherungsprodukte → gleiche § 34d-Einschränkung wie Haftpflicht (nur Tippgeber-Link). Zusätzlich inhaltlich sensibel: Die App verspricht bisher „keine Anlageempfehlung". | Übernommen als reiner Tippgeber-Link + eigener Erklär-Content. Provisionsfrei: Renteninformation der Deutschen Rentenversicherung. |
| **Finanzwissen**: eigener Video-Content | ✅ Gut, wird zum eigenen Modul „Lernen" ausgebaut (§5.6) – bewusst provisionsfrei, zahlt aufs Vertrauen ein. | Übernommen + ausgebaut. |

**Kritik an der Grundregel „Der Anbieter mit der besten Provision wird genommen":**
So wörtlich ist die Regel gefährlich (siehe SCHUFA-Fall) und wettbewerbsrechtlich
angreifbar, wenn die Sortierung verdeckt provisionsgetrieben ist. Vorschlag –
übernimmt deine Idee, macht sie aber wasserdicht (§2): Provision entscheidet
**erst nach** einem redaktionellen Mindest-Check, und die provisionsfreie
Alternative steht gleichberechtigt daneben. Damit bleibt dein Modell erhalten
(bestbezahlter geeigneter Partner + kostenlose Alternative), ist aber
begründbar und abmahnsicher.

---

## 2. Auswahlregel („Slot-Modell") – verbindlich für alle Kategorien

Jede Vergleichskategorie zeigt künftig genau diese Struktur:

1. **Partner-Slot** (max. 2 Angebote): Anbieter mit der **höchsten Provision**
   unter allen, die den redaktionellen Mindest-Check bestehen. Deutlich
   gekennzeichnet: Badge **„Anzeige · Partner-Link"**.
2. **Provisionsfreier Slot** (min. 1 Angebot): redaktionelle Empfehlung ohne
   jede Vergütung. Badge **„Ohne Provision empfohlen"**.
3. **Eigene Angebote** (Bestandsfeature, unverändert).

**Redaktioneller Mindest-Check** (alle 5 müssen erfüllt sein, sonst fliegt der
Anbieter unabhängig von der Provision raus – dokumentiert pro Angebot im Feld
`qualitaetsCheck`):

- [ ] Produkt ist für 18-Jährige ohne Vermögen sinnvoll nutzbar
- [ ] Kein Abo/Kostenfalle, wenn es eine gleichwertige kostenlose Lösung gibt
- [ ] Transparente Kosten auf der Zielseite
- [ ] Seriöser Anbieter (BaFin-reguliert bzw. etabliert, kein Graumarkt)
- [ ] Kündigung/Ausstieg ist einfach möglich

**Sortierung:** Partner-Slot zuerst ist zulässig, weil er als Anzeige
gekennzeichnet ist; innerhalb der Slots wird nie nach Provision sortiert
angezeigt („Reihenfolge redaktionell" im Provisions-Popover erklärt).

---

## 3. Rechtliche Prüfung (Ergebnis der Recherche)

### 3.1 Grundsätzliches (gilt für alles)
- **Gewerbeanmeldung** (§ 14 GewO) ist Pflicht, sobald Provisionen fließen – auch als Tippgeberin. *(To-do Kira, §8)*
- **Kennzeichnungspflicht** (§ 5a UWG, Medienstaatsvertrag): Kommerzielle Links müssen als **„Anzeige"/„Partner-Link"** erkennbar sein. Wird als festes UI-Element umgesetzt (§5.2), nie nur im Kleingedruckten.
- **Impressum & Datenschutzerklärung** müssen die kommerzielle Tätigkeit + Affiliate-Tracking nennen. Da wir nur ausgehende Links mit SubID nutzen (keine eigenen Tracking-Cookies), reicht ein Abschnitt in der Datenschutzerklärung; Consent-Banner bleibt unnötig.
- **Netzwerk-AGB**: Awin, financeAds und das Tarifcheck-Programm nehmen Websites/Apps nach Prüfung auf; jedes Merchant-Programm muss einzeln beantragt werden und kann ablehnen → deshalb hat jede Kategorie einen definierten Fallback (provisionsfreier Slot bleibt immer bestehen).
- **Zielgruppe/Minderjährige**: Verträge (Konto, Versicherung, Depot) setzen Volljährigkeit voraus. Partner-Karten bekommen den Hinweis „ab 18"; bei Profil `volljaehrig: 'nein'` wird der Partner-Button ausgeblendet und nur der Info-Content gezeigt.

### 3.2 Versicherungen (Haftpflicht, Hausrat, Kfz, private Altersvorsorge) – **wichtigste Einschränkung**
- Erlaubnisfrei ist nur der **reine Tippgeber** (§ 34d GewO): Er „benennt Abschlussmöglichkeiten" und leitet weiter, ohne produktkonkrete Beratung und ohne eigene Abschlussstrecke.
- Rechtsprechung (BGH/OLG zu Vergleichsportalen): Wer einen **Vergleichsrechner mit Abschlussmöglichkeit** oder eine White-Label-Strecke anbietet, ist Vermittler und braucht die § 34d-Erlaubnis. Der Link muss klar erkennbar auf eine **fremde** Seite führen.
- **Konsequenz für Startklar:**
  1. Der In-App-Checkout (Runde 2) wird für **alle Versicherungskategorien deaktiviert** → Abschlussart `partnerlink` (externer, gekennzeichneter Link zu Tarifcheck/Verivox/Anbieter).
  2. Unsere Vergleichstabelle bleibt erlaubt, solange sie **redaktionelle Kriterien** zeigt und der Abschluss erkennbar extern passiert (kein Prämienrechner, keine Antragsdaten in der App).
  3. Die Tipps bleiben allgemein („Deckungssumme mind. 10 Mio. €"), keine individuelle Empfehlung („für dich ist Tarif X richtig").
- Langfristige Option (nicht Runde 3): § 34d-Erlaubnis oder Kooperation mit lizenziertem Makler, dann echter In-App-Abschluss.

### 3.3 Banken & Depot
- Affiliate-Links auf Kontoeröffnung/Depoteröffnung sind erlaubnisfreies Tippgeben; § 34f GewO (Finanzanlagenvermittlung) greift erst bei Vermittlung **konkreter Finanzanlagen** oder Anlageberatung.
- **Konsequenz:** Depot-Kategorie verlinkt nur auf die Depoteröffnung; unsere Texte bleiben produktneutral („breit gestreuter Welt-ETF" ist als allgemeine Bildungsaussage ok, keine ETF-Namensempfehlung).
- In-App-Checkout auch hier auf `partnerlink` umstellen: Kontoeröffnung erfordert ohnehin Ident-Verfahren beim Anbieter; unsere 3-Schritte-Strecke bleibt nur dort aktiv, wo es künftig eine echte API-Partnerschaft gibt (`abschluss: 'app'` bleibt im Datenmodell erhalten, wird aber vorerst nicht belegt).

### 3.4 Steuer-Software, SCHUFA/bonify, Strom, Internet, Handy
- **Unkritisch**: Software-/Dienstvermittlung ohne Erlaubnispflicht. Strom-/DSL-Wechsel über Verivox/Tarifcheck ist reguläres Affiliate-Geschäft.
- Kennzeichnung + Gewerbe reichen.

---

## 4. Partner-Matrix (Ergebnis Recherche 07/2026)

Legende: 🅟 = Partner-Slot (beste Provision nach Qualitäts-Check), 🄵 = provisionsfreier Slot.

| Kategorie | 🅟 Partner | Netzwerk | Provision ca. | 🄵 Ohne Provision | Rechtsform |
|---|---|---|---|---|---|
| **Girokonto** | C24 Bank | financeAds/CHECK24 | ~50 €/Konto | Trade Republic | Tippgeber-Link |
| Girokonto (Backup) | Tarifcheck Girokonto-Vergleich (ING, 1822 …) | Tarifcheck | ~40 €/Konto | – | Tippgeber-Link |
| **Steuer-Software** *(neu)* | Taxfix | Awin/direkt | ~23 €/Lead | ELSTER (staatlich) | Software-Affiliate |
| Steuer (weitere) | WISO Steuer ~15 €, Steuerbot ~10 € | Awin / direkt | s. links | – | Software-Affiliate |
| **SCHUFA & Bonität** *(neu)* | bonify (kostenlos) | financeAds | ~5 €/Registrierung | DSGVO-Datenkopie (Art. 15) | Affiliate |
| **Depot** | comdirect | financeAds | ~140 €/Depot | finanzen.net zero, Trade Republic | Tippgeber-Link |
| Depot (Backup) | Consorsbank ~80 €, Scalable ~25–50 € | financeAds | s. links | – | Tippgeber-Link |
| **Haftpflicht** | Tarifcheck Versicherungsvergleich | Tarifcheck | bis ~100 €/Abschluss | HUK24 (Direktlink) | **Nur Tippgeber-Link (§ 34d)** |
| **Hausrat** | Tarifcheck/Verivox | Tarifcheck/Awin | ~20–55 € | HUK24 (Direktlink) | **Nur Tippgeber-Link (§ 34d)** |
| **Kfz-Versicherung** | Tarifcheck Kfz | Tarifcheck | ~10–20 €/Vergleich, mehr bei Abschluss | HUK24 (Direktlink) | **Nur Tippgeber-Link (§ 34d)** |
| **Altersvorsorge** *(neu, Info-lastig)* | Verivox Rente | Awin | produktabhängig | Renteninformation (DRV) | **Nur Tippgeber-Link (§ 34d)** + eigener Content |
| **Strom** | Verivox Strom | Awin | ~20 €/Wechsel | Tibber, Ostrom (bestehend) | Affiliate |
| **Internet** | Verivox DSL / Tarifcheck DSL | Awin/Tarifcheck | ~30–55 €/Abschluss | congstar (Direktlink) | Affiliate |
| **Handy** | Tarifcheck Handytarife | Tarifcheck | produktabhängig | fraenk (Direktlink) | Affiliate |
| **Lohnabrechnung** | – (bewusst kein Partner) | – | – | eigener Content | – |
| **Finanzwissen/Lernen** | – (bewusst kein Partner) | – | – | eigene Guides/Videos | – |

Erwartungswert (konservativ, zur Einordnung): Bei nur 30 vermittelten
Abschlüssen/Monat quer über die Kategorien sind ~1.000–1.500 €/Monat
realistisch; Depot- und Versicherungsabschlüsse tragen am meisten.

---

## 5. Produkt- & Technik-Spezifikation

### 5.1 Datenmodell (`src/data/anbieter.ts` erweitern)

```ts
export type AnbieterAngebot = {
  // ... bestehende Felder bleiben ...
  abschluss: 'app' | 'extern' | 'partnerlink'   // NEU: 'partnerlink'
  monetarisierung: 'partner' | 'provisionsfrei' // Slot-Zuordnung (§2)
  partnerNetzwerk?: 'awin' | 'financeads' | 'tarifcheck' | 'direkt'
  provisionCa?: string        // '~50 € pro Konto' – nur intern/Transparenzseite
  affiliateUrl?: string       // Deep-Link inkl. SubID-Platzhalter {SUBID}
  ab18?: boolean              // Partner-Button bei volljaehrig==='nein' ausblenden
  qualitaetsCheck?: string    // Datum des redaktionellen Mindest-Checks (§2)
}

// SubID-Helfer: affiliateUrl.replace('{SUBID}', `startklar-${kategorieId}`)
export function partnerUrl(a: AnbieterAngebot, kategorieId: string): string
```

- Kein eigenes Cookie-/Klick-Tracking; die SubID identifiziert nur die Kategorie (aggregierte Auswertung im Netzwerk-Dashboard), keine Nutzerdaten.
- Neue Kategorien in `vergleich.ts`: `steuer` (Kriterien: Preis pro Erklärung, geführter Modus, Fotoerfassung Lohnsteuerbescheinigung, Erstattungs-Schätzung, Notizen), `schufa` (Kosten, Umfang der Auskunft, Aktualisierung, Notizen), `altersvorsorge` (Info-Kategorie: Kostenquote, Flexibilität, staatliche Förderung, Notizen).
- Neue Task-Verknüpfungen (`vergleichFuerTask`): `finanzen:steuererklaerung → steuer`, `finanzen:schufa → schufa`, `finanzen:altersvorsorge → altersvorsorge`.

### 5.2 UI: Kennzeichnung & Slots (`VergleichDetail.tsx`)

- Partner-Karten: Badge **„Anzeige · Partner-Link"** (Pill, `bg-coral text-white`, immer sichtbar oben auf der Karte) + Button **„Zum Partner-Angebot ↗"** (`rel="sponsored noopener"`, `target="_blank"`, `partnerUrl()`).
- Provisionsfreie Karten: Badge **„Ohne Provision empfohlen"** (`bg-pine text-cream`).
- Info-Popover „Wie verdient Startklar Geld?" (ⓘ neben der Abschnittsüberschrift) → 3 Sätze + Link auf `/transparenz` (§5.5).
- Versicherungskategorien (`haftpflicht`, `hausrat`, `kfz`, `altersvorsorge`): **kein** „Über Startklar abschließen"-Button mehr; Checkout-Route leitet für diese Kategorien auf die Detailseite zurück (Guard in `Checkout.tsx`).
- `ab18`-Angebote: bei `profile.volljaehrig === 'nein'` wird statt des Buttons der Hinweis „Ab 18 – schau dir solange die Kriterien an" gezeigt.

### 5.3 Partner-Link-Flow ersetzt In-App-Checkout (Wallet bleibt sinnvoll)

Realität im Affiliate-Modell: Der Abschluss passiert beim Partner, wir bekommen
kein Abschluss-Event. Der Flow wird deshalb umgebaut:

1. Klick auf „Zum Partner-Angebot ↗" öffnet den Partner in neuem Tab **und**
   legt lokal einen `AbschlussVormerkung`-Eintrag an (Store `wallet`, Status
   `angeklickt`, mit Kategorie + Anbieter + Datum).
2. Beim nächsten App-Besuch (oder sofort auf der Seite) erscheint eine dezente
   Nachfrage-Karte: **„Hast du bei {Anbieter} abgeschlossen?"** →
   „Ja" → Status `selbst_bestaetigt`, löst die bekannte Automatik aus
   (Dokument-Upload-Aufforderung statt Auto-Dokument, Termin-Vorschlag
   „alten Vertrag kündigen", Aufgabe-erledigt-Vorschlag) ·
   „Nein/ansehen" → Vormerkung wird nach 30 Tagen still gelöscht.
3. Wallet zeigt Vormerkungen und bestätigte Abschlüsse getrennt
   (`status: 'angeklickt' | 'selbst_bestaetigt' | 'aktiv' | 'gekuendigt'`).
4. Der bestehende 3-Schritte-Checkout bleibt im Code für `abschluss: 'app'`
   (künftige API-Partner), wird in Runde 3 aber von keinem Angebot genutzt.

### 5.4 Datenmodell-Migration Wallet

`Abschluss.status` bekommt die neuen Werte; bestehende Einträge (`eingereicht`)
werden beim Laden auf `selbst_bestaetigt` gemappt (einmalige, verlustfreie
Lese-Migration im Hook – keine Store-Änderung nötig).

### 5.5 Neue Seite `/transparenz`

- Inhalt: das Slot-Modell in Nutzersprache, Tabelle „Womit Startklar verdient"
  (Kategorie → Partner → „Provision: ja/nein", ohne Beträge), der
  Qualitäts-Check aus §2 als Checkliste, Hinweis auf provisionsfreie
  Alternativen in jeder Kategorie.
- Verlinkt aus: Provisionshinweis unter den Angebotskarten, Footer, Popover (§5.2).
- Rechtlicher Nebeneffekt: dokumentierte Transparenz (UWG).

### 5.6 Neues Modul „Lernen" (`/lernen`) – eigener Content statt Affiliate

- `src/data/lernen.ts`: `LernArtikel { id, titel, themaId, minuten, inhalt: string[] (Absätze), videoUrl?: string }`.
- Startinhalte (je 3–5 Absätze, eigener Text): „Deine erste Lohnabrechnung
  lesen", „Was ist die SCHUFA wirklich?", „ETF in 3 Minuten", „Brutto, Netto,
  Steuerklasse", „Wie Vergleichsportale Geld verdienen (und wir auch)".
- Seite `/lernen` (Karten-Grid nach Thema) + `/lernen/:artikelId`; Videos als
  Platzhalter-Feld (Kira produziert Content später, Feld ist optional).
- Dashboard-Widget „Wusstest du?" (rotierender Lern-Teaser) – ersetzt keine
  bestehende Kachel, füllt die freie Fläche neben „Zuletzt erledigt".
- Deep-Links: `finanzen:lohnabrechnung` und `finanzen:depot-etf` verlinken auf
  passende Lern-Artikel (neues optionales Task-Feld `lernArtikel?: string[]`).

### 5.7 Eigene Ideen (übernommen in den Plan)

1. **Jahres-Check-Erinnerung**: Nach bestätigtem Strom-/Internet-/Kfz-Abschluss
   bietet die Bestätigungskarte „⏰ In 11 Monaten erinnern: Preis checken" an
   (legt Termin an). Wiederkehrende Wechsel = wiederkehrende Provision, und
   nützlich für Nutzer:innen.
2. **Bundles an Lebensereignissen**: Auf der Bestätigungs-/Themenseite
   kontextuelle Querverweise („Zur ersten Wohnung gehören auch: Haftpflicht →,
   Strom →") – rein interne Links auf unsere Kategorien, keine zusätzliche
   Werbefläche.
3. **Boni-Zähler im Dashboard**: Kachel „Neukunden-Boni mitgenommen: ~X €"
   (Summe der `bonusFuerNutzer`-Werte bestätigter Abschlüsse; neues optionales
   Feld am Angebot, z. B. ING 200 €-Aktion). Motiviert, wirkt nutzerseitig.
4. **Programm-Fallback**: Jede Kategorie funktioniert vollständig ohne
   Partner (provisionsfreier Slot + eigene Angebote) – wenn ein Netzwerk uns
   ablehnt oder ein Programm pausiert, wird nur `monetarisierung: 'partner'`
   entfernt; kein UI bricht.

---

## 6. Umsetzungsreihenfolge (Code-Runde 4)

1. **Datenmodell + Daten**: `anbieter.ts` erweitern (Felder §5.1, Partner-Matrix §4 einpflegen inkl. `affiliateUrl`-Platzhalter `#PROGRAMM-NOCH-NICHT-FREIGESCHALTET`, bis die echten Deep-Links aus den Netzwerken vorliegen), neue Kategorien `steuer`/`schufa`/`altersvorsorge` in `vergleich.ts`, `vergleichFuerTask` ergänzen.
2. **UI-Kennzeichnung**: Badges, Popover, `partnerlink`-Button, Versicherungs-Guard im Checkout, `ab18`-Logik.
3. **Partner-Link-Flow**: Vormerkung + „Hast du abgeschlossen?"-Karte + Wallet-Status-Migration (§5.3/5.4).
4. **/transparenz** (§5.5) + Footer-Link + Datenschutz-/Impressum-Absätze.
5. **/lernen** (§5.6) mit 5 Start-Artikeln + Dashboard-Teaser + Task-Verlinkung.
6. **Ideen §5.7**: Jahres-Check, Bundles, Boni-Zähler.
7. README/KONZEPT aktualisieren; E2E-Suite erweitern (Checks: Badge sichtbar, Versicherung ohne In-App-Checkout, rel="sponsored", ab18-Ausblendung, Vormerkung → Nachfrage-Karte, Transparenzseite erreichbar, ELSTER/DSGVO-Alternativen vorhanden).

**Akzeptanzkriterien (Auszug):**
- [ ] Jede Kategorie zeigt ≥ 1 provisionsfreies Angebot; Partner-Angebote tragen sichtbar „Anzeige · Partner-Link".
- [ ] Keine Versicherungskategorie bietet einen In-App-Abschluss an.
- [ ] Alle Partner-Links: `rel="sponsored noopener"`, neuer Tab, SubID gesetzt.
- [ ] App voll funktionsfähig, wenn alle Partner entfernt werden (Fallback-Test).
- [ ] `volljaehrig: 'nein'` → keine Partner-Buttons.

## 7. Nicht-Ziele (bewusst nicht in Runde 3/4)

- Keine § 34d-Erlaubnis / kein eigener Versicherungs-Abschluss in der App.
- Kein eigenes Klick-Tracking, keine Cookies, kein Consent-Banner.
- Kein Prämien-/Tarifrechner (rechtlich = Vermittlung).
- meineSCHUFA wird nicht beworben (Qualitätsregel §2).

## 8. Organisatorische To-dos (nur Kira, vor Code-Merge nicht blockierend)

1. Gewerbe anmelden (§ 14 GewO, „Online-Portal/Affiliate-Marketing").
2. Publisher-Accounts: **Awin** (Verivox, Taxfix, WISO), **financeAds** (C24, comdirect, Consorsbank, DKB, Scalable, bonify), **Tarifcheck-Partnerprogramm** (Versicherungen, Girokonto, DSL, Handy), **Steuerbot direkt**.
3. Je Programm bewerben; nach Freischaltung echte Deep-Links + exakte Provisionssätze in `anbieter.ts` eintragen (Platzhalter suchen: `PROGRAMM-NOCH-NICHT-FREIGESCHALTET`).
4. Impressum um Gewerbe ergänzen; kurze steuerliche Beratung (Kleinunternehmerregelung ja/nein).
5. Später bei Wachstum: § 34d-Option mit Anwalt/IHK prüfen.

## 9. Quellen der Recherche (Stand 07/2026, vor Vertragsschluss verifizieren)

- Tarifcheck-Partnerprogramm: Provisionen (Girokonto ~40 €, Versicherung bis ~100 €) – tarifcheck-partnerprogramm.de
- financeAds: comdirect (~140 €/Sale), Consorsbank (~80 €), DKB, C24 (~50 €), Scalable (~25–50 €), bonify (~5 €), wundertax – financeads.net, affiliate-marketing.de, 100partnerprogramme.de
- Awin: Verivox (Strom ~20 €, Ø ~20–55 €), WISO Steuer (~15 €/Abschluss, Premium-Stufe ab 1.200 Abschlüssen/Jahr), Taxfix (~23 €/Lead)
- Steuerbot-Affiliate (direkt): ~10 €/abgegebener Erklärung – steuerbot.com/affiliate-programm
- meineSCHUFA-Partnerprogramm: ~15 €/Sale (Abo) – affiliate-marketing.de; kostenlose Alternativen: bonify.de, DSGVO-Datenkopie
- Rechtslage Tippgeber vs. Vermittler: § 34d GewO, BGH-/OLG-Rechtsprechung zu Vergleichsportalen (Vergleichsrechner + Abschlussmöglichkeit = erlaubnispflichtige Vermittlung; reine Weiterleitung auf erkennbar fremde Seite = erlaubnisfreier Tippgeber) – gesetze-im-internet.de, dr-bahr.com, procontra-online.de, IHK-Merkblätter
