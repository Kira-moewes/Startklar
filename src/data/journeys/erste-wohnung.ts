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
        'Nimm deinen Personalausweis, den Mietvertrag und ggf. eine Wohnungsgeberbescheinigung mit.',
        'Melde dich persönlich an und halte die Empfangsbestätigung sorgfältig fest.',
        'Prüfe danach, ob du noch weitere Unterlagen für andere Stellen brauchst (Bank, Versicherung, Arbeitgeber).'
      ],
      deadline: '{FRIST_ANMELDUNG}',
      consequence: 'Wenn du dich nicht rechtzeitig anmeldest, riskierst du ein Bußgeld ({BUSSGELD_ANMELDUNG}). Wichtiger: Es kann zu Problemen bei Versicherungen, der Bank oder Behörden kommen.',
      category: 'amt',
      faktenKeys: ['FRIST_ANMELDUNG', 'BUSSGELD_ANMELDUNG']
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
        'Falls du BAföG bekommst, Sozialleistungen erhältst oder berufsunfähig bist: Du kannst dich oft befreien oder ermäßigen lassen. Stelle den Antrag bei der Rundfunkgebühreneinzugszentrale.',
        'Sende die Meldung oder Befreiungsanfrage ab und speichere die Bestätigung.'
      ],
      deadline: 'Zeitnah nach Einzug anmelden',
      consequence: 'Wenn du dich nicht anmeldest, kann es zu Zahlungsaufforderungen oder Mahnungen kommen — eine rechtzeitige Meldung vermeidet das.',
      category: 'wohnen',
      faktenKeys: ['BETRAG_RUNDFUNK']
    }
  ]
}
