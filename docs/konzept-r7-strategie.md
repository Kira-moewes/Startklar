# Startklar – Konzept Runde 7: Strategie

**Thema:** Pivot vom Werkzeug zum Spiel der Selbstwirksamkeit – schlanke Consumer-App: psychologisches Fundament, Gamification-Engine, Was-echt-hilft, Markenrichtungen, Monetarisierung (Pro-Version statt Provision), Roadmap
**Status:** Strategie beschlossen – Grundlage für r8 (Design-Deep-Dive) und r9 (MVP-Umbau) · **Stand:** Juli 2026

Anders als r3–r6 ist dies keine Umsetzungsrunde, sondern die Strategieschicht
darüber. **Kapitel 0 setzt den Rahmen** (schlanke Consumer-App, Pro-Version,
kein Affiliate); Kapitel 2 und 3 (Fundament + Core Loop) sind tief
ausgearbeitet und entscheidungsreif; Kapitel 4–6 (Marke, was echt hilft,
Monetarisierung, Roadmap) sind Skizzen mit klarer Empfehlung für r8/r9.

**Getroffene Entscheidungen (Kira, abgefragt):**

- **Codebasis:** wird *nach* der Strategie entschieden → Kap. 6.4 liefert die Kriterien, keine Vorfestlegung.
- **Kern-Persona:** 16–21 breit (Schulabgänger, Azubis, Erstauszieher) + **Care-Leaver-Stresstest** für jedes Feature.
- **Ausrichtung & Erlös:** siehe Kapitel 0 – schlanke Consumer-App, Pro-Version statt Provision.
- **Tiefenstaffelung:** Fundament + Core Loop zuerst, Rest als begründete Skizze.

---

## 0. Kurskorrektur: schlanke Consumer-App (überschreibt frühere B2G-Lastigkeit)

Eine frühere Fassung dieser Runde hat ein B2G-Vertriebsmodell (Jugendämter,
Förderanträge, Kohorten-Dashboards) in den Mittelpunkt gestellt. Das war
Overengineering für das, was startklar sein soll. **Entscheidung (Kira):**
startklar ist eine **schlanke Consumer-App**, deren Kern das Spielgefühl beim
Abhaken echter Erwachsen-To-dos ist – kein Behörden-Vertriebsprojekt.

Was das konkret festlegt (und was in Kap. 5/6 unten ausgeführt ist):

- **Erlösmodell:** eine **Pro-/Bezahlversion** (Kosmetik + Komfort) als Haupt-
  und einzige *aktiv verfolgte* Quelle. Die eigentliche Hilfe bleibt immer
  gratis (harte Paywall-Grenze, Kap. 5.1).
- **Kein Affiliate, keine Werbung, keine Provision.** Bewusste Entscheidung
  (Begründung Kap. 5.3). Positiver Nebeneffekt: der neutrale Anbieter-Vergleich
  aus r4–r6 bleibt glaubwürdig – Neutralität ist jetzt Prinzip, nicht
  Verkaufsargument.
- **Förder-Tür bleibt offen, wird aber nicht gebaut.** Das Datenmodell bleibt
  local-first und neutral, sodass später *gesponserter Zugang* durch eine
  Stiftung/Kasse möglich ist (Kap. 5.4) – ohne dass wir jetzt einen Vertrieb
  aufbauen.

**Was aus den früheren Kapiteln gültig bleibt:** Kapitel 1–4 (psychologisches
Fundament, SDT, Care-Leaver-Schutz, Anti-Dark-Pattern-Leitplanken, Core Loop)
sind nicht B2G-spezifisch, sondern genau das Fundament dieser App – sie stehen
unverändert. Nur Monetarisierung (Kap. 5) und Roadmap (Kap. 6) sind auf die
schlanke Consumer-Ausrichtung korrigiert, und ein neues Kapitel 4b macht
explizit, was Nutzern *wirklich* hilft und wie oft die App realistisch genutzt
wird.

