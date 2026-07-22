import type { Journey } from '../types'

export const ersteWohnungJourney: Journey = {
  id: 'erste-wohnung',
  title: 'Erste Wohnung',
  subtitle: 'Wichtige Schritte, wenn du neu einziehst.',
  tasks: [
    {
      id: 'mietvertrag',
      title: 'Mietvertrag — worauf du achten solltest',
      summary: 'Der erste Mietvertrag ist ein wichtiges Dokument. Kenne die typischen Fallen, um später keine bösen Überraschungen zu erleben.',
      steps: [
        'Lies den Vertrag gründlich durch, bevor du unterschreibst — nimm dir Zeit und markiere unklare Stellen.',
        'Achte auf diese Punkte: Staffelmiete (steigt die Miete regelmäßig an?), Schönheitsreparaturen (wer macht die und zahlst du?), und das Übergabeprotokoll (Kratzer, Flecken — wer haftet?).',
        'Frage deinen Vermieter oder einen Mietverein um Erläuterungen, falls etwas unklar ist.',
        'Unterschreibe erst, wenn alles passt — du verlässt dich danach auf diese Absprachen.'
      ],
      deadline: 'Vor dem Einzug',
      consequence: 'Wenn du unaufmerksam unterschreibst, können später Diskussionen über Kosten oder Schäden teuer werden — eine kurze Prüfung spart dir Mühe.',
      category: 'wohnen'
    },
    {
      id: 'anmeldung-amt',
      title: 'Bürgeramt-Anmeldung',
      summary: 'Melde deine neue Wohnung früh an, damit deine Unterlagen sauber und vollständig sind.',
      steps: [
        'Rufe die zuständige Meldebehörde an oder prüfe den Online-Terminservice deiner Stadt.',
        'Nimm deinen Personalausweis und die Wohnungsgeberbestätigung (§ 19 BMG) mit – die musst du dir vom Vermieter geben lassen; der Mietvertrag allein reicht nicht.',
        'Melde dich persönlich an und halte die Empfangsbestätigung sorgfältig fest.',
        'Prüfe danach, ob du weitere Unterlagen für andere Stellen brauchst (Bank, Versicherung, Arbeitgeber), und richte einen Nachsendeauftrag der Post ein.'
      ],
      deadline: '{FRIST_ANMELDUNG}',
      consequence: 'Wenn du dich nicht rechtzeitig anmeldest, riskierst du ein Bußgeld ({BUSSGELD_ANMELDUNG}). Wichtiger: Es kann zu Problemen bei Versicherungen, der Bank oder Behörden kommen.',
      category: 'amt',
      faktenKeys: ['FRIST_ANMELDUNG', 'BUSSGELD_ANMELDUNG'],
      hilfen: [{ label: 'Zuständiges Bürgeramt finden', url: 'https://verwaltung.bund.de/' }]
    },
    {
      id: 'nebenkosten-kaution',
      title: 'Nebenkosten und Kaution verstehen',
      summary: 'Unterscheide zwischen Kalt- und Warmmiete; die Kaution ist gesetzlich begrenzt.',
      steps: [
        'Frage deinen Vermieter nach der genauen Aufschlüsselung: Kaltmiete, Nebenkosten (Heizung, Wasser, Müll) und die Gesamtmiete.',
        'Achte darauf, dass die Kaution nicht zu hoch ist — die Obergrenze liegt bei {ANZAHL_KALTMIETEN_KAUTION} der Kaltmiete.',
        'Überprüfe die Kautionsabrede im Mietvertrag und frage nach, wie die Kaution verzinst wird.',
        'Mache bei Übergabe ein Protokoll, damit es beim Auszug keine Streitereien gibt.'
      ],
      deadline: 'Vor oder bei Einzug',
      consequence: 'Wenn du nicht aufpasst, kann eine zu hohe Kaution oder verschwundene Wärmekostenerstattung später ärgerlich werden — eine klare Absprache schützt dich.',
      category: 'wohnen',
      faktenKeys: ['ANZAHL_KALTMIETEN_KAUTION']
    },
    {
      id: 'strom-internet',
      title: 'Strom- und Internetverträge beim Umzug',
      summary: 'Der erste Umzug ist eine gute Gelegenheit, die Verträge zu prüfen und neutral zu vergleichen.',
      steps: [
        'Erkunde, welche Anbieter an deiner neuen Adresse verfügbar sind.',
        'Vergleiche zwei bis drei Tarife nach Preis, Kündigungsfrist ({FRIST_KUENDIGUNG_STROM}) und Kundenservice — bedenke, dass Rabatte oft nur befristet gelten.',
        'Beachte: Lange Laufzeiten und hohe Kündigungsfristen können dich später festlegen; kurze Optionen geben dir mehr Flexibilität.',
        'Schließe den neuen Vertrag rechtzeitig ab, damit der Strom und Internet am Umzugstag verfügbar sind.'
      ],
      deadline: 'Vor dem Einzug',
      consequence: 'Wenn du keine Verträge rechtzeitig kündest, zahlst du doppelt oder ohne Strom — eine rechtzeitige Planung macht das einfach.',
      category: 'wohnen',
      faktenKeys: ['FRIST_KUENDIGUNG_STROM']
    },
    {
      id: 'hausrat',
      title: 'Hausratversicherung — wann sinnvoll?',
      summary: 'Eine Hausratversicherung schützt deine Möbel und Gegenstände vor Schäden. Nicht immer zwingend, aber oft clever.',
      steps: [
        'Überschlage den Wert deiner Gegenstände (Möbel, Elektronik, Kleidung) — das hilft dir zu entscheiden, ob es sinnvoll ist.',
        'Überprüfe, ob deine Familie dich noch mitversichert oder ob du eine eigene Police brauchst.',
        'Vergleiche zwei Angebote: Was ist versichert (Feuer, Einbruch, Wasser)? Wie hoch ist die Selbstbeteiligung?',
        'Halte die Versicherungsunterlagen an einem sicheren Ort — du brauchst sie im Schadensfall.'
      ],
      deadline: 'Zeitnah nach Einzug',
      consequence: 'Ohne Hausratversicherung trägst du das volle Risiko bei Schäden — das kann teuer werden, ist aber möglich zu tragen.',
      category: 'versicherung'
    },
    {
      id: 'rundfunkbeitrag',
      title: 'Rundfunkbeitrag — Meldung und Befreiung',
      summary: 'Der Rundfunkbeitrag ist Pflicht, aber Befreiungen sind möglich — informiere dich früh.',
      steps: [
        'Prüfe, ob dein Haushalt bereits erfasst ist oder ob du dich neu anmelden musst.',
        'Der monatliche Beitrag liegt bei {BETRAG_RUNDFUNK} — dieser ist gesetzlich festgelegt.',
        'Falls du BAföG oder bestimmte Sozialleistungen (z. B. Bürgergeld) bekommst, kannst du dich oft befreien oder ermäßigen lassen. Den Antrag stellst du beim ARD ZDF Deutschlandradio Beitragsservice.',
        'Sende die Meldung oder Befreiungsanfrage ab und speichere die Bestätigung.'
      ],
      deadline: '{FRIST_RUNDFUNKBEITRAG}',
      consequence: 'Wenn du dich nicht anmeldest, kann es zu Zahlungsaufforderungen oder Mahnungen kommen — eine rechtzeitige Meldung vermeidet das.',
      category: 'wohnen',
      faktenKeys: ['BETRAG_RUNDFUNK', 'FRIST_RUNDFUNKBEITRAG'],
      hilfen: [{ label: 'Beitragsservice – anmelden & befreien', url: 'https://www.rundfunkbeitrag.de/' }]
    },
    {
      id: 'wohngeld',
      title: 'Wohngeld – Mietzuschuss prüfen',
      summary: 'Wohngeld ist ein staatlicher Zuschuss zur Miete – auch für viele Azubis und Geringverdiener möglich.',
      steps: [
        'Mach einen kostenlosen Wohngeldrechner-Check, ob dir Wohngeld zusteht (hängt von Miete, Einkommen und Haushaltsgröße ab).',
        'Wenn es passt: Antrag bei der Wohngeldstelle deiner Stadt/Gemeinde stellen – meist online oder per Formular.',
        'Unterlagen: Mietvertrag, Einkommensnachweise, Meldebestätigung.',
        'Hinweis: Wer BAföG oder Bürgergeld bekommt, hat meist keinen Wohngeld-Anspruch – dort ist die Miete schon eingerechnet.'
      ],
      deadline: 'Sobald du eine eigene Wohnung hast',
      consequence: 'Ohne Antrag verschenkst du womöglich einen Zuschuss, der dir zusteht – Wohngeld wird nicht automatisch gezahlt.',
      category: 'wohnen',
      hilfen: [{ label: 'Wohngeld – Infos des Bundes', url: 'https://www.bmwsb.bund.de/Webs/BMWSB/DE/themen/stadt-wohnen/wohnraumfoerderung/wohngeld/wohngeld-node.html' }]
    }
  ]
}
