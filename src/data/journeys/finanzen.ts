import type { Journey } from '../types'

export const finanzenJourney: Journey = {
  id: 'finanzen',
  title: 'Finanzen',
  subtitle: 'Geld, Konto und ein ruhiger Überblick.',
  tasks: [
    {
      id: 'girokonto',
      title: 'Girokonto eröffnen / Jugendkonto umstellen',
      summary: 'Ein eigenes Konto macht viele Alltagssachen leichter — vom Gehalt bis zu Daueraufträgen.',
      steps: [
        'Vergleiche zwei bis drei Kontomodelle (Gebühren, App, Karte).',
        'Eröffne das neue Konto online oder in der Filiale.',
        'Richte Daueraufträge und Lastschriften um und schließe das alte Konto, wenn alles läuft.'
      ],
      deadline: 'Kein fester Termin',
      consequence: 'Wenn du es nicht machst, funktioniert zwar vieles weiter, aber du hast später mehr Aufwand beim Umstellen — das lässt sich nachholen.',
      category: 'finanzen'
    },
    {
      id: 'steuererklaerung',
      title: 'Steuererklärung – lohnt sie sich?',
      summary: 'Viele erhalten Geld zurück; prüfen lohnt sich oft.',
      steps: [
        'Sammle deine Lohnsteuerbescheinigung und Belege.',
        'Schätze kurz, ob sich eine Abgabe lohnt (Rückerstattung: {BETRAG_RUECKERSTATTUNG}).',
        'Lege ein ELSTER-Konto an und reiche die Erklärung online ein.'
      ],
      deadline: '{FRIST_STEUER}',
      consequence: 'Wenn du nicht prüfst, könntest du eine Rückerstattung verpassen — das ist unangenehm, aber du kannst die Abgabe in den meisten Fällen nachholen oder professionelle Hilfe nutzen.',
      category: 'finanzen',
      faktenKeys: ['FRIST_STEUER', 'BETRAG_RUECKERSTATTUNG'],
      hilfen: [{ label: 'ELSTER – Steuererklärung online', url: 'https://www.elster.de/' }]
    },
    {
      id: 'lohnabrechnung',
      title: 'Erstes Gehalt verstehen',
      summary: 'Brutto vs. Netto und die wichtigsten Abzüge kurz erklärt, damit du dein Gehalt einordnen kannst.',
      steps: [
        'Vergleiche oben den Bruttobetrag (vor Abzügen) mit dem Nettobetrag – das ist, was tatsächlich auf deinem Konto landet.',
        'Die wichtigsten Abzüge: Lohnsteuer (ggf. plus Kirchensteuer/Soli) und dein Anteil an der Sozialversicherung – Renten-, Kranken-, Pflege- und Arbeitslosenversicherung.',
        'Prüfe, ob Steuerklasse und Steuer-Identifikationsnummer stimmen – eine falsche Steuerklasse kostet dich sonst Monat für Monat Geld.',
        'Hebe die Abrechnungen auf (du brauchst sie z. B. für die Steuererklärung, Wohnungssuche oder einen Kredit). Bei Unklarheiten kurz in der Personalabteilung nachfragen.'
      ],
      deadline: 'Kurz nach der ersten Auszahlung',
      consequence: 'Wenn du nichts prüfst, bleibt das Einkommen gleich — du hast aber weniger Klarheit. Eine kurze Nachfrage beim Arbeitgeber klärt meist schnell alles.',
      category: 'arbeit'
    },
    {
      id: 'haftpflicht',
      title: 'Private Haftpflichtversicherung',
      summary: 'Eine Haftpflicht schützt vor hohen Kosten bei Schäden, die du anderen zufügst.',
      steps: [
        'Die Privathaftpflicht ist keine Pflicht, aber eine der wichtigsten Versicherungen: Sie zahlt, wenn du versehentlich anderen Menschen oder deren Sachen einen Schaden zufügst.',
        'Prüfe zuerst, ob du noch über deine Eltern mitversichert bist (oft bis zum Ende der ersten Ausbildung bzw. des Erststudiums) – dann brauchst du keine eigene.',
        'Wenn du eine eigene brauchst: auf eine hohe Deckungssumme und passende Bausteine (z. B. Schlüsselverlust) achten. Der Bedarfscheck und der neutrale Vergleich helfen dir dabei.',
        'Angebote in Ruhe vergleichen und den passenden Tarif abschließen – ein Wechsel ist später jederzeit möglich.'
      ],
      deadline: 'Vor dem Einzug bzw. bei Bedarf',
      consequence: 'Ohne Haftpflicht kannst du im Schadensfall selbst zahlen müssen — das ist belastend, aber oft lassen sich Lösungen finden; eine Versicherung reduziert dieses Risiko.',
      category: 'versicherung'
    },
    {
      id: 'schufa',
      title: 'Schufa: was ist das und wie schützt du deinen Score?',
      summary: 'Die Schufa beeinflusst viele Verträge — verstehen hilft, Fehler zu vermeiden.',
      steps: [
        'Informiere dich, was die Schufa erfasst.',
        'Fordere den kostenlosen Bericht an ({ANZAHL_SCHUFA_KOSTENLOS}).',
        'Prüfe Einträge und melde falsche Einträge zum Löschen.'
      ],
      deadline: 'Kein fester Termin',
      consequence: 'Wenn du es ignorierst, können Fehler später Mühe machen — meist lassen sich solche Probleme aber mit dem Anbieter oder der Schufa klären.',
      category: 'finanzen',
      faktenKeys: ['ANZAHL_SCHUFA_KOSTENLOS'],
      hilfen: [{ label: 'SCHUFA – kostenlose Datenkopie (Art. 15 DSGVO)', url: 'https://www.schufa.de/datenkopie/' }]
    },
    {
      id: 'depot-etf',
      title: 'Depot & ETF — eine einfache Erklärung',
      summary: 'Was ein Depot und ETFs grundsätzlich sind — ohne Anlageberatung.',
      steps: [
        'Ein Depot ist wie ein Konto, nur für Wertpapiere – du eröffnest es kostenlos bei einer Bank oder einem Online-Broker.',
        'Ein ETF ist ein Fonds, der einen ganzen Index nachbildet (z. B. viele große Firmen weltweit auf einmal), statt auf eine einzelne Aktie zu setzen – so verteilt sich das Risiko.',
        'Grundgedanke: langfristig und regelmäßig (Sparplan) statt kurzfristig zu raten. Kurse schwanken – Geld, das du bald brauchst, gehört nicht in Aktien oder ETFs.',
        'Wichtig: Das hier ist reine Erklärung, keine Anlageberatung – wir empfehlen kein Produkt und verdienen nichts daran.'
      ],
      deadline: 'Informativ',
      consequence: 'Wenn du das nicht liest, änderst du nichts an deinem Geld — das ist in Ordnung; bei Interesse kannst du dich später gezielt informieren.',
      category: 'finanzen'
    },
    {
      id: 'altersvorsorge',
      title: 'Altersvorsorge: erste Schritte',
      summary: 'Grundlagen zur gesetzlichen Rente und privaten Vorsorge, ohne Anlageempfehlungen.',
      steps: [
        'Die gesetzliche Rente ist die Basis, deckt später aber oft nicht den gewohnten Lebensstandard – diese Lücke schließt man mit zusätzlicher Vorsorge.',
        'Dein größter Vorteil ist Zeit: Wer früh und regelmäßig kleine Beträge zurücklegt, profitiert stark vom Zinseszinseffekt.',
        'Mögliche Bausteine sind z. B. ein ETF-Sparplan oder geförderte Modelle ({STATUS_ALTERSVORSORGEDEPOT}). Verschaff dir erst einen Überblick, bevor du etwas abschließt.',
        'Wichtig: keine Anlageberatung. Bei konkreten Produkten hilft eine unabhängige Beratung, z. B. bei der Verbraucherzentrale.'
      ],
      deadline: 'Langfristig planen',
      consequence: 'Wenn du nichts tust, ändert sich kurzfristig nichts; langfristig kann früheres Planen Vorteile bringen — du kannst jederzeit anfangen.',
      category: 'finanzen',
      faktenKeys: ['STATUS_ALTERSVORSORGEDEPOT']
    },
    {
      id: 'kindergeld-ab-18',
      title: 'Kindergeld ab 18: Nachweis einreichen',
      summary: 'Kindergeld endet nicht automatisch mit 18 — oft braucht die Familienkasse einen Nachweis für Ausbildung oder Studium.',
      steps: [
        'Prüfe bei der Familienkasse, welche Nachweise nötig sind.',
        'Sammle Bescheinigungen (Ausbildung, Studium, Arbeitslosmeldung).',
        'Reiche die Unterlagen ein, wenn sie angefordert werden.'
      ],
      deadline: 'Bei Bedarf',
      consequence: 'Wenn du es nicht klärst, kann die Zahlung gestoppt werden; meist lassen sich Nachweise aber nachreichen.',
      category: 'finanzen',
      faktenKeys: ['ALTER_KINDERGELD_MAX']
    },
    {
      id: 'haushaltsbudget',
      title: 'Erster Budget-Überblick',
      summary: 'Eine grobe Faustregel hilft, den Überblick zu behalten (z. B. {HAUSHALT_50_30_20}).',
      steps: [
        'Liste deine festen Ausgaben und Einnahmen auf.',
        'Grobe Einteilung nach der Faustregel prüfen ({HAUSHALT_50_30_20}).',
        'Passe das Budget in den ersten Monaten an.'
      ],
      deadline: 'Kurz nach Einnahmequelle',
      consequence: 'Wenn du kein Budget machst, behältst du oft den Status quo; eine einfache Übersicht bringt aber schnell mehr Ruhe.',
      category: 'finanzen',
      faktenKeys: ['HAUSHALT_50_30_20']
    }
  ]
}