> Hinweis zur Lesart: Wo frühere Passagen (z. B. in Kap. 1.4) B2G/Kohorten als
> „Kernmodell" bezeichnen, gilt stattdessen dieses Kapitel 0. Solche Modelle
> sind auf „später möglich, nicht aktiv" herabgestuft.

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
  (Kap. 2.3) über 8–12 Wochen – lokal berechnet; die opt-in-anonyme
  Aggregation ist nur für einen späteren gesponserten Zugang vorbereitet
  (Kap. 5.4), nicht Kern des Consumer-Produkts.
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

## 4b. Was echt hilft – und wie oft die App genutzt wird

### 4b.1 Die unbequeme Wahrheit: seltene Nutzung, hoher Einsatz

startklar ist keine Daily-Habit-App. Man richtet seine Krankenkasse *einmal*
ein, zieht *einmal* um, klärt *einmal* die Steuer-ID. Die Aufgaben sind
**episodisch**, nicht täglich. Zwei Konsequenzen:

1. **Streaks & Daily-Engagement-Tricks passen nicht** – nicht nur ethisch
   verboten (Kap. 2.5), sondern am realen Nutzungsrhythmus vorbei. Wer aus
   einer Behörden-App eine Daily-App zwingt, verliert.
2. **Der Erfolgsmaßstab ist nicht DAU.** Erfolg heißt: *wird geöffnet, wenn
   ein angsteinflößender Brief kommt* + *wird weiterempfohlen*. Danach wird
   gebaut und gemessen (Kap. 3.5, 6.1).

### 4b.2 Was Nutzern wirklich hilft (absteigend nach Wert)

1. **Der Brief-Entschlüsseler (Panik-Moment) – der Kern.** „Ich hab Post und
   versteh sie nicht" → *Was ist das, ist es ein Notfall (meist nein), bis
   wann, erster Schritt in 2 Minuten.* Ein **Schmerzmittel, kein Vitamin**:
   echter, dringender, wiederkehrender (Briefe hören nie auf) Bedarf. Das ist
   der eine Grund, die App nicht zu löschen. In Kap. 3.2 als „Loop B" geführt –
   ab jetzt der MVP-Kern, nicht das Nebenfeature.
2. **Angst-Runterfahren auf Abruf** – der eine Satz Einordnung (was, wie
   lange, was ist das Schlimmste), den kein Behörden-PDF liefert.
3. **Fristen-Gedächtnis** – die App merkt sich die Deadline, damit der Nutzer
   es nicht muss; selbst eingerichtet, kein ungefragter Push (Autonomie, M1).
4. **Vorausgefüllte Artefakte & Skripte** – der Steckbrief zum Mitnehmen,
   „genau das sagst du am Telefon", „genau diese Unterlagen bringst du mit".
   Der Wert ist nicht Information, sondern **die Aktivierungsenergie des
   nächsten realen Schritts senken**.
5. **„Mach's allein"-Skripte** – die wortwörtliche Formulierung fürs
   Amtstelefonat, für alle ohne Eltern zum Fragen (Care Leaver, aber nicht
   nur). Das Wertvollste und am wenigsten Angebotene.
6. **Fortschritt, der sich wie echte Kompetenz anfühlt** – die „Das kann ich
   jetzt"-Sammlung (Kap. 3.3). Macht das Erledigte behaltens- und teilenswert.

### 4b.3 Was *nicht* hilft (bewusst weglassen)

- Generische Finanzbildungs-/Ratgeber-Inhalte – gibt es tausendfach, kein
  Grund für *unsere* App.
- Streaks / Daily Rewards – falscher Rhythmus + Kap. 2.5.
- Breite statt Tiefe – lieber 1–2 Themen exzellent als 20 halbgar.

### 4b.4 Kernsatz, der Nutzen und Geld verbindet

