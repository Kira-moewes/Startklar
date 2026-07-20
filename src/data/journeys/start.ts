import type { Journey } from '../types'

export const startJourney: Journey = {
  id: 'start',
  title: 'Volljährig & startklar',
  subtitle: 'Mit 18 Jahren starten: Rechte, Gesundheit und erste Schritte.',
  tasks: [
    {
      id: 'rechte-ab-18',
      title: 'Was du ab 18 darfst — deine neuen Rechte',
      summary: 'Mit der Volljährigkeit ändert sich einiges: Du kannst Verträge unterschreiben, wählen und vieles selbst entscheiden.',
      steps: [
        'Du darfst jetzt Verträge (Wohnung, Handy, Versicherung) eigenhändig unterschreiben — sei aber nicht zu voreilig, lies immer.',
        'Du kannst wählen und dich politisch betätigen — das ist ein wichtiges Recht.',
        'Du kannst Vollmachten erteilen und entgegennehmen, z. B. um Ärzte die Einsicht in deine Unterlagen zu erlauben.',
        'Aber: Mit mehr Rechten kommt auch mehr Verantwortung — achte darauf, dass du verstehst, was du unterschreibst.'
      ],
      deadline: 'Informativ',
      consequence: 'Wenn du diese Rechte nicht nutzt, geht dir viel verloren — sie sind deine, um dein Leben zu gestalten.',
      category: 'recht'
    },
    {
      id: 'ausweis',
      title: 'Personalausweis oder Reisepass beantragen/erneuern',
      summary: 'Ein Ausweis ist überall wichtig — ob für die Bank, die Behörde oder auf Reisen. Kümmere dich darum.',
      steps: [
        'Prüfe, ob dein Ausweis noch gültig ist oder bald abläuft.',
        'Gehe zum Bürgeramt oder beantrage online, wenn deine Stadt das anbietet.',
        'Mitnahmen: Personalausweis (falls Erneuerung), Reisepass, Geburtsurkunde oder Pass.',
        'Rechne mit Gebühren von {BETRAG_PERSO} — das ist gesetzlich festgelegt.'
      ],
      deadline: 'Zeitnah, bevor der alte Ausweis abläuft',
      consequence: 'Ohne gültigen Ausweis hast du später Probleme — bei der Bank, beim Reisen oder bei Behörden. Eine rechtzeitige Beantragung erspart dir Stress.',
      category: 'amt',
      faktenKeys: ['BETRAG_PERSO'],
      hilfen: [
        { label: 'Personalausweis – Infos & Gebühren', url: 'https://www.personalausweisportal.de/' },
        { label: 'Zuständiges Amt finden', url: 'https://verwaltung.bund.de/' },
      ]
    },
    {
      id: 'wahlrecht',
      title: 'Wie und wo du wählst — dein Wahlrecht nutzen',
      summary: 'Mit 18 Jahren darfst du dich an Wahlen beteiligen. So funktioniert es.',
      steps: [
        'Du erhältst per Post eine Wahlbenachrichtigung — lies sie aufmerksam durch und merke dir den Wahltag.',
        'Du kannst am Wahltag in deinem Wahllokal abstimmen oder per Briefwahl im Voraus wählen.',
        'Für Briefwahl: Beantrage diese frühzeitig bei deiner Gemeinde, dann erhältst du die Unterlagen nach Hause.',
        'Wichtig: Deine Wahlentscheidung ist geheim und persönlich — niemand darf sie beeinflussen oder kontrollieren.'
      ],
      deadline: 'Zu den Wahlterminen',
      consequence: 'Wenn du nicht wählst, verpasst du die Gelegenheit, Politik mitzugestalten — das ist zwar deine freie Wahl, aber deine Stimme zählt.',
      category: 'recht',
      hilfen: [{ label: 'Bundeswahlleiterin', url: 'https://www.bundeswahlleiterin.de/' }]
    },
    {
      id: 'vertraege',
      title: 'Verträge verstehen — worauf du achten solltest',
      summary: 'Jetzt darfst du Verträge unterschreiben. Lerne, worauf du achten musst — bevor es teuer wird.',
      steps: [
        'Lies Verträge immer komplett durch, bevor du unterschreibst — auch wenn es mühsam ist.',
        'Achte auf: Laufzeit (wie lange bindet dich der Vertrag?), Kündigungsfrist ({FRIST_WIDERRUF} kann auch für Widerruf gelten), Gebühren und Nebenbedingungen.',
        'Wenn etwas unklar ist, frage nach oder hole dir Rat (Familie, Freunde, Verbraucherzentrale).',
        'Merke: Du kannst einen Vertrag unterschreiben und — unter Bedingungen — auch wieder kündigen. Kenne die Fristen und Bedingungen.'
      ],
      deadline: 'Vor jedem Vertragsabschluss',
      consequence: 'Wenn du nicht aufpasst, bindest du dich unter Umständen lange fest oder zahlst überraschend viel — eine kurze Prüfung erspart dir das.',
      category: 'recht',
      faktenKeys: ['FRIST_WIDERRUF']
    },
    {
      id: 'krankenkasse-check',
      title: 'Familienversicherung oder eigene Krankenkasse?',
      summary: 'Mit 18 Jahren musst du prüfen, ob dich deine Familie noch mitversichert oder ob du dich selbst anmelden musst.',
      steps: [
        'Frage deine Eltern oder deinen Versicherer: Bin ich noch familienversichert?',
        'Die Familienversicherung gilt bis 25, solange du in Ausbildung oder Studium bist – ohne Ausbildung nur bis 23. Und nur, wenn du kein oder wenig Einkommen (z. B. Minijob) hast.',
        'Wenn du mit Familienversicherung einen Job mit zu viel Einkommen annimmst, musst du dich selbst anmelden.',
        'Prüfe die Frist {FRIST_FAMILIENVERSICHERUNG} — nach Ablauf brauchst du einen eigenen Krankenversicherungsschutz.'
      ],
      deadline: 'Vor Beendigung der Familienversicherung',
      consequence: 'Wenn du dich nicht rechtzeitig selbst anmeldest, hast du keinen Krankenversicherungsschutz — das ist ein großes Problem.',
      category: 'gesundheit',
      faktenKeys: ['FRIST_FAMILIENVERSICHERUNG']
    },
    {
      id: 'krankenkassen-wechsel',
      title: 'Krankenversicherung wechseln — wann und wie?',
      summary: 'Mit deiner eigenen Versicherung darfst du auch wechseln. Hier erfährst du, wann es sinnvoll ist.',
      steps: [
        'Du kannst die Krankenkasse wechseln, wenn die Frist {FRIST_KK_WECHSEL} vorbei ist und du dich bei einer anderen besser aufgehoben fühlst.',
        'Vergleiche zwei bis drei Kassen nach Leistungen, Zusatzbeiträgen und Service — kleine Unterschiede zählen sich im Jahr auf.',
        'Kündige die alte Kasse schriftlich mit der richtigen Frist; die neue kümmert sich oft um die Formalitäten.',
        'Ein Wechsel ist einfach und kostet nichts — lass dich nicht von deiner alten Kasse überreden, wenn du gehen möchtest.'
      ],
      deadline: 'Nach Wartefrist, wenn du wechseln möchtest',
      consequence: 'Wenn du nicht wechselst, zahlst du vielleicht unnötig viel — ein Vergleich lohnt sich aber erst nach der Frist.',
      category: 'gesundheit',
      faktenKeys: ['FRIST_KK_WECHSEL']
    },
    {
      id: 'organspende',
      title: 'Organspendeausweis — deine Entscheidung dokumentieren',
      summary: 'Mit 18 Jahren kannst du selbst entscheiden, ob du Organe spenden möchtest. Halte deine Entscheidung fest.',
      steps: [
        'In Deutschland ist Organspende unentgeltlich — es geht nicht um Geld, sondern um deine dokumentierte Entscheidung.',
        'Du darfst selbst entscheiden: Ja, ich möchte spenden; Nein, das möchte ich nicht; oder: Entscheidung den Angehörigen überlassen.',
        'Besorge dir einen kostenlosen Organspendeausweis beim Arzt, in der Apotheke oder online. Fülle ihn aus und trage ihn immer bei dir.',
        'Du kannst deine Entscheidung jederzeit ändern — zerreiße deinen alten Ausweis und besorge dir einen neuen.'
      ],
      deadline: 'Jederzeit — eine bewusste Entscheidung ist wichtig',
      consequence: 'Ohne Ausweis müssen im Ernstfall deine Angehörigen rätseln, was du wolltest — ein Ausweis gibt ihnen Klarheit.',
      category: 'gesundheit',
      hilfen: [{ label: 'Organspende-Register', url: 'https://www.organspende-register.de/' }]
    },
    {
      id: 'blut-plasmaspende',
      title: 'Blut und Plasma spenden — helfen und verdienen',
      summary: 'Mit 18 Jahren kannst du Blut oder Plasma spenden. Das hilft Patienten — und bei Plasma gibt es oft Geld dafür.',
      steps: [
        'DRK-Blutspende: Ein bis zwei Stunden Zeit, unkompliziert, meist ohne Vergütung (aber kostenlos verpflegt).',
        'Plasma-Spenden: Ähnlicher Ablauf wie Blutspende, aber länger (bis vier Stunden). Bei Plasmaspende gibt es oft eine Aufwandsentschädigung ({BETRAG_PLASMA}).',
        'Voraussetzung: Du musst volljährig sein, darfst nicht gerade krank sein und brauchst einen Personalausweis.',
        'Beide helfen Menschen, die Blutprodukte oder Plasma brauchen — es ist ein echtes Plus, andere zu unterstützen.'
      ],
      deadline: 'Jederzeit, wenn du spenden möchtest',
      consequence: 'Wenn du nicht spendest, ändert sich für dich nichts — für Patienten kann es aber ein Unterschied sein.',
      category: 'gesundheit',
      faktenKeys: ['BETRAG_PLASMA']
    },
    {
      id: 'arzttermin',
      title: 'Dein erster Arzttermin und Vorsorge-Checks',
      summary: 'Mit 18 Jahren organisierst du deine Gesundheit selbst. Lerne, wie du einen Hausarzt findest und Vorsorgetermine nutzt.',
      steps: [
        'Suche dir einen Hausarzt oder eine Hausärztin in deiner Nähe — frag Freunde oder schau online nach Rezensionen.',
        'Für den ersten Termin: Bring deine Versichertenkarte mit; der Arzt wird deine Krankengeschichte aufnehmen.',
        'Altersgerecht gibt es Vorsorge-Untersuchungen (z. B. Zahncheck, Impfungen, Hörtest) — dein Arzt berät dich, was sinnvoll ist.',
        'Traue dich, Fragen zu stellen — dein Arzt ist da, um dich zu unterstützen, nicht zu urteilen.'
      ],
      deadline: 'Zeitnah nach 18, damit du einen Arzt hast',
      consequence: 'Ohne Hausarzt hast du später Probleme, wenn es ernst wird — regelmäßige Check-ups helfen dir, gesund zu bleiben.',
      category: 'gesundheit'
    },
    {
      id: 'bafoeg',
      title: 'BAföG beantragen — wenn du studieren oder ausbilden möchtest',
      summary: 'BAföG kann helfen, Ausbildung oder Studium zu finanzieren. Prüfe, ob du berechtigt bist.',
      steps: [
        'BAföG gibt es für Schule, Ausbildung oder Studium — prüfe, ob deine Ausbildung förderfähig ist.',
        'Stelle den Antrag beim BAföG-Amt (online oder vor Ort); du brauchst Unterlagen zu deinem Einkommen, Vermögen und dem deiner Eltern.',
        'Die Frist ist wichtig ({FRIST_BAFOEG}) — stelle den Antrag rechtzeitig, sonst bekommst du kein Geld für vergangene Monate.',
        'Studenten-BAföG ist zur Hälfte Zuschuss und zur Hälfte ein zinsloses Darlehen — zurück zahlst du nur den Darlehensteil, gedeckelt (aktuell rund 10.010 €) und erst etwa 5 Jahre nach dem Förderende. Schüler-BAföG ist meist voller Zuschuss ohne Rückzahlung.'
      ],
      deadline: '{FRIST_BAFOEG}',
      consequence: 'Wenn du zu spät antragst, bekommst du weniger oder nichts — ein rechtzeitiger Antrag ist entscheidend.',
      category: 'finanzen',
      faktenKeys: ['FRIST_BAFOEG'],
      hilfen: [{ label: 'BAföG Digital – Online-Antrag', url: 'https://www.bafoeg-digital.de/' }]
    },
    {
      id: 'bewerbung-ausbildung',
      title: 'Bewerbung und Ausbildungsvertrag — worauf du achten musst',
      summary: 'Lerne, wie du dich überzeugend bewerbst und einen Ausbildungsvertrag richtig prüfst, bevor du unterschreibst.',
      steps: [
        'Bewerbung: Anschreiben, Lebenslauf, Zeugnisse (muss nicht perfekt sein, aber sauber und ehrlich).',
        'Im Ausbildungsvertrag achte auf: Ausbildungsdauer, Ausbildungsinhalte, Lohn/Gehalt, Urlaub und Kündigungsfristen.',
        'Typisch: 3–3,5 Jahre Ausbildung; gesetzlicher Mindesturlaub (Minderjährige haben Anspruch auf mehr); Probezeit ein bis vier Monate (§ 20 BBiG).',
        'Wenn etwas unklar ist, frage deinen zukünftigen Arbeitgeber oder einen Vertrauensperson — unterschreibe erst, wenn alles passt.'
      ],
      deadline: 'Vor Ausbildungsbeginn',
      consequence: 'Wenn du nicht aufpasst, kannst du später unter schlechten Bedingungen festsitzen — eine genaue Prüfung schützt dich.',
      category: 'arbeit'
    },
    {
      id: 'minijob',
      title: 'Studentenjob und Minijob — Regeln und Steuern verstehen',
      summary: 'Ein Nebenjob braucht Klarheit: Wie viel darfst du verdienen? Wie funktionieren die Steuern?',
      steps: [
        'Minijob: Bis {BETRAG_MINIJOB} pro Monat bleibt für dich meist ohne Steuern und Sozialabgaben — dein Arbeitgeber führt eine Pauschale ab.',
        'Wichtig: Mehrere Minijobs zusammen dürfen die Grenze nicht überschreiten — merke dir deine monatliche Verdienstgrenze.',
        'Steuern: Beim Minijob fallen für dich in der Regel keine Steuern an; bei höherem Einkommen kommen Lohnsteuer und Sozialversicherungsbeiträge dazu (dein Arbeitgeber berät dich).',
        'Familienversicherung: Vorsicht — ein zu hohes Einkommen kann dich aus der Familienversicherung rauswerfen.'
      ],
      deadline: 'Vor Jobantritt',
      consequence: 'Wenn du die Grenzen nicht beachtest, verlierst du Familienversicherung oder zahlst überraschend Steuern — klare Regeln helfen.',
      category: 'arbeit',
      faktenKeys: ['BETRAG_MINIJOB']
    },
    {
      id: 'orientierungstest',
      title: 'Was passt zu mir? — Der Check-U Test der Bundesagentur',
      summary: 'Unschlüssig, was du nach der Schule machen sollst? Der offizielle Check-U hilft neutral zu deiner Orientierung.',
      steps: [
        'Gehe auf die kostenlose Plattform https://check-u.de der Bundesagentur für Arbeit.',
        'Beantworte die Fragen ehrlich — der Test ist anonym und kostenlos, keine Anmeldung nötig.',
        'Der Test zeigt dir Berufe und Ausbildungen, die zu deinen Fähigkeiten und Interessen passen.',
        'Nutze die Ergebnisse als Anhaltspunkt für deine Überlegungen — rede auch mit Familie, Freunden oder einem Berufsberater darüber.'
      ],
      deadline: 'Frühzeitig vor der Bewerbung',
      consequence: 'Ohne Orientierung wählst du vielleicht einen Beruf, der nicht passt — der Test kostet nichts und gibt dir Klarheit.',
      category: 'arbeit'
    }
  ]
}
