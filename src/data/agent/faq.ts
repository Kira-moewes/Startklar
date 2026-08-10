// App-Hilfe für Klaro: erklärt die Funktionen von Startklar selbst.
// Jeder Eintrag verweist auf die Stelle in der App, an der man es tut.

export type FaqEintrag = {
  id: string
  titel: string
  text: string
  route: string
}

export const faqEintraege: FaqEintrag[] = [
  {
    id: 'onboarding-neu',
    titel: 'Onboarding neu starten',
    text: 'Du kannst die 7 Fragen jederzeit neu beantworten. Öffne das Onboarding über dein Profil – deine bisherigen Antworten bleiben vorausgewählt.',
    route: '/onboarding',
  },
  {
    id: 'antwort-aendern',
    titel: 'Einzelne Profil-Antwort ändern',
    text: 'Auf der Profilseite siehst du alle deine Antworten als Karten. Tippe eine an, wähle die neue Antwort – gespeichert wird sofort, und du siehst direkt, welche Schritte sich dadurch ändern.',
    route: '/profil',
  },
  {
    id: 'abhaken',
    titel: 'Schritt als erledigt abhaken (oder rückgängig machen)',
    text: 'In jedem Bereich hat jede Aufgabe links einen Kreis – antippen hakt sie ab, nochmal antippen macht es rückgängig. Auf der Aufgabenseite gibt es dafür den großen Button unten.',
    route: '/',
  },
  {
    id: 'termin-anlegen',
    titel: 'Termin anlegen',
    text: 'Unter Termine legst du mit „+ Termin anlegen" neue Termine an. Noch schneller: Auf jeder Aufgabenseite gibt es „Termin dazu anlegen" – dann ist der Termin gleich mit dem Schritt verknüpft.',
    route: '/termine',
  },
  {
    id: 'termin-kalender',
    titel: 'Termin in deinen Kalender exportieren (ICS)',
    text: 'Bei jedem Termin findest du „In Kalender" – das lädt eine ICS-Datei herunter, die du in Google Kalender, Apple Kalender oder Outlook öffnen kannst.',
    route: '/termine',
  },
  {
    id: 'vergleich-eintragen',
    titel: 'Eigenes Angebot im Vergleich eintragen',
    text: 'Öffne im Vergleich eine Kategorie (z. B. Strom oder Haftpflicht) und trag den Anbieternamen ein. Bei bekannten Anbietern schlage ich dir welche vor und fülle Richtwerte vor – du kannst jeden Wert überschreiben. Startklar bewertet keine Anbieter, du vergleichst selbst, neutral und ohne Werbung.',
    route: '/vergleich',
  },
  {
    id: 'bedarf-check',
    titel: 'Brauche ich diese Versicherung? (Bedarfscheck)',
    text: 'Bei Haftpflicht, Hausrat und Kfz gibt es einen kurzen Bedarfscheck: ein paar Fragen zeigen dir, ob und wie viel Versicherung du brauchst und welche Zielwerte (z. B. Deckungssumme) für dich sinnvoll sind. Du findest ihn über „Bedarf checken" auf der jeweiligen Vergleichsseite.',
    route: '/vergleich',
  },
  {
    id: 'richtwerte-herkunft',
    titel: 'Woher kommen die vorausgefüllten Werte im Vergleich?',
    text: 'Die vorausgefüllten Werte sind unverbindliche Richtwerte (markiert mit ≈) aus einer gepflegten Liste bekannter Anbieter – grobe Orientierung, keine Angebote. Sie können veraltet sein, prüf sie beim Anbieter und überschreib sie mit deinen echten Zahlen.',
    route: '/vergleich',
  },
  {
    id: 'best-match',
    titel: 'Was bedeutet „Passt am besten zu deinem Bedarf"?',
    text: 'Wenn du den Bedarfscheck gemacht und mehrere Angebote eingetragen hast, markiere ich das Angebot, das deine Zielwerte am besten erfüllt. Das bezieht sich nur auf deine eigenen Eingaben – es ist keine Markt- oder Anbieterempfehlung, und deine Favoriten-Wahl bleibt davon unberührt.',
    route: '/vergleich',
  },
  {
    id: 'vergleich-favorit',
    titel: 'Favorit im Vergleich markieren',
    text: 'In jeder Vergleichstabelle kannst du ein Angebot als Favorit markieren (Stern), damit du deinen aktuellen Favoriten im Blick behältst.',
    route: '/vergleich',
  },
  {
    id: 'suche',
    titel: 'Suche benutzen',
    text: 'Die Suche findet alle Schritte und Vergleiche – z. B. „Kaution", „Rundfunkbeitrag" oder „Führerschein". Treffer, die laut deinem Profil relevant sind, stehen oben.',
    route: '/suche',
  },
  {
    id: 'daten-export',
    titel: 'Daten sichern (Export) und wiederherstellen (Import)',
    text: 'In den Einstellungen auf der Profilseite kannst du alle Daten als JSON-Datei exportieren und auf einem neuen Gerät wieder importieren. Wichtig bei Handywechsel – deine Daten liegen nur auf deinem Gerät.',
    route: '/profil',
  },
  {
    id: 'daten-loeschen',
    titel: 'Alle Daten löschen',
    text: 'In den Einstellungen unter „Deine Daten" löschst du mit zwei Klicks alles von deinem Gerät – Profil, Fortschritt, Termine, Vergleiche und Chatverlauf. Es gibt kein Konto und keinen Server, auf dem etwas übrig bleibt.',
    route: '/profil',
  },
  {
    id: 'design',
    titel: 'Design anpassen (Dunkelmodus, Akzentfarbe, Schriftgröße)',
    text: 'In den Einstellungen auf der Profilseite: Hell/Dunkel/System umschalten, eine von vier Akzentfarben wählen, die Schriftgröße ändern oder Animationen reduzieren.',
    route: '/profil',
  },
  {
    id: 'ki-modus',
    titel: 'Was ist der KI-Modus – und was passiert mit meinen Daten?',
    text: 'Ohne KI-Modus antworte ich komplett auf deinem Gerät. Mit KI-Modus (Einstellungen) schicke ich deine Frage an einen Server, wenn meine lokale Antwort nicht reicht – gespeichert wird dort nichts. Dein Profil geht nur mit, wenn du „Kontext mitschicken" zusätzlich erlaubst.',
    route: '/profil',
  },
  {
    id: 'was-ist-startklar',
    titel: 'Was ist Startklar?',
    text: 'Startklar begleitet dich bei den ersten Behörden-, Geld- und Wohnungs-To-dos: Schritt-für-Schritt-Anleitungen, Fristen, Termine und neutrale Vergleiche – personalisiert über 7 Fragen, alle Daten bleiben lokal.',
    route: '/',
  },
  {
    id: 'fortschritt-ansehen',
    titel: 'Fortschritt ansehen',
    text: 'Unter Fortschritt siehst du deinen Gesamtfortschritt als Ring, den Stand je Bereich, deine Aktivität der letzten Wochen und die nächsten Schritte.',
    route: '/fortschritt',
  },
  {
    id: 'anbieter-antippen',
    titel: 'Anbieter ohne Tippen hinzufügen',
    text: 'Bei Haftpflicht, Hausrat und Kfz stehen bekannte Anbieter als Buttons unter dem Eingabefeld – einmal antippen, und die Spalte wird mit unverbindlichen Richtwerten (≈) vorbefüllt. Alles bleibt editierbar.',
    route: '/vergleich',
  },
  {
    id: 'unterlagen-ablegen',
    titel: 'Unterlagen (PDF/Foto) ablegen',
    text: 'Auf jeder Aufgaben-Seite und in jedem Vergleich gibt es „Deine Unterlagen": Dort legst du z. B. deine Police oder ein Foto des Vertrags ab. Maximal 4 MB pro Datei – alles bleibt auf deinem Gerät und ist im Daten-Export enthalten.',
    route: '/vergleich',
  },
  {
    id: 'vergleich-drucken',
    titel: 'Vergleich oder Bedarfscheck als PDF speichern',
    text: 'Oben auf der Vergleichsseite (und beim Bedarfscheck-Ergebnis) gibt es „Drucken / PDF". Im Druckdialog deines Geräts wählst du „Als PDF sichern" – fertig.',
    route: '/vergleich',
  },
  {
    id: 'tarif-steckbrief',
    titel: 'Was ist der Tarif-Steckbrief?',
    text: 'Nach dem Fragebogen (Bedarfscheck) bekommst du deinen Tarif-Steckbrief: welche Deckung, Selbstbeteiligung und Bausteine DU brauchst. Druck ihn aus und nimm ihn mit ins Gespräch. Dazu siehst du, welche Anbieter aus unserem Katalog deine Ziele laut Richtwerten erfüllen – alphabetisch, ohne Empfehlung, ohne Provision.',
    route: '/vergleich',
  },
  {
    id: 'fragebogen-schritt-1',
    titel: 'Fragebogen bei Versicherungs-Aufgaben',
    text: 'Bei Versicherungs-Aufgaben (Haftpflicht, Hausrat, Kfz, Krankenkasse) ist der Fragebogen jetzt Schritt 1 auf der Aufgaben-Seite – ausfüllen dauert etwa 3 Minuten, danach zeigt der Schritt ein Häkchen und dein Ergebnis.',
    route: '/vergleich',
  },
  {
    id: 'eigene-farbe',
    titel: 'App-Farbe frei wählen',
    text: 'Im Profil unter Darstellung kannst du neben den Vorgaben mit dem Regenbogen-Kreis jede eigene Farbe wählen. Sie färbt Buttons, den Papierflieger, Fortschritt und Chips – die Schriftfarbe passt sich automatisch an, damit alles lesbar bleibt.',
    route: '/profil',
  },
]