Was die App für die Nutzer wertvoll macht – ein Schmerzmittel für einen
verletzlichen jungen Kohorten im Angst-Moment – ist *exakt* das, was eine
Stiftung oder Krankenkasse später finanzieren würde. **Nutzer-Wert =
förderbarer Wert.** Genau deshalb war Affiliate falsch: es wäre
Wert-*Extraktion* gewesen, die gegen das Vertrauen arbeitet. Es den Nutzern
recht zu machen, *ist* hier die Geld-Strategie.

---

## 5. Monetarisierung: Pro-Version statt Provision

### 5.1 Prinzip: Nutzer zahlt für Ausdruck, nie für Hilfe

Die Zielgruppe hat wenig Geld und darf nicht *gezwungen* werden zu zahlen.
Deshalb die harte Grenze: **Die eigentliche Hilfe ist immer gratis** – alle
To-dos, Anleitungen, Bedarfschecks, das Fristen-Gedächtnis und der
Brief-Entschlüsseler (Kap. 4b.2). Bezahlt wird ausschließlich freiwillig für
**Selbstausdruck und Komfort**. Und die verworfene Idee „Optimierung junger
Leute" bleibt verworfen: Nutzer sind nie das Produkt, das ein Dritter kauft.

### 5.2 Die Pro-Version (Haupt- und einzige aktiv verfolgte Quelle)

Ein optionaler Kauf, der **Kosmetik + Komfort** freischaltet:

- **Kosmetik:** zusätzliche Maskottchen-Varianten/Outfits, Themes, weitere
  Farbwelten. Reiner Selbstausdruck (SDT-Autonomie, Kap. 2.2) – der Erlös
  ist mit dem Produktziel deckungsgleich: Nutzer zahlen, *weil es Spaß macht*,
  nicht weil wir sie irgendwohin geleitet haben.
- **Komfort:** z. B. erweiterte Export-/Druck-Extras, mehr Personalisierung.

**Feste Regeln (aus Kap. 2.5 und 3.4):**

- **Kein Pay-to-win, keine Verlust-Mechanik.** Nichts, das Fähigkeit oder
  Fortschritt hinter Zahlung legt.
- **Bestehendes bleibt gratis.** Der freie Farb-Picker aus r6 bleibt frei;
  Pro fügt *zusätzliche* Ausdrucks-Sets hinzu, nimmt nichts weg (sonst
  Verlust-Framing).
- **Form offen:** Einmalkauf vs. billiges Abo wird in r8/r9 entschieden – für
  eine seltene-Nutzung-App (Kap. 4b.1) spricht viel für den **Einmalkauf**
  (ein ehrlicher Kaufmoment statt Abo-Druck auf eine App, die man selten
  öffnet).

Ehrliche Erwartung: Bei einer kleinen App mit seltener Nutzung ist die
Konversion frei→zahlend klein (Größenordnung 1–3 %). Pro deckt Hosting plus
ein bisschen – es ist saubere, kleine Einnahme, kein Geschäftsmodell für sich.
Das ist bewusst so gewählt.

### 5.3 Warum kein Affiliate (bewusste Entscheidung)

Affiliate-/Provisionslinks im Vergleich wären naheliegend, sind aber
verworfen – aus drei Gründen:

1. **Ökonomie.** Die Zielgruppe ist jung und klamm; die relevanten Aktionen
   (Girokonto, Strom, Haftpflicht) sind seltene Einmal-Events mit dünner
   Provision. Realistisch < 1–2 € pro Nutzer über die gesamte App-Lebenszeit.
   Um damit spürbar Geld zu verdienen, bräuchte es zehntausende konvertierende
   Nutzer – also genau das „riesig große Projekt", das wir nicht wollen.
2. **Incentive-Korruption.** Sobald ein Link Geld bringt, kippt der
   App-Anreiz leise von „bring dich fertig" zu „route dich zu einem
   Abschluss". Das untergräbt den Kern (Kap. 3.5-Guardrail).
3. **Minderjährige + Finanzprodukte.** Provisionswerbung für Konten/Kredite
   an teils Minderjährige ist rechtlich und moralisch heikel.

