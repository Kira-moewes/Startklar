# Startklar – Konzept Runde 7: Strategie

**Thema:** Pivot vom Werkzeug zum Spiel der Selbstwirksamkeit – psychologisches Fundament, Gamification-Engine, Markenrichtungen, Monetarisierung ohne Provision, Roadmap
**Status:** Strategie beschlossen – Grundlage für r8 (Design-Deep-Dive) und r9 (MVP-Umbau) · **Stand:** Juli 2026

Anders als r3–r6 ist dies keine Umsetzungsrunde, sondern die Strategieschicht
darüber. Kapitel 2 und 3 (Fundament + Core Loop) sind tief ausgearbeitet und
entscheidungsreif; Kapitel 4–6 (Marke, Monetarisierung, Roadmap) sind Skizzen
mit klarer Empfehlung, die in r8/r9 vertieft werden.

**Getroffene Entscheidungen (Kira, abgefragt):**

- **Codebasis:** wird *nach* der Strategie entschieden → Kap. 6.4 liefert die Kriterien, keine Vorfestlegung.
- **Kern-Persona:** 16–21 breit (Schulabgänger, Azubis, Erstauszieher) + **Care-Leaver-Stresstest** für jedes Feature.
- **Marktzugang B2G/B2B:** keiner vorhanden, Kaltstart → Monetarisierungspfad muss ohne Kontakte funktionieren.
- **Tiefenstaffelung:** Fundament + Core Loop zuerst, Rest als begründete Skizze.

---

## 1. Ersteinschätzung & Inventur

### 1.1 Größter Denkfehler: „langweilig/nervig" als Diagnose, Spiel als Therapie

Die Ausgangsthese lautete: Adulting nervt und ist langweilig, also verwandeln
wir Pflicht in Spiel. Die Verhaltensforschung zu aversiven Pflichtaufgaben
sagt etwas anderes: Behörden- und Geldkram wird nicht primär aufgeschoben,
weil er langweilig ist, sondern weil er **bedrohlich und ambig** ist.
Prokrastination ist kurzfristige Emotionsregulation („mood repair", Sirois &
Pychyl 2013) – man flieht nicht vor der Aufgabe, sondern vor dem Gefühl, das
sie auslöst. „Boring" ist, was die Zielgruppe *sagt*, weil es sozial billiger
ist als „ich habe Angst, dumm dazustehen".

Nehmen wir „langweilig" wörtlich und streuen Konfetti über Formulare, bauen
wir ein Duolingo-für-Behörden: ein Spiel, das im entscheidenden Moment –
Brief vom Amt auf dem Tisch, Puls oben – emotional falsch ist und genau dann
nicht geöffnet wird.

**Konsequenz:** Die Gamification-Engine ist primär **Angstreduktions- und
Kompetenz-Architektur** (sichere Probehandlungen, garantierter Ersterfolg,
Nichtwissen entstigmatisieren) und erst sekundär Spiel-Ästhetik. Punkte,
Farben, Sammelbares verstärken die Selbstwirksamkeits-Evidenz – sie ersetzen
sie nicht.

### 1.2 Zweiter Denkfehler: „Vergiss das alte Konzept" ohne Inventur

Marke und Design können weg. Aber die Inhalts-Engine (Journeys,
Bedarfslogik, Steckbriefe, Neutralität ohne Provision, lokale Datenhoheit)
ist der Burggraben – am schwersten kopierbar und zufällig exakt das, was
öffentliche Geldgeber als Beschaffungsvoraussetzung verlangen. Der Pivot ist
Re-Framing + neue Mechanik-Schicht + neue Hülle, kein Wegwerfen des Kerns.

### 1.3 Größte Chance: die Lücke „ernsthafter Inhalt × jugendgerechte Form × öffentliches Geld"

Es gibt Behörden-PDFs (korrekt, unbenutzbar) und Finfluencer (ansprechend,
provisionsgetrieben). Dazwischen ist niemand. Gleichzeitig existieren Käufer,
die Verselbständigung fördern *müssen* und kein Produkt dafür haben:
Jugendhilfe (Hilfe für junge Volljährige und Nachbetreuung, § 41/41a
SGB VIII), Schulen (die „Gedichtanalyse statt Steuererklärung"-Debatte ist
politisch ungelöst und anschlussfähig), Kommunen, Stiftungen. Markenseitig
ist **„der Ort, wo Nichtwissen normal ist"** unbesetzt – und Scham löst man
psychologisch über Normalisierung, nicht über Belohnung.

### 1.4 Inventur: Behalten / Verwerfen / Umbauen

