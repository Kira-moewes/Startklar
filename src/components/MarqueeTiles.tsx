// Ruhiges Kachel-Band im dunklen Band der Startseite. Sechs Themen als
// klare, einheitliche Linien-Icons — bewusst ohne hektische Einzel-
// animationen; die einzige Bewegung ist das langsame, an den Rändern
// weich aus-/einblendende Gleiten. Dekorativ (aria-hidden), die Gruppe
// ist dupliziert, damit der Loop nahtlos läuft.

type Kachel = { title: string; subtitle: string; icon: React.ReactNode }

const ICON = 'w-7 h-7 text-olive-soft'

const KACHELN: Kachel[] = [
  {
    title: 'Erste Wohnung',
    subtitle: 'Mietvertrag bis Rundfunk',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={ICON}>
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6 10.5V19h12v-8.5" />
        <path d="M10.5 19v-4h3v4" />
      </svg>
    ),
  },
  {
    title: 'Finanzen',
    subtitle: 'Konto, Steuer, Schufa',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={ICON}>
        <rect x="3" y="6" width="18" height="12" rx="2.5" />
        <path d="M3 10h18" />
        <path d="M7 14.5h3" />
      </svg>
    ),
  },
  {
    title: 'Mobilität',
    subtitle: 'Führerschein & erstes Auto',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={ICON}>
        <path d="M5 16v-3l1.6-4.2A2 2 0 0 1 8.5 7.5h7a2 2 0 0 1 1.9 1.3L19 13v3" />
        <path d="M4 13h16" />
        <circle cx="7.5" cy="16.5" r="1.6" />
        <circle cx="16.5" cy="16.5" r="1.6" />
      </svg>
    ),
  },
  {
    title: 'Volljährig',
    subtitle: 'Rechte, Ausweis, Gesundheit',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={ICON}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <circle cx="8.5" cy="11" r="2.2" />
        <path d="M5.5 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4M14 13.5h3" />
      </svg>
    ),
  },
  {
    title: 'Termine',
    subtitle: 'Fristen im Blick behalten',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={ICON}>
        <rect x="4" y="5" width="16" height="15" rx="2.5" />
        <path d="M4 9h16M8 3.5v3M16 3.5v3" />
        <path d="M9 14l2 2 3.5-3.5" />
      </svg>
    ),
  },
  {
    title: 'Fortschritt',
    subtitle: 'Schritt für Schritt abhaken',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={ICON}>
        <path d="M12 4a8 8 0 1 0 8 8" />
        <path d="M20 5.5 12 13l-2.5-2.5" />
      </svg>
    ),
  },
]

function Tile({ title, subtitle, icon }: Kachel) {
  return (
    <div className="w-[260px] flex-none rounded-3xl bg-tile border border-paper/12 px-7 py-8 flex flex-col gap-8">
      <span className="flex size-13 items-center justify-center rounded-2xl bg-paper/8 border border-paper/10">
        {icon}
      </span>
      <div>
        <p className="m-0 font-serif text-[22px] font-medium">{title}</p>
        <p className="mt-1.5 m-0 text-[13px] text-paper/55">{subtitle}</p>
      </div>
    </div>
  )
}

export default function MarqueeTiles() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden pt-2 pb-14"
      style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent)',
      }}
    >
      <div className="mq-track flex gap-4.5 w-max" style={{ animation: 'mq 60s linear infinite' }}>
        {[0, 1].map(g => (
          <div key={g} className="flex gap-4.5" aria-hidden={g === 1}>
            {KACHELN.map(k => (
              <Tile key={`${g}-${k.title}`} {...k} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