**Positiver Nebeneffekt:** Der neutrale Anbieter-Vergleich aus r4–r6 („nennt
Anbieter, bewertet nicht, keine Provision, keine Links") bleibt vollständig
glaubwürdig. Neutralität ist damit ein echtes Prinzip, kein Marketing.
Ebenso verworfen: **Werbung** (korrumpiert, schlecht bei Minderjährigen,
wertlos bei seltener Nutzung).

### 5.4 Gesponserter Zugang (warm gehalten, nicht aktiv verfolgt)

Die eine Geld-Alternative neben Pro, die es sich lohnt offenzuhalten – in
schlanker Form, ohne Vertriebsapparat: Eine **Stiftung, eine Krankenkasse
(Präventionsbudget, § 20 SGB V), eine Sparkassen- oder Stadtwerke-Stiftung**
finanziert freien (Pro-)Zugang für eine Region oder Kohorte. *Ein* solcher
Deal kann mehr bringen als tausende Pro-Käufe – und die App bleibt gratis für
die, die nicht zahlen können. Das ist die schlanke, förder-artige Version von
B2G, kein Enterprise-Sales.

Damit das später möglich ist, verbauen wir jetzt zwei Dinge architektonisch
*nicht*: die **local-first-Datenhoheit** und die Option einer **opt-in,
anonymen, aggregierten** Wirkungsmessung (Selbstwirksamkeits-Delta, Kap. 2.3)
ab Mindest-Kohortengröße – niemals Einzelansicht. Gebaut wird das erst, wenn
ein konkreter Sponsor es braucht.

**Nebenquellen (marginal, null Korruption):** ein „Unterstützer"-/Pay-what-
you-want-Button; Förderpreise/Wettbewerbe als nicht-verwässernder Anschub
fürs Bauen. **Später möglich, jetzt nicht:** Maskottchen-Merch (nebenbei
Marketing), White-Label an Kasse/Verlag (setzt fertiges Produkt voraus).

> Das frühere Kohorten-Dashboard-/B2G-Lizenzmodell lebt hier als „später
> möglich" weiter, ist aber ausdrücklich nicht das Kernmodell (siehe Kap. 0).

---

## 6. Roadmap (Skizze)

### 6.1 Riskanteste Annahmen (absteigend nach Sprengkraft)

- **A1:** Die Zielgruppe öffnet die App **im Angst-Moment** (Brief-Pfad,
  Kap. 4b.2) – nicht nur in motivierten Momenten. (Wenn falsch: wir sind ein
  Nice-to-have.)
- **A2:** Das Spielgefühl beim Abhaken treibt **echtes Erledigen**, nicht nur
  Nutzungszeit. (Wenn falsch: der Pivot ist Kosmetik ohne Wirkung.)
- **A3:** Es gibt eine tragfähige Einnahme – jemand zahlt für Pro-Kosmetik
  bzw. (später) eine Stiftung/Kasse finanziert gesponserten Zugang. (Wenn
  falsch: bleibt Passionsprojekt statt selbsttragend – bewusst akzeptabel,
  aber gut zu wissen.)
- **A4:** Retention funktioniert ohne Streak-/Push-Druck – getragen vom
  wiederkehrenden Angst-Moment, nicht von Daily Habits (Kap. 4b.1). (Wenn
  falsch: der Wiederkommens-Grund fehlt – dann Kanal überdenken, nie Dark
  Patterns.)
- **A5:** Zwei Register in einer Marke funktionieren gestalterisch. (Wenn
  falsch: der Brief-Pfad braucht eine eigene, nüchterne Oberfläche.)

### 6.2 Experimente vor dem Bauen (klein, billig, vor r9)

- **E1 „Brief-Test" (testet A1) – das wichtigste Experiment:** Landingpage/
  Insta-Kanal: „Schick uns den Brief, den du nicht verstehst – wir erklären
  ihn dir in 24 h, kostenlos." Wizard-of-Oz: wir antworten manuell im
  Brief-Pfad-Format. Misst, ob der Angst-Moment echte Nachfrage erzeugt, und
  liefert echte Brief-Beispiele als Content-Rohstoff.
- **E2 Fake-Door-A/B (testet A2, A5, Richtungswahl):** zwei bis drei
  Landingpages mit identischem Angebot, unterschiedlichem Framing
  (Skill-Game vs. ruhige Hilfe; ggf. Richtung A/B/C-Moodboards) →
  Warteliste als Messgröße.
- **E3 Papier-Prototyp Core Loop (testet A2):** Loop A als klickbarer
  Dummy/Papier mit 5–8 Personen aus der Zielgruppe, davon 1–2 Care Leaver
  (Zugang über Careleaver-Initiativen).
- **E4 Preisbereitschaft Pro (testet A3):** im Prototyp/Fake-Door ein
  „Pro"-Angebot einblenden (Preis + Inhalte) und Klick-/Kaufabsicht messen –
  bevor irgendein Bezahlsystem gebaut wird.
- *(Optional/später)* **Gesponserter-Zugang-Sondierung:** 2–3 lockere
  Gespräche mit Stiftung/Kasse/kommunaler Stelle – erst, wenn ein Prototyp
  existiert. Ausdrücklich kein Vertriebsaufbau jetzt.

### 6.3 MVP-Schnitt (r9, nach r8-Design)

- **Der Brief-Entschlüsseler (Panik-Pfad) als Kern** – für die häufigsten
  5–10 Briefarten, notfalls redaktionell/manuell hinter den Kulissen statt
  automatisch. Das ist das Feature, das die App unlöschbar macht (Kap. 4b.2).
- **Ein Skill-Gebiet komplett im Core Loop:** Kandidat „Krankenkasse &
  Gesundheit" (existiert inhaltlich inkl. Bedarfscheck seit r6, betrifft jeden
  ab 18, hat echte Briefe → docken direkt an den Brief-Pfad an). Alternative
  „Erste Wohnung" emotionaler, aber größer – Entscheidung in r8 anhand E1.