| Asset (Bestand r2–r6) | Urteil | Begründung |
|---|---|---|
| Journeys + Schrittlogik (`src/data/journeys/`) | **Behalten** | Inhaltlicher Kern; wird zu Skill-Gebieten und Quests umgedeutet (Kap. 3.1) |
| Bedarfschecks + Tarif-Steckbrief (`src/data/bedarf/`) | **Behalten** | Ist bereits Quiz-Mechanik mit Artefakt-Belohnung – fertiges Spielmaterial |
| Neutralität ohne Provision | **Behalten** | Im Consumer-Markt ein Handicap, im B2G-Markt Verkaufsargument Nr. 1 |
| Local-first Datenhoheit (IndexedDB, Export/Import) | **Behalten + erweitern** | Pflicht für vulnerable Nutzer; für B2B kommen anonyme Kohorten-Metriken *daneben*, nie darüber (Kap. 5.4) |
| Fakten-Platzhalter-Disziplin (`{PLATZHALTER}`, `geprueft`) | **Behalten** | Vertrauens-Asset; wird im Spiel-Kontext noch wichtiger |
| Profilfrage „Wer hilft dir bei Behörden-Kram?" | **Behalten + aufwerten** | „Niemand – ich mach das allein" ist unser Care-Leaver-Signal für Ton und Priorisierung – niemals als Label (Kap. 2.4) |
| Klaro (schwebender FAQ-Bot) | **Umbauen** | Vom Hilfe-Button zum Charakter mit Persönlichkeit; Maskottchen-Kandidat je nach Markenrichtung (Kap. 4) |
| Fortschritts-Ring + Aktivitäts-Heatmap | **Umbauen** | GitHub-Heatmap ist Entwickler-Ästhetik und belohnt Frequenz statt Können; ersetzt durch Meisterschafts-System + Landkarte (Kap. 3.3) |
| Onboarding (7 Fragen) | **Umbauen** | Wird zur Charaktererstellung: gleiche Daten, anderes Framing |
| Akzentfarben-System mit freiem Picker (r6) | **Umbauen** | Technisch exzellente Basis für Selbstausdruck; wird Teil des Freischalt-Systems – Basis bleibt frei (Kap. 3.4) |
| Papierflieger, Wortmarke, nüchterner Ton als *einziges* Register | **Verwerfen** | Wie gefordert. Aber: das ruhige Register muss innerhalb der neuen Marke abrufbar bleiben – für die Angst-Momente (Kap. 2.3, 4.1) |
| Idee „Monetarisierung = Optimierung junger Leute" | **Verwerfen** | Macht Nutzer zum Gegenstand statt zum Kunden; ersetzt durch Wirkungsnachweis auf Kohortenebene (Kap. 5.1) |

---

## 2. Psychologisches Fundament

### 2.1 Warum „Adulting" wirklich nervt – vier Mechanismen

Jeder Mechanismus bekommt eine Produktkonsequenz. Das ist der Design-Brief.

