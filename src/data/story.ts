// Story-Texte für die geführte Himmelstour. Bewusst als Daten (nicht im
// Code), damit Kira Texte leicht anpassen kann. Zwei Figuren: Fiete
// (Co-Pilot) und Klaro (Lotse).

export type TourSchritt = {
  name: string
  wer: 'fiete' | 'klaro'
  text: string
  weiterLabel?: string
}

// Fiete führt beim ersten Himmel-Besuch durch die App und erklärt sie.
export const tourSchritte: TourSchritt[] = [
  {
    wer: 'fiete',
    name: 'Fiete',
    text: 'Willkommen in deinem Himmel! Jede Insel hier ist eine echte Aufgabe. Tipp eine an – ich flieg mit.',
  },
  {
    wer: 'fiete',
    name: 'Fiete',
    text: 'Jede erledigte Sache bringt dir Flugmeilen und lässt die Insel leuchten. Nichts geht je verloren – auch wenn du mal ein paar Wochen nicht fliegst.',
  },
  {
    wer: 'klaro',
    name: 'Klaro',
    text: 'Kommt ein Brief hoch, den du nicht raffst? Oben auf „Post" tippen. Ich erklär ihn dir in Ruhe – kein Notfall, ein Schritt nach dem anderen.',
  },
  {
    wer: 'fiete',
    name: 'Fiete',
    text: 'Alles, was du schaffst, sammelt sich in deinem Flugbuch – deine Beweisstücke. Und deine Figur kannst du im Profil aufhübschen.',
  },
  {
    wer: 'fiete',
    name: 'Fiete',
    text: 'Das war\'s. Such dir eine Insel aus – am besten die, die gerade am meisten drückt. Los geht\'s!',
    weiterLabel: 'Losfliegen',
  },
]