- **Meisterschaft Level 1–2**, Sammlung, Landkarte nur für das eine Gebiet.
- **Ein Pro-Kosmetik-Slot** (mind. ein freischalt-/kaufbares Set), um die
  Bezahl-Mechanik früh real zu testen – ohne Funktion zu verstecken (Kap. 5.2).
- **Nicht im MVP:** Community/Vignetten, Level 3, Wirkungsmessung/Dashboard
  (nur neutral vorbereiten: Opt-in-Flag + lokale Aggregation als spätere
  Option, Kap. 5.4).

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

1. **Parallel ab sofort:** E1–E4 (kosten fast nichts, liefern Daten für alles Weitere); E1 „Brief-Test" zuerst.
2. **r8 – Design-Deep-Dive:** eine Markenrichtung ausarbeiten (Moodboard, Klaro-Charakter, Register-Wechsel-Prototyp, Token-Mapping); Codebasis-Entscheid.
3. **r9 – MVP-Umbau:** Kap. 6.3, gegen die Ethik-Leitplanken (2.5) reviewt.
4. **Später, nur wenn sinnvoll:** gesponserter Zugang sondieren (5.4) – kein aktiver Track jetzt.

### Offene Fragen (ehrlich, weil nicht aus dem Schreibtisch beantwortbar)

- Öffnet die Zielgruppe im Brief-Moment überhaupt *irgendeine* App – oder
  gewinnt TikTok/Google? (E1 beantwortet das teilweise; sonst braucht der
  Brief-Pfad einen anderen Kanal, z. B. WhatsApp-Einstieg.)
- Zahlt jemand für reine Kosmetik/Komfort, wenn die Hilfe gratis ist – und
  in welcher Form (Einmalkauf vs. Abo)? (E4 gibt ein erstes Signal.)
- Rechtliche Passung § 20 SGB V für eine spätere Krankenkassen-Finanzierung
  (Kap. 5.4) und die Neutralitäts-Trennung dabei.
