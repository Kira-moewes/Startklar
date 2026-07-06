# Startklar – Konzept Runde 5 (Kurzform)

**Thema:** Anbieter-Chips · Dokumenten-Ablage · Druck/PDF-Export
**Status:** Direkt mit der Umsetzung entstanden (Kurz-Doku statt Vorab-Planung)
**Stand:** Juli 2026

## Entscheidungen

1. **Angebote „direkt vorschlagen" = Anbieter-Chips, keine Live-Tarife.**
   Echte personalisierte Tarife bräuchten einen kommerziellen Datenpartner und
   i. d. R. eine Vermittler-Erlaubnis (§ 34d GewO) – bewusst verworfen (mit Kira
   geklärt). Stattdessen: Die Katalog-Anbieter aus Runde 4 erscheinen auf der
   Vergleichsseite als antippbare „+ Anbieter"-Buttons (alphabetisch, nur die,
   die noch nicht in der Tabelle stehen). Ein Tap = Spalte mit Richtwerten,
   gleicher Code-Pfad wie die Combobox (`addMitRichtwerten`).

2. **Dokumenten-Ablage lokal, als Base64.**
   Unterlagen (PDF/Bild, max. 4 MB, max. 10 pro Stelle) hängen an Aufgaben
   (`task:{journeyId}:{taskId}`) und Vergleichen (`vergleich:{kategorieId}`).
   Gespeichert wird eine Base64-Data-URL statt eines Blobs, weil der
   JSON-Datenexport (`datenExport.ts`) Blobs zu `{}` serialisieren und damit
   verlieren würde – Strings überstehen den Roundtrip. Der neue
   `dokumenteStore` ist in `alleStores` registriert → Export/Import/Löschen
   greifen automatisch. Profil zeigt die Speichernutzung
   (`navigator.storage.estimate()`).

3. **PDF-Export über den Browser-Druckdialog, keine Library.**
   `@media print` in `index.css` blendet Header/Footer/FAB und alle
   Bedienelemente (`.no-print`) aus; Tabellen-Inputs drucken als Text.
   „Drucken / PDF"-Buttons auf der Vergleichsseite und der
   Bedarfscheck-Ergebnisseite rufen `window.print()` auf.

## Neue/geänderte Dateien

```
src/data/dokumente.ts             – Typ Dokument, Bezugs-Keys, Limits
src/hooks/useDokumente.ts         – laden/ablegen/entfernen + oeffneDokument()
src/components/DokumenteSection.tsx – Karte „Deine Unterlagen"
src/lib/stores.ts                 – dokumenteStore (+ alleStores)
src/pages/VergleichDetail.tsx     – Chips, Druck-Button, no-print, Unterlagen
src/pages/TaskDetail.tsx          – Unterlagen-Sektion
src/pages/BedarfsCheck.tsx        – Druck-Button
src/pages/Profil.tsx              – Speicher-Zeile in „Deine Daten"
src/components/agent/AgentButton.tsx – no-print
src/index.css                     – @media print
src/data/agent/faq.ts             – 3 neue Klaro-FAQ
```

## Offene Punkte

- Speicher-Quota: Bei sehr vielen Fotos kann IndexedDB-Platz knapp werden;
  die Speicher-Zeile im Profil macht das sichtbar. Ein Aufräum-Hinweis bei
  > 80 % Belegung wäre ein Kandidat für später.
- Der Daten-Export wächst mit abgelegten Unterlagen (Base64 ≈ +33 % der
  Dateigröße) – bewusst akzeptiert, damit die Sicherung vollständig bleibt.
