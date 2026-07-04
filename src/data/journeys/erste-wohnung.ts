import type { Journey } from '../types'

export const ersteWohnungJourney: Journey = {
  id: 'erste-wohnung',
  title: 'Erste Wohnung',
  subtitle: 'Wichtige Schritte, wenn du neu einziehst.',
  tasks: [
    {
      id: 'anmeldung-beim-amt',
      title: 'Anmeldung beim Amt',
      summary: 'Melde deine neue Wohnung früh an, damit deine Unterlagen sauber und vollständig sind.',
      steps: [
        'Rufe die zuständige Meldebehörde an oder prüfe den Online-Terminservice deiner Stadt.',
        'Nimm deinen Personalausweis, den Mietvertrag und einen Nachweis zu deiner neuen Wohnung mit.',
        'Melde dich persönlich an und halte die Empfangsbestätigung sorgfältig fest.',
        'Prüfe danach, ob du noch weitere Unterlagen für andere Stellen brauchst.'
      ],
      deadline: '{FRIST_ANMELDUNG}', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn du dich nicht rechtzeitig anmeldest, kann es zu Problemen bei Versicherungen, der Bank oder anderen wichtigen Kontakten kommen.',
      category: 'amt',
      faktenKeys: ['FRIST_ANMELDUNG']
    },
    {
      id: 'rundfunkbeitrag',
      title: 'Rundfunkbeitrag',
      summary: 'Schau nach, ob du für die neue Wohnung einen Beitrag melden oder einreichen musst.',
      steps: [
        'Öffne die Informationen zum Rundfunkbeitrag und prüfe, ob dein Haushalt bereits erfasst ist.',
        'Notiere dir die Angaben, die du für die Meldung benötigst, und halte sie bereit.',
        'Sende die Meldung ab, sobald du die notwendigen Unterlagen zusammen hast.',
        'Speichere die Empfangsbestätigung für deine eigenen Unterlagen.'
      ],
      deadline: '{FRIST_RUNDFUNKBEITRAG}', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn du den Beitrag nicht meldest, kann es später zu Rückfragen oder Nachforderungen kommen.',
      category: 'wohnen',
      faktenKeys: ['FRIST_RUNDFUNKBEITRAG', 'BETRAG_RUNDFUNK']
    },
    {
      id: 'haftpflichtversicherung',
      title: 'Haftpflichtversicherung',
      summary: 'Sichere deine neue Wohnsituation ab und prüfe, ob du eine passende Versicherung brauchst.',
      steps: [
        'Lies die Bedingungen deiner aktuellen Versicherung durch und prüfe, ob du sie für die neue Wohnung anpassen musst.',
        'Frage nach, ob eine Zusatzdeckung für deine neue Wohnsituation sinnvoll ist.',
        'Vergleiche die Angebote und wähle die Variante, die zu deinem Alltag passt.',
        'Bewahre die Versicherungsunterlagen an einem sicheren Ort auf.'
      ],
      deadline: '{FRIST_VERSICHERUNG}', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn du die Versicherung nicht prüfst, kann ein Lückenfall später teuer werden.',
      category: 'versicherung',
      faktenKeys: ['FRIST_VERSICHERUNG']
    },
    {
      id: 'adress-aenderungen',
      title: 'Adressänderungen Bank/Arbeitgeber/Post',
      summary: 'Stelle sicher, dass deine neue Adresse überall sauber weitergegeben wird.',
      steps: [
        'Informiere deine Bank über deine neue Anschrift und prüfe, ob du neue Dokumente brauchst.',
        'Teile deine neue Adresse deinem Arbeitgeber oder deiner Personalabteilung mit.',
        'Ändere deine Adresse bei der Post und bei wichtigen Online-Diensten.',
        'Prüfe am Ende noch einmal, ob alle wichtigen Stellen deine neue Adresse erhalten haben.'
      ],
      deadline: '{FRIST_ADRESSAENDERUNG}', // [GEGENCHECKEN: von Kira zu verifizieren]
      consequence: 'Wenn du die Adresse nicht aktualisierst, können Post, Zahlungen oder wichtige Nachrichten verloren gehen.',
      category: 'finanzen',
      faktenKeys: ['FRIST_ADRESSAENDERUNG']
    }
  ]
}