**M1 – Autonomiebedrohung.** Die Aufgaben sind fremdbestimmt: Ämter, Fristen,
Eltern („kümmer dich endlich"). Nach der Selbstbestimmungstheorie (Deci &
Ryan) untergräbt erlebter externer Druck die Motivation; Reaktanz (Brehm)
erzeugt aktiven Widerstand gerade gegen gut gemeinte Aufforderungen.
→ *Produktkonsequenz:* Die App spricht **nie mit der Stimme des Amtes oder
der Eltern**. Kein „du musst", keine ungefragten Push-Erinnerungen, keine
Standard-Reihenfolge, die abgearbeitet werden soll. Stattdessen
Wahlarchitektur: welcher Skill zuerst, welches Tempo, welche Erinnerung –
alles wählt die Nutzerin. Fremdbestimmte Fristen werden als Fakten der Welt
präsentiert („das Amt will das bis X"), die App positioniert sich auf der
Seite der Nutzerin gegen die Komplexität.

**M2 – Fehlende Sofortbelohnung.** Der Nutzen von „Haftpflicht abschließen"
liegt Monate bis Jahre in der Zukunft und ist abstrakt (temporales
Discounting: ferne, unsichere Belohnungen werden massiv abgewertet). Die
Kosten – Zeit, Unlust, Angst – sind sofort.
→ *Produktkonsequenz:* Jede Handlung unter 5 Minuten erzeugt eine **sofort
sichtbare, ehrliche Evidenz**: ein Artefakt (Steckbrief, Notiz „das weißt du
jetzt"), einen Skill-Fortschritt, einen freigelegten Teil der Landkarte.
Nicht als Ersatzbelohnung, sondern als vorgezogene Sichtbarmachung des
echten Nutzens.

**M3 – Überforderung & Ambiguität.** Die Zielgruppe hat kein mentales Modell
der Aufgabe: Was ist eine Haushaltsbescheinigung? Wie lange dauert das? Was
passiert, wenn ich einen Fehler mache? Ambiguität + Angst führt zu
Informationsvermeidung („Ostrich-Effekt": den Brief gar nicht erst öffnen).
→ *Produktkonsequenz:* Jede Aufgabe beginnt mit einer **Einordnung in einem
Satz** (was ist das, wie lange dauert es, was ist das Schlimmste, das
passieren kann – meist: erstaunlich wenig) und einem **kleinsten sicheren
Schritt**, der garantiert schaffbar ist und keine Konsequenzen in der
realen Welt hat. Probehandlung vor Ernstfall.

**M4 – Stigma des Nichtwissens.** Fragen stellen heißt zugeben, dass man
etwas „schon wissen müsste". Scham ist der stärkste Vermeidungstreiber –
und der am wenigsten adressierte. Die Hilfesuch-Forschung zeigt: je höher
die erwartete Beschämung, desto später (oder nie) wird Hilfe gesucht.
→ *Produktkonsequenz:* **Normalisierung als Systemprinzip.** Die App sagt
bei jeder Aufgabe explizit, dass das niemandem beigebracht wurde („Steht in
keinem Lehrplan. Deshalb gibt's uns."). Klaro tritt als Mitlernender auf,
nie als Besserwisser. Es gibt keine Bewertung, keinen Vergleich mit anderen,
keine „das solltest du längst haben"-Formulierungen.

### 2.2 SDT-Mapping: drei Grundbedürfnisse als Produktprinzipien

| Grundbedürfnis | Die App bedient es durch | Die App darf niemals |
|---|---|---|
| **Autonomie** | Freie Skill-Wahl und -Reihenfolge; eigenes Tempo; Erinnerungen nur selbst konfiguriert; „Warum das wichtig ist" wird erklärt statt behauptet (informierte Zustimmung statt Gehorsam) | Druck durch künstliche Fristen, Guilt-Tripping („schon 5 Tage nichts erledigt"), ungefragte Pushes, Zwangs-Reihenfolgen |
| **Kompetenz** | Garantierter Ersterfolg in den ersten 3 Minuten; kleinste sichere Schritte; Meisterschafts-Level mit realer Bedeutung (Kap. 3.3); Probehandlungen ohne Konsequenz | Aufgaben, die scheitern können, ohne Weg zurück; Fortschritt, der verfallen kann; Erfolge, die von Zahlung abhängen |
| **Zugehörigkeit** | Normalisierung („die meisten wissen das nicht"); Klaro als Verbündeter; später: anonymisierte „so haben es andere geschafft"-Geschichten | Leaderboards, sozialer Vergleich, Beschämung, Community-Zwang |

### 2.3 Selbstwirksamkeit als Kernwirkung (Bandura: vier Quellen)

Selbstwirksamkeitserwartung – „ich kann solche Aufgaben bewältigen" – ist
die psychologische Zielgröße der App. Bandura nennt vier Quellen; alle vier
werden zu Produktmechanik:

1. **Eigene Bewältigungserfahrung** (stärkste Quelle): der Core Loop ist
   darauf gebaut – echte Aufgaben, in Schritte zerlegt, mit garantiertem
   Ersterfolg. Kein simuliertes Erfolgserlebnis kann das ersetzen; deshalb
   zählt der Realwelt-Abschluss (Brief wirklich abgeschickt) mehr als jede
   In-App-Aktion (Kap. 3.2, Schritt 6).
2. **Stellvertretende Erfahrung:** kurze, anonyme „So lief das bei mir"-
   Vignetten von Gleichaltrigen an den Angst-Stellen („Ich dachte auch, das
   Amt zerreißt mich. Dauerte 20 Minuten."). Redaktionell kuratiert, keine
   offene Community im MVP.
3. **Verbale Ermutigung:** Klaros Ton – konkret, nüchtern-warm, nie
   cheerleadend („Du schaffst das, weil Schritt 1 nur Lesen ist" statt „Du
   bist großartig!").
4. **Emotionale/körperliche Zustände:** Angst im Brief-Moment wird nicht
   ignoriert, sondern adressiert: das **ruhige Register** (Kap. 3.2,
   Panik-Pfad) senkt Erregung, bevor Inhalte kommen. Keine Therapie-Anmaßung
   – nur Tempo, Sprache und Reihenfolge, die Erregung nicht weiter anheizen.

Messbar machen: Selbstwirksamkeits-Kurzskala (3 Items, angelehnt an die
ASKU) beim Onboarding und periodisch, lokal gespeichert, nur mit Opt-in
anonym aggregiert. Das ist zugleich der Wirkungsnachweis für Kapitel 5.

### 2.4 Care-Leaver-Stresstest (Schutz vulnerabler Nutzer)

Kern-Persona bleibt 16–21 breit. Aber jedes Feature muss zusätzlich diesen
Test bestehen: **Funktioniert es für jemanden ohne Eltern-Backup, mit wenig
Geld, möglicherweise mit schlechten Amts-Erfahrungen und instabilem
Wohnumfeld?** In Deutschland verlassen jedes Jahr zehntausende junge
Menschen die stationäre Jugendhilfe (Zahl redaktionell prüfen) – für sie ist
die App nicht nice-to-have, sondern Ersatz für das Familien-Wissensnetz.
Design for the margins: was für Care Leaver funktioniert, funktioniert für
alle; umgekehrt nicht.

Konkrete Regeln:

- **Keine Verlust-Mechaniken.** Wer drei chaotische Wochen hat (Umzug,
  Jobwechsel, Krise), darf nichts verlieren. Fortschritt ist ein Bestand,
  kein Feuer, das man am Brennen halten muss.
- **„Frist verpasst" ist ein eigener, schamfreier Pfad.** Jede Aufgabe mit
  Frist hat einen sichtbaren Zweig „Schon zu spät? Das geht jetzt noch" –
  sonst produziert die App erlernte Hilflosigkeit genau bei denen, die schon
  hinterher sind. Konsequenzen werden ruhig benannt, nie als Drohung.
- **Kein Feature setzt Eltern voraus.** Formulierungen wie „frag deine
  Eltern" (heute z. B. im Krankenkassen-Task) bekommen immer eine
  gleichwertige Alternative („oder ruf direkt bei der Kasse an – so
  formulierst du die Frage").
- **Krisen-Weiche.** Signalisiert eine Eingabe echte Not (Schulden,
  drohende Wohnungslosigkeit, psychische Krise), wechselt die App ins
  ruhige Register und verweist auf echte, kostenlose Hilfen
  (Jugendberatung, Careleaver-Initiativen, Telefonseelsorge). Das Spiel
  tritt vollständig zurück.
- **Das Signal `unterstuetzung: 'niemand'`** (existiert im Profil) steuert
  Ton und Priorisierung (mehr „so machst du das allein"-Varianten), wird
  aber nie als Label angezeigt, nie exportiert, nie aggregiert
  ausgewiesen, wenn Zellgrößen Rückschlüsse erlauben.
- **Datenhoheit bleibt hart:** local-first, Export/Import, „Alles löschen".
  Für diese Zielgruppe ist „niemand kann mitlesen – auch kein Amt, kein
  Betreuer" ein Sicherheitsversprechen, kein Feature.

### 2.5 Ethik-Leitplanken: Anti-Dark-Pattern-Liste

Verbindlich für alle folgenden Runden. Jede neue Mechanik wird gegen diese
Tabelle geprüft.

| Verboten | Warum (Mechanismus) | Stattdessen |
|---|---|---|
| Streaks mit Verlust, „Flammen" | Verlustaversion erzeugt Angst-Bindung statt Motivation; bestraft chaotische Lebensphasen – also genau unsere vulnerabelsten Nutzer | Kapitel-Fortschritt, der nie verfällt; „Willkommen zurück" statt „Streak verloren" |
| Variable/zufällige Belohnungen (Lootbox-Logik) auf Aufgaben | Operante Konditionierung erzeugt Kompulsion, nicht Kompetenz; ethisch unhaltbar bei Minderjährigen | Deterministische, vorher sichtbare Freischaltungen: „Wenn du X kannst, schaltest du Y frei" |
| Künstliche Verknappung, FOMO-Events, Countdown-Timer | Externer Druck on top auf echte Fristen – die Zielgruppe hat schon genug davon | Echte Fristen ruhig anzeigen, immer mit „zu spät?"-Pfad |
| Pay-to-win, kaufbarer Fortschritt | Zerstört die Kompetenz-Evidenz (der Kern der App) und diskriminiert die zahlungsschwache Zielgruppe | Falls Premium: nur Kosmetik und Komfort, nie Fähigkeits- oder Fortschrittsvorteile |
| Leaderboards, sozialer Rang | Sozialer Vergleich verstärkt Scham (M4) und trifft die Schwächsten am härtesten | Nur Vergleich mit dem eigenen früheren Ich |
| Engagement als Optimierungsziel | Eine App, die maximale Nutzungszeit will, will nicht, dass du fertig wirst – Zielkonflikt mit dem Produktversprechen | Nordstern = Realwelt-Erledigung + Selbstwirksamkeit (Kap. 3.5); „die App will sich überflüssig machen" ist Markenkern und B2G-Argument |
| Ungefragte Erinnerungen / Guilt-Push | Autonomiebedrohung (M1), Reaktanz | Erinnerungen nur selbst angelegt, mit selbst gewähltem Ton |

**Overjustification-Schutz (eigener Absatz, weil subtil):** Der klassische
Befund (Lepper, Greene & Nisbett 1973; Deci-Metaanalysen): erwartbare
Belohnungen für an sich sinnvolle Tätigkeiten verdrängen die intrinsische
Motivation – die Tätigkeit wird zum Mittel für die Belohnung. Unsere drei
Schutzregeln:

1. Belohnungen sind **informational, nicht kontrollierend** (Cognitive
   Evaluation Theory): sie sagen „das kannst du jetzt", nicht „brav gemacht,
   hier ist dein Keks".
2. Belohnt wird **Meisterschaft, nicht Erledigung**: Skill-Level steigen
   durch Verstehen + Anwenden (Quiz bestanden, real gemacht), nicht durchs
   bloße Abhaken von Listenpunkten. Abhaken ist Buchhaltung, kein Trigger
   für Feuerwerk.
3. Das Freischaltbare ist **Selbstausdruck** (Farben, Personalisierung,
   Sammlung), kein Wertversprechen. Niemand soll die Haftpflicht
   abschließen, *um* eine Farbe zu bekommen – die Farbe markiert, *dass*
   man es kann.

---

## 3. Gamification-Engine: die Core Loop

### 3.1 Kern-Metapher: echte Skills statt Punkte

Das Re-Framing, das alles trägt: **„Erwachsenwerden" ist ein Skill-Baum
realer Lebensfähigkeiten, und die App ist der Ort, wo man ihn sichtbar
macht.** Das Gesammelte ist nicht fiktiv – es sind dokumentierte, echte
Kompetenzen („Ich kann eine Wohnung anmieten", „Ich verstehe meine
Krankenkasse"). Damit löst sich das Overjustification-Problem elegant: die
Belohnung *ist* die Fähigkeit, die App macht sie nur sichtbar und
sammelbar.

Mapping auf den Bestand (nichts davon muss inhaltlich neu geschrieben
werden – es wird umgedeutet):

| Bestand | Wird zu |
|---|---|
| Journey (z. B. „Erste Wohnung") | **Skill-Gebiet** auf der Lebens-Landkarte |
| Task mit Schritten | **Quest** mit Etappen |
| Bedarfscheck (Fragebogen) | **Analyse-Mechanik** – das Quiz existiert schon, es fühlt sich nur noch nicht so an |
| Tarif-Steckbrief | **Artefakt/Ausrüstung** – ein erspieltes, druckbares Beweisstück |
| Abgelegte Dokumente (r5) | **Inventar** |
| Klaro | **Begleiter-Charakter** (Ausgestaltung je Markenrichtung, Kap. 4) |
| Profil-Onboarding | **Charaktererstellung** |

### 3.2 Die Core Loop

**Loop A – der Wahl-Pfad** (Nutzerin kommt aus eigenem Antrieb):

1. **Wählen:** Die Lebens-Landkarte zeigt Skill-Gebiete; die Nutzerin wählt
   frei (Autonomie, M1). Empfehlungen sind sichtbar, aber als Angebot
   formuliert („viele in deiner Situation starten hier").
2. **Einordnen (30 Sekunden):** Ein Satz: was ist das, wie lange dauert es,
   was kann schlimmstenfalls passieren. Senkt Ambiguität (M3), bevor
   irgendetwas verlangt wird.
3. **Kleinster sicherer Schritt (2–5 Minuten):** immer eine Probehandlung
   ohne Realwelt-Konsequenz – ein Mini-Quiz, ein Begriff entschlüsselt, der
   Bedarfscheck. Garantierter Ersterfolg (Kompetenz, Bandura-Quelle 1).
4. **Sofortige Kompetenz-Evidenz:** sichtbares Artefakt + konkrete Aussage,
   was man jetzt weiß/kann. Schlägt fehlende Sofortbelohnung (M2) mit
   ehrlicher Evidenz statt Konfetti.
5. **Skill-Fortschritt:** XP fließen auf den *Skill*, nicht auf einen
   globalen Score. Level haben reale Bedeutung (Kap. 3.3).
6. **Realwelt-Abschluss = Meilenstein:** Brief abgeschickt, Konto eröffnet,
   Termin wahrgenommen. Das ist der einzige Moment mit großer Inszenierung
   – plus optionale Ein-Satz-Reflexion („Was war leichter als gedacht?"),
   die die Selbstwirksamkeits-Erfahrung konsolidiert.
7. **Ausblick statt Sog:** Der nächste sinnvolle Quest wird sichtbar, aber
   nicht aufgedrängt. Die Session darf hier enden – gute Kündigung ist
   Prinzip.

**Loop B – der Panik-Pfad** (der Moment, für den es die App wirklich gibt):
Ein prominenter Einstieg **„Ich hab Post bekommen und versteh sie nicht"**
(Foto/Abtippen des Betreffs → Einordnung). Ablauf: erst das **ruhige
Register** – keine Spiel-Elemente, keine Farben-Explosion, nur: „Das ist
ein X. Kein Notfall. Du hast Zeit bis Y. Erster Schritt: 2 Minuten." Erst
wenn der erste Schritt geschafft ist, blendet die App sanft in Loop A über
(der Brief wird zum Quest, der Quest zahlt auf einen Skill ein). **Der
Registerwechsel ist die wichtigste Design-Anforderung an die Marke**
(Kap. 4.1) – und Loop B ist das Feature, das die Angst-These (Kap. 1.1)
in Produkt übersetzt. Im MVP darf die Einordnung kuratiert-manuell hinter
den Kulissen sein (Kap. 6.2, E1), bevor wir sie automatisieren.

### 3.3 Meisterschafts-System (Ersatz für Ring + Heatmap)

Drei Level pro Skill, jedes mit realer Bedeutung – keine abstrakten Zahlen:

- **Level 1 „Verstanden":** Einordnung gelesen + Mini-Check bestanden. (Rein
  in-App, garantiert erreichbar – der Ersterfolg.)
- **Level 2 „Gemacht":** in der realen Welt erledigt (selbst bestätigt –
  wir vertrauen, wir prüfen nicht; Vertrauensvorschuss ist Autonomie).
- **Level 3 „Kann's erklären":** kurzer Erklär-Check („Wie würdest du's
  einem Freund sagen?"). Bereitet stellvertretende Erfahrung für andere
  vor (Bandura-Quelle 2) und festigt das Wissen (Testing-Effekt).

Dazu die **Sammlung**: Artefakte (Steckbriefe, Meilensteine, „Beweisstücke")
– nie verfallend, exportierbar. Und statt der Heatmap die
**Lebens-Landkarte**: Gebiete werden mit steigender Meisterschaft sichtbar
„erschlossen". Exploration statt Frequenz – die Karte fragt nie, *wann* man
zuletzt da war, nur *wie weit* man gekommen ist.

### 3.4 Entscheidungstabelle: gute vs. schädliche Mechanik

| Mechanik | Urteil | Psychologische Begründung |
|---|---|---|
| XP + Level, skill-gebunden | **Ja** | Kompetenz-Evidenz; Level mit realer Bedeutung verhindern Score-Fetisch |
| Sammeln von Artefakten/Beweisstücken | **Ja** | Endowment + sichtbare Meisterschaft; Sammlung ist real, nicht fiktiv |
| Lebens-Landkarte mit erschlossenen Gebieten | **Ja** | Fortschritt als Raum statt Zeit; kein Frequenzdruck |
| Freischaltbare Kosmetik (Themes, Klaro-Varianten) | **Ja, mit Regel** | Selbstausdruck (SDT-Autonomie); Regel: Basis-Personalisierung (inkl. freiem Farb-Picker aus r6) bleibt frei – Bestehendes wegzunehmen wäre Verlust-Framing. Freischaltbar sind *zusätzliche* Ausdrucks-Themes |
| Quests/Kapitel-Struktur | **Ja** | Zerlegung senkt Ambiguität (M3); Kapitel schließen = Zeigarnik-Spannung auflösen |
| Charaktererstellung statt Onboarding-Formular | **Ja** | Autonomie-Framing derselben Daten |
| Selbst konfigurierte Erinnerungen | **Ja (opt-in)** | Implementation Intentions wirken – aber nur selbstgewählt (sonst M1) |
| Echte Fristen anzeigen | **Ja, ruhig** | Realität gehört ins Produkt; immer mit „zu spät?"-Pfad (Kap. 2.4) |
| Streaks / Daily Rewards | **Nein** | Siehe 2.5 – Frequenzdruck, Verlustaversion |
| Leaderboards / Ranglisten | **Nein** | Scham-Verstärker (M4) |
| Zufallsbelohnung / Gacha | **Nein** | Konditionierung statt Kompetenz; Jugendschutz |
| Künstliche Countdown-Events | **Nein** | FOMO on top echter Fristen |
| Globaler Prozent-Fortschritt („Leben: 34 %") | **Nein** | Absurdes Framing, entmutigend; Leben ist kein Ladebalken – Gebiete ja, Gesamtprozent nein |

### 3.5 Nordstern-Metrik & Guardrails

- **Nordstern:** Anzahl realer Erledigungen (Level-2-Ereignisse) und
  **Zeit von „Aufgabe taucht auf" bis „real erledigt"**.
- **Wirkungs-Metrik:** Veränderung der Selbstwirksamkeits-Kurzskala
  (Kap. 2.3) über 8–12 Wochen – lokal berechnet, opt-in anonym aggregiert →
  das Kohorten-Dashboard aus Kapitel 5.
- **Guardrail:** Sessions/Tag wird beobachtet, aber nie optimiert. Alarm
  gilt dem umgekehrten Muster: hohe Nutzung bei niedriger Realwelt-
  Erledigung heißt, das Spiel frisst den Zweck – dann wird Mechanik
  entfernt, nicht hinzugefügt.

---

## 4. Design & Marke – drei Richtungen (Skizze, Vertiefung in r8)

### 4.1 Design-Brief (aus Kapitel 2/3 abgeleitet, nicht verhandelbar)

1. **Zwei Register in einer Marke:** ein spielerisch-warmes (Loop A) und ein
   ruhig-klares (Loop B / Krisen-Weiche). Der Wechsel muss sich wie eine
   Tonlage derselben Stimme anfühlen, nicht wie ein App-Wechsel.
2. **Nicht kindisch.** 16–21 reagiert allergisch auf Verniedlichung; die
   Referenz ist Games-/Streetwear-Ästhetik, nicht Grundschul-Lern-App.
3. **Selbstausdruck als Fläche:** Das Akzentfarben-System (r6) ist die
   technische Basis – die Marke muss eine Nutzerfarbe verkraften, ohne zu
   zerfallen.
4. **Maskottchen optional, Persönlichkeit Pflicht:** Wenn Klaro ein Körper
   wird, dann als Verbündeter mit eigener Haltung – nie als Clippy, der
   ungefragt aufpoppt.
5. **Ernstfähigkeit:** Ein Screen dieser Marke muss neben einem echten
   Behördenbrief bestehen können, ohne albern zu wirken.

### 4.2 Richtung A – „Expedition"

- **Welt:** Das Erwachsenenleben als unkartiertes Gelände. Skills =
  erschlossene Gebiete, Steckbriefe = Feldnotizen, die Sammlung = ein
  wachsendes Feldbuch. Die Lebens-Landkarte (3.3) ist hier wörtlich das
  Zuhause-Interface.
- **Charakter:** Kein Maskottchen-Körper. Klaro ist die Stimme im Funkgerät
  – trockener, erfahrener Guide. (Größte Klaro-Kontinuität.)
- **Farb-/Typo-Logik:** Papier-, Karten- und Terrain-Töne als Basis;
  die Nutzer-Akzentfarbe ist die „Expeditionsfarbe" (Route, Marker,
  Fortschritt). Grotesk für UI, Mono-Akzente für Instrumente/Daten.
- **Warum passend:** Exploration ist die reinste Autonomie-Metapher;
  „unkartiert" normalisiert Nichtwissen (M4) elegant – niemand schämt
  sich, eine Karte zu brauchen. Ruhiges Register trivial erreichbar
  (Karte wird still).
- **Risiko:** Kann erwachsen-brav geraten; braucht mutige Illustration,
  sonst Outdoor-Katalog.

### 4.3 Richtung B – „Werkstatt"

- **Welt:** Du baust dein Leben als Werkstück. Skills = Werkzeuge, die man
  meistert; Artefakte = gefertigte Teile im eigenen Regal; Level 1–3 =
  Lehrling/Geselle/Meister-Logik (kulturell verankert, sofort verständlich).
- **Charakter:** Klaro als schrullige Werkstatt-Kollegin – hilft, wenn man
  fragt, hat Werkzeug-Meinungen, sagt „hab ich auch erst verkackt".
- **Farb-/Typo-Logik:** warme Werkstatt-Neutrale (Holz, Metall, Papier),
  Nutzerakzent als Werkbank-/Werkzeugfarbe. Robuste Slab oder Grotesk mit
  mechanischen Details.
- **Warum passend:** Crafting ist die Kompetenz-Metapher – Selbstwirksamkeit
  wörtlich („selbst gemacht"). DIY-/Workshop-Ästhetik ist in der Zielgruppe
  anschlussfähig und geschlechtsneutral. Meister-Logik gibt den Leveln
  Würde statt Niedlichkeit.
- **Risiko:** Nähe zu Handwerks-Klischee/Azubi-Marketing; muss digital und
  jung interpretiert werden, nicht nostalgisch.

### 4.4 Richtung C – „Deine Stadt bei Nacht"

- **Welt:** Eine stilisierte Stadt im Dunkeln. Jede gemeisterte Aufgabe
  lässt ein Gebäude aufleuchten und macht es „deins": die Bank, das Amt,
  die erste eigene Wohnung. Fortschritt = die Stadt gehört dir zunehmend.
- **Charakter:** wählbarer Mini-Avatar + Klaro als Stadttier (z. B. eine
  unbeeindruckte Katze), das an neuen Orten schon wartet.
- **Farb-/Typo-Logik:** Dark-mode-first, dunkle Basis + Nutzerakzent als
  Neon-Lichtfarbe der Stadt (das r6-Farbsystem käme maximal zur Geltung).
  Display-Grotesk mit Gaming-Anleihen.
- **Warum passend:** RPG-Codes sind die Muttersprache der Zielgruppe;
  „die Stadt wird meine" ist die direkteste Kontroll-/Ownership-Metapher;
  Nutzungsrealität (abends, im Bett, Handy) wird ernst genommen.
- **Risiko:** höchstes Coolness-Potenzial, aber größte Gefahr von
  Game-Ästhetik ohne Substanz; das ruhige Register (Brief-Moment morgens
  am Küchentisch) ist in einer Neon-Nacht-Welt am schwersten glaubwürdig.

**Tendenz (ehrlich, aber in r8 zu entscheiden):** A oder B; B hat die
stärkste psychologische Passung (Kompetenz-Metapher), A die eleganteste
Normalisierung des Nichtwissens. C nur, wenn Fake-Door-Tests (Kap. 6.2, E2)
zeigen, dass die Zielgruppe auf die RPG-Codes deutlich stärker anspringt
und wir das Ruhe-Register-Problem gestalterisch lösen.

---

## 5. Monetarisierung ohne Provision (Skizze mit Empfehlung)

### 5.1 Prinzip

Die Zielgruppe hat wenig Geld und darf nicht Hauptzahler sein. Die vage
Idee „Optimierung (junge Leute?)" ist in dieser Form verworfen: Sobald
„optimierte junge Menschen" das Produkt sind, das ein Dritter kauft, sind
die Nutzer Gegenstand statt Kunde – das ist die Logik von
Überwachungssoftware und zerstört das Vertrauen, von dem alles andere
abhängt. **Umgebaut zu:** Institutionen zahlen für *Zugang* für ihre jungen
Leute und für *Wirkungsnachweis auf Kohortenebene* – anonym, aggregiert,
opt-in, mit Mindest-Zellgrößen. Niemals Einblick in Einzelpersonen; die
local-first-Architektur garantiert das technisch, nicht nur vertraglich.

### 5.2 Modelle im Kaltstart-Check

| Modell | Wer zahlt, wofür | Kaltstart-Tauglichkeit | Urteil |
|---|---|---|---|
| **Stiftungen / Förderprogramme** | Stiftung/Programm finanziert Entwicklung + kostenlosen Zugang (Kandidaten-Kategorien: Jugendhilfe-Digitalisierung, Bildung, Teilhabe – z. B. DKJS, Aktion Mensch; konkrete Programme in eigener Recherche-Runde prüfen) | **Hoch** – Anträge brauchen keine Kontakte, sondern Konzept + Wirkungslogik (haben wir jetzt) | **Phase 1** |
| **B2G: Jugendhilfe-Träger, Jugendämter, Kommunen** | Lizenz pro Einrichtung/Kommune (Jahres-Flatrate) für Zugang + Kohorten-Dashboard; rechtlicher Rahmen § 41/41a SGB VIII macht Verselbständigung zur Pflichtaufgabe | **Mittel** – lange Zyklen, braucht Referenzen und Wirkungsdaten; kalt nur als Discovery, nicht als Verkauf | **Phase 2–3, Kernmodell** |
| **Schulen / Schulsozialarbeit** | Land/Träger/Förderverein; Unterrichtsmaterial-Paket + Klassenlizenz | **Niedrig–mittel** – kleinste Budgets, längste Wege; aber gute Sichtbarkeit | Später, über Projektmittel |
| **Krankenkassen (Präventions-/Gesundheitskompetenz-Budgets, § 20 SGB V)** | Kasse finanziert Zugang als Präventionsleistung (rechtliche Passung prüfen) | Mittel | **Prüfen** in Phase 2 – Vorsicht: Neutralität bei gleichzeitigem Krankenkassen-Vergleich in der App sauber trennen |
| **Freemium (Kosmetik/Komfort)** | Nutzer zahlen freiwillig kleine Beträge für zusätzliche Ausdrucks-Themes, nie für Fortschritt (Kap. 2.5) | Hoch, aber kleiner Erlös | Nebenerlös + Preisbereitschafts-Signal, nie Fundament |
| **White-Label für Träger/Bundesländer** | Institution kauft angepasste Instanz | Niedrig (setzt Kernprodukt + Referenzen voraus) | Skalierungspfad ab Phase 3 |
| **Sponsoring / Werbung** | Marken zahlen für Nähe zur Zielgruppe | Hoch verfügbar – aber vergiftet die Neutralität, die unser B2G-Kernasset ist | **Verworfen** (höchstens ungebrandete Projektförderung ohne jede Produktnähe) |

### 5.3 Empfohlener Pfad (Kaltstart)

1. **Phase 1 (jetzt–12 Monate): Förderung statt Umsatz.** 2–3 Förderanträge
   auf Basis der Wirkungslogik aus Kapitel 2/3; parallel Wettbewerbe/Preise
   (Sichtbarkeit + Legitimität). Die App bleibt für Endnutzer komplett
   kostenlos.
2. **Phase 2: Piloten gegen Daten statt Geld.** 2–3 Jugendhilfe-Träger
   nutzen die App kostenlos und liefern dafür strukturiertes Feedback +
   anonyme Wirkungsdaten + Referenz. Kaltakquise dafür beginnt schon in
   Phase 1 als Discovery (Kap. 6.2, E4) – Träger-Gespräche sind zugleich
   Produktforschung.
3. **Phase 3: B2G-Lizenzen.** Jahres-Flatrate pro Einrichtung/Kommune;
   Verkaufsargumente: Wirkungsdaten aus den Piloten, Provisionsfreiheit,
   Datenschutz durch Architektur. Freemium-Kosmetik läuft als Nebenerlös.

### 5.4 Wirkungsnachweis-Produkt (das, was „Optimierung" ersetzt)

Ein Kohorten-Dashboard für zahlende Institutionen: aggregierte, anonyme
Kennzahlen (aktivierte Zugänge, erschlossene Skill-Gebiete, Realwelt-
Erledigungen, Selbstwirksamkeits-Delta) – nur mit Opt-in der Nutzer, nur ab
Mindest-Kohortengröße, ohne jede Einzelansicht. Die Betreuerin sieht „von
euren 40 Jugendlichen haben 28 die Krankenkassen-Frage geklärt", nie „Lea
hat nichts gemacht". Das ist verkaufbar, ehrlich und schützt die Nutzer.

---

## 6. Roadmap (Skizze)

### 6.1 Riskanteste Annahmen (absteigend nach Sprengkraft)

- **A1:** Die Zielgruppe öffnet die App **im Angst-Moment** (Loop B) – nicht
  nur in motivierten Momenten. (Wenn falsch: wir sind ein Nice-to-have.)
- **A2:** Das Skill-/Spiel-Framing motiviert real stärker als das heutige
  To-do-Framing. (Wenn falsch: der Pivot ist Kosmetik.)
- **A3:** Eine Stiftung fördert bzw. ein Träger will das Kohorten-Modell.
  (Wenn falsch: kein Geschäftsmodell ohne Provision.)
- **A4:** Retention funktioniert ohne Streak-/Push-Druck. (Wenn falsch:
  Zielkonflikt zwischen Ethik-Leitplanken und Überleben – dann lieber
  Vertriebsweg über Institutionen als Dark Patterns.)
- **A5:** Zwei Register in einer Marke funktionieren gestalterisch. (Wenn
  falsch: Loop B braucht eine eigene, nüchterne Oberfläche.)

### 6.2 Experimente vor dem Bauen (klein, billig, vor r9)

- **E1 „Brief-Test" (testet A1):** Landingpage/Insta-Kanal: „Schick uns den
  Brief, den du nicht verstehst – wir erklären ihn dir in 24 h, kostenlos."
  Wizard-of-Oz: wir antworten manuell mit dem Loop-B-Format. Misst, ob der
  Angst-Moment Nachfrage erzeugt, und liefert echte Brief-Beispiele als
  Content-Rohstoff.
- **E2 Fake-Door-A/B (testet A2, A5, Richtungswahl):** zwei bis drei
  Landingpages mit identischem Angebot, unterschiedlichem Framing
  (Skill-Game vs. ruhige Hilfe; ggf. Richtung A/B/C-Moodboards) →
  Warteliste als Messgröße.
- **E3 Papier-Prototyp Core Loop (testet A2):** Loop A als klickbarer
  Dummy/Papier mit 5–8 Personen aus der Zielgruppe, davon 1–2 Care Leaver
  (Zugang über Careleaver-Initiativen/lokale Träger – bewusst auch als
  erster B2G-Kontaktaufbau).
- **E4 Träger-Discovery (testet A3):** 3–5 Kaltgespräche mit
  Jugendhilfe-Trägern – ausdrücklich Forschung, kein Verkauf: Wie
  verselbständigen sie heute? Was fehlt? Was dürfte ein Werkzeug kosten?
- **E5 Förder-Scan (testet A3):** systematische Liste passender Programme
  mit Fristen und Passung; daraus 2 Anträge.

### 6.3 MVP-Schnitt (r9, nach r8-Design)

- **Ein Skill-Gebiet komplett im neuen Loop:** Kandidat „Krankenkasse &
  Gesundheit" (existiert inhaltlich inkl. Bedarfscheck seit r6, betrifft
  jeden ab 18, hat echte Briefe → Loop B andockbar). Alternative „Erste
  Wohnung" ist emotionaler, aber größer – Entscheidung in r8 anhand E1-Daten.
- **Loop B (Panik-Pfad)** für die häufigsten 5–10 Briefarten, notfalls
  redaktionell statt automatisch beantwortet.
- **Meisterschaft Level 1–2**, Sammlung, Landkarte nur für das eine Gebiet.
- **Nicht im MVP:** Community/Vignetten, Level 3, Kohorten-Dashboard
  (nur Datenmodell dafür vorbereiten: Opt-in-Flag + lokale Aggregation).

### 6.4 Entscheidungskriterien Codebasis (bewusst offen, Entscheid nach r8)

**Behalten und umbauen, wenn:** die gewählte Design-Richtung mit dem
vorhandenen Token-/Theming-System (r6) umsetzbar ist; die Loop als Schicht
über dem bestehenden Datenmodell (Journeys/Tasks/Bedarf) modellierbar ist;
PWA als Plattform reicht (kein Store-Zwang, kein System-Push nötig).

**Greenfield (nur UI-Schicht), wenn:** die Welt-Darstellung
(Landkarte/Stadt, Animationen) React-DOM sprengt oder das neue
Navigationsmodell (Landkarte statt Listen) die bestehenden Routen/Seiten
obsolet macht.

**In jedem Fall bleiben:** Inhalte (`src/data/`), Bedarfslogik, Fakten-
Disziplin, Datenhoheits-Mechanik. Ehrliche Tendenz: **Engine behalten,
Karosserie je nach r8 neu** – ein voller Greenfield inklusive Datenmodell
wäre Verschwendung von sechs Runden Arbeit.

### 6.5 Rundenplan

1. **Parallel ab sofort:** E1–E5 (kosten fast nichts, liefern Daten für alles Weitere).
2. **r8 – Design-Deep-Dive:** eine Markenrichtung ausarbeiten (Moodboard, Klaro-Charakter, Register-Wechsel-Prototyp, Token-Mapping); Codebasis-Entscheid.
3. **r9 – MVP-Umbau:** Kap. 6.3, gegen die Ethik-Leitplanken (2.5) reviewt.
4. **Laufend:** Förder-/Discovery-Track (5.3 Phase 1→2).

### Offene Fragen (ehrlich, weil nicht aus dem Schreibtisch beantwortbar)

- Öffnet die Zielgruppe im Brief-Moment überhaupt *irgendeine* App – oder
  gewinnt TikTok/Google? (E1 beantwortet das teilweise; sonst braucht Loop B
  einen anderen Kanal, z. B. WhatsApp-Einstieg.)
- Wie viel „Spiel" verträgt der B2G-Einkäufer? (Jugendamts-Entscheider
  könnten Gamification als unseriös lesen – E4 muss das Wording testen:
  „Selbstwirksamkeits-Training" verkauft vielleicht besser als „Spiel".)
- Rechtliche Passung § 20 SGB V für Krankenkassen-Finanzierung (Kap. 5.2)
  und die Neutralitäts-Trennung dabei.
