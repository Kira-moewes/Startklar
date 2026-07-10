// Story „Über dem Nebel" – Skript für den Intro-Film und die geführte
// Himmelstour. Bewusst als Daten (nicht im Code), damit Kira Texte leicht
// anpassen kann. Zwei Figuren: Fiete (Co-Pilot) und Klaro (Lotse).

export type Sprecher = 'fiete' | 'klaro' | 'erzaehler'

export type IntroBeat = {
  sprecher: Sprecher
  name?: string
  // Kurzer Text (eine Gedankeneinheit pro Beat).
  text: string
  // Grober Bühnen-Zustand für die Animation.
  szene: 'ankunft' | 'nebel' | 'inseln' | 'funk' | 'aufbruch'
}

// Der Prolog: „Der erste Flug". Wehmütig-hoffnungsvoll, nicht kindisch.
export const introBeats: IntroBeat[] = [
  {
    sprecher: 'erzaehler',
    text: 'Du stehst am Rand deiner Insel. Unter dir: Nebel. Vor dir: der ganze Himmel.',
    szene: 'nebel',
  },
  {
    sprecher: 'fiete',
    name: 'Fiete',
    text: 'Na? Guckst auch in den Nebel und fragst dich, wie tief der ist?',
    szene: 'ankunft',
  },
  {
    sprecher: 'fiete',
    name: 'Fiete',
    text: 'Sieht bodenlos aus, nicht?',
    szene: 'nebel',
  },
  {
    sprecher: 'fiete',
    name: 'Fiete',
    text: 'Wir stürzen da nicht runter. Wir hüpfen von Insel zu Insel. Jede, die du schaffst, leuchtet auf – und bleibt für immer deine.',
    szene: 'inseln',
  },
  {
    sprecher: 'klaro',
    name: 'Klaro',
    text: 'Und wenn Post aus dem Nebel hochweht, die du nicht verstehst – ich bin auf Funk. Ganz ruhig, immer.',
    szene: 'funk',
  },
  {
    sprecher: 'fiete',
    name: 'Fiete',
    text: 'Je weiter du kommst, desto dünner wird der Nebel. Versprochen. Bereit? Dann mach deinen Flieger startklar.',
    szene: 'aufbruch',
  },
]

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
