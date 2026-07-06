// Lern-Modul: eigener, provisionsfreier Content (KONZEPT-PROVISIONEN.md §5.6).
// `videoUrl` bleibt leer, bis Kira eigene Videos produziert hat.

export type LernArtikel = {
  id: string
  titel: string
  teaser: string
  themaId: string // referenziert themen.ts
  minuten: number
  inhalt: string[] // Absätze
  videoUrl?: string
}

export const lernArtikel: LernArtikel[] = [
  {
    id: 'lohnabrechnung-lesen',
    titel: 'Deine erste Lohnabrechnung lesen',
    teaser: 'Brutto oben, viel weniger unten – wohin ist das Geld? In 3 Minuten verstehst du jede Zeile.',
    themaId: 'arbeit',
    minuten: 3,
    inhalt: [
      'Oben steht dein Bruttogehalt – das ist der Betrag aus deinem Vertrag. Unten steht das Netto: das, was wirklich auf dein Konto kommt. Dazwischen liegen Steuern und Sozialabgaben, und genau die schauen wir uns an.',
      'Die Lohnsteuer richtet sich nach deinem Einkommen und deiner Steuerklasse (als Single meist Klasse I). Bei kleinen Gehältern – etwa in der Ausbildung – fällt oft gar keine oder sehr wenig Lohnsteuer an.',
      'Die Sozialversicherungen sind vier Posten: Rentenversicherung (dein späterer Rentenanspruch), Krankenversicherung, Pflegeversicherung und Arbeitslosenversicherung. Zusammen sind das grob 20 % vom Brutto – dein Arbeitgeber zahlt noch einmal ungefähr genauso viel obendrauf.',
      'Prüfen lohnt sich: Stimmen Steuerklasse, Krankenkasse und deine Adresse? Fehler passieren, gerade beim ersten Job. Und heb jede Abrechnung auf – am besten im Dokumente-Bereich von Startklar, Ordner „Arbeit & Ausbildung".',
      'Übrigens: Wer Lohnsteuer gezahlt hat, bekommt mit einer Steuererklärung oft einen Teil zurück – wie das geht, steht in der Aufgabe „Steuererklärung" und im Vergleich „Steuer-Software".',
    ],
  },
  {
    id: 'schufa-verstehen',
    titel: 'Was ist die SCHUFA wirklich?',
    teaser: 'Kein Grund für Mythen: Was die SCHUFA speichert, wer reinschaut – und wie du kostenlos an deine Daten kommst.',
    themaId: 'finanzen',
    minuten: 3,
    inhalt: [
      'Die SCHUFA ist eine Auskunftei: ein Unternehmen, das speichert, wie zuverlässig Menschen Verträge und Rechnungen bezahlen. Banken, Vermieter und Mobilfunkanbieter fragen dort an, bevor sie dir einen Vertrag geben.',
      'Gespeichert werden vor allem: deine Konten und Kreditkarten, Handyverträge, Kredite – und ob es Zahlungsausfälle gab. NICHT gespeichert werden Gehalt, Vermögen, Beruf oder Religion.',
      'Aus den Daten berechnet die SCHUFA einen Score. Ein guter Score öffnet Türen (Wohnung, Kredit, Handyvertrag ohne Anzahlung); Negativeinträge entstehen erst nach mehreren Mahnungen – eine vergessene Rechnung ruiniert dich nicht sofort.',
      'Deine Daten bekommst du kostenlos: die vollständige Datenkopie nach Art. 15 DSGVO (per Post) oder den Score digital über kostenlose Dienste wie bonify. Ein bezahltes SCHUFA-Abo brauchst du als Berufseinsteiger:in praktisch nie.',
      'Vor der Wohnungssuche: Auskunft besorgen, auf Fehler prüfen (falsche Einträge kannst du korrigieren lassen) – und im Dokumente-Bereich ablegen, dann hast du sie bei Besichtigungen parat.',
    ],
  },
  {
    id: 'etf-in-3-minuten',
    titel: 'ETF in 3 Minuten',
    teaser: 'Was ein ETF ist, warum alle davon reden – und was „breit gestreut" wirklich bedeutet. Ohne Produktwerbung.',
    themaId: 'finanzen',
    minuten: 3,
    inhalt: [
      'Ein ETF (Exchange Traded Fund) ist ein Korb aus vielen Aktien, den du an der Börse kaufen kannst. Statt eine einzelne Firma zu kaufen, kaufst du mit einem Klick winzige Anteile an hunderten oder tausenden Firmen gleichzeitig.',
      'Der Punkt daran ist Streuung: Geht eine Firma pleite, merkst du das kaum, weil die anderen den Verlust auffangen. Ein „Welt-ETF" verteilt dein Geld über viele Länder und Branchen – das ist mit „breit gestreut" gemeint.',
      'ETFs sind günstig, weil kein Manager bezahlt werden muss: Der Fonds bildet stur einen Index nach (z. B. die 1.600 größten Firmen der Welt). Die laufenden Kosten liegen oft unter 0,3 % pro Jahr.',
      'Wichtig zu wissen: Kurse schwanken. Ein ETF ist nichts für Geld, das du nächstes Jahr brauchst – sondern für Geld, das 10+ Jahre liegen bleiben kann. Dafür war ein breit gestreutes Weltportfolio historisch über lange Zeiträume im Plus.',
      'Startklar verkauft dir nichts und empfiehlt keine konkreten Produkte. Wenn du loslegen willst: Im Vergleich „Depot & ETF-Sparplan" siehst du, worauf es bei den Kosten ankommt – Sparpläne gehen oft schon ab 1 € im Monat.',
    ],
  },
  {
    id: 'brutto-netto-steuerklasse',
    titel: 'Brutto, Netto, Steuerklasse – das Einmaleins',
    teaser: 'Die drei Begriffe, die bei jedem Job-Gespräch fallen – einmal richtig erklärt, nie wieder nicken ohne Plan.',
    themaId: 'finanzen',
    minuten: 2,
    inhalt: [
      'Brutto ist das Gehalt, das im Vertrag steht. Netto ist, was nach Steuern und Sozialabgaben auf deinem Konto landet. Als grobe Faustregel für Berufseinsteiger:innen: Netto ist ungefähr 60–80 % vom Brutto – je kleiner das Gehalt, desto größer der Anteil, der dir bleibt.',
      'Die Steuerklasse bestimmt nur, wie viel Lohnsteuer dir monatlich vorab abgezogen wird – nicht, wie viel Steuern du am Ende wirklich zahlst. Als lediger Berufseinsteiger bist du automatisch in Klasse I; ein Minijob läuft meist über Klasse VI oder pauschal.',
      'Zu viel vorab gezahlt? Das holst du dir mit der Steuererklärung zurück. Gerade im ersten Berufsjahr (Fahrtkosten, Bewerbungskosten, Umzug) gibt es oft ein paar hundert Euro – im Schnitt über 1.000 €.',
      'Merksatz: Brutto vergleichen bei Jobangeboten, Netto planen beim Budget. Ein Brutto-Netto-Rechner (z. B. vom BMF) zeigt dir in 30 Sekunden, was von einem Angebot übrig bleibt.',
    ],
  },
  {
    id: 'wie-vergleichsportale-verdienen',
    titel: 'Wie Vergleichsportale Geld verdienen (und wir auch)',
    teaser: 'Check24, Verivox – und Startklar: Wer bezahlt hier eigentlich wen? Volle Offenheit in 2 Minuten.',
    themaId: 'finanzen',
    minuten: 2,
    inhalt: [
      'Vergleichsportale sind für dich kostenlos, weil der Anbieter zahlt: Schließt du über das Portal einen Strom-, Versicherungs- oder Kontovertrag ab, bekommt das Portal eine Vermittlungsprovision. Dein Preis ist derselbe, als würdest du direkt beim Anbieter abschließen.',
      'Das Modell ist legal und normal – aber es hat einen Haken: Manche Portale sortieren so, dass gut zahlende Anbieter weiter oben stehen. Deshalb lohnt der Blick auf die Sortier-Einstellung („nach Preis sortieren") und auf einen zweiten Vergleich.',
      'Startklar nutzt dasselbe Modell – mit zwei selbst auferlegten Regeln: Erstens ist jedes bezahlte Angebot als „Anzeige · Partner-Link" markiert. Zweitens zeigen wir in jeder Kategorie eine Empfehlung, an der wir nichts verdienen.',
      'Was wir nie machen: die Reihenfolge nach Provisionshöhe sortieren, kostenpflichtige Produkte pushen, wenn es kostenlose gibt, oder deine Daten verkaufen. Alle Details stehen auf unserer Transparenzseite.',
    ],
  },
]

export function artikel(id: string): LernArtikel | null {
  return lernArtikel.find(a => a.id === id) ?? null
}
