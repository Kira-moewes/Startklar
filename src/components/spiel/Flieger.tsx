// Die Spielfigur: eine kleine Piloten-Katze im Papierflieger. Baut auf dem
// bestehenden Papierflieger-Motiv auf (token-gebunden, färbt mit der
// Akzentfarbe). Ausrüstung wird als optionale Layer über der Figur gezeichnet.

export type FliegerZustand = 'fliegen' | 'ankommen' | 'feiern'

const ANIM: Record<FliegerZustand, string> = {
  fliegen: 'glide 4s ease-in-out infinite',
  ankommen: 'flyIn 1.1s cubic-bezier(.2,.7,.2,1) both',
  feiern: 'glide 1.2s ease-in-out infinite',
}

export default function Flieger({
  size = 140,
  zustand = 'fliegen',
  ausruestung = 'keine',
  shadow = true,
}: {
  size?: number
  zustand?: FliegerZustand
  ausruestung?: string
  shadow?: boolean
}) {
  const brille = ausruestung === 'gear-entdecker' || ausruestung === 'gear-meister'
  const schal = ausruestung === 'gear-meister'

  return (
    <svg
      width={size}
      height={size * (130 / 160)}
      viewBox="0 0 160 130"
      role="img"
      aria-label="Deine Flieger-Figur"
      style={{
        animation: ANIM[zustand],
        filter: shadow ? 'drop-shadow(0 18px 26px rgba(40,54,24,.28))' : undefined,
        overflow: 'visible',
      }}
    >
      {/* Papierflieger */}
      <polygon points="6,70 150,14 100,116" fill="var(--t-akzent)" />
      <polygon points="6,70 150,14 66,74" fill="var(--t-akzent-soft)" />
      <polygon points="66,74 150,14 74,100" fill="var(--t-akzent-deep)" />
      <line x1="66" y1="74" x2="150" y2="14" stroke="var(--cloud, #fff)" strokeWidth="2" />

      {/* Schal (Meister-Set) – weht hinter der Figur */}
      {schal && (
        <path
          d="M64 52 q-22 6 -34 22 q14 -6 26 -4 q-6 8 -4 18 q10 -12 22 -18 Z"
          fill="var(--t-akzent-deep)"
          opacity="0.9"
        />
      )}

      {/* Piloten-Katze */}
      <g>
        {/* Ohren */}
        <polygon points="58,40 66,22 74,40" fill="var(--t-fg)" />
        <polygon points="86,40 94,22 102,40" fill="var(--t-fg)" />
        {/* Kopf */}
        <circle cx="80" cy="52" r="20" fill="var(--t-fg)" />
        {/* Schnauzenfeld */}
        <ellipse cx="80" cy="58" rx="12" ry="9" fill="var(--cloud, #fff)" opacity="0.92" />
        {/* Augen */}
        {brille ? (
          <g>
            <circle cx="72" cy="50" r="6.5" fill="var(--cloud,#fff)" stroke="var(--t-akzent-deep)" strokeWidth="2.5" />
            <circle cx="88" cy="50" r="6.5" fill="var(--cloud,#fff)" stroke="var(--t-akzent-deep)" strokeWidth="2.5" />
            <rect x="64" y="41" width="32" height="5" rx="2.5" fill="var(--t-akzent-deep)" />
            <circle cx="72" cy="50" r="2" fill="var(--t-fg)" />
            <circle cx="88" cy="50" r="2" fill="var(--t-fg)" />
          </g>
        ) : (
          <g>
            <circle cx="73" cy="50" r="2.6" fill="var(--cloud,#fff)" />
            <circle cx="87" cy="50" r="2.6" fill="var(--cloud,#fff)" />
          </g>
        )}
        {/* Näschen + Schnurrhaare */}
        <polygon points="77,57 83,57 80,61" fill="var(--t-akzent)" />
        <line x1="66" y1="58" x2="54" y2="55" stroke="var(--t-fg)" strokeWidth="1.5" opacity="0.5" />
        <line x1="66" y1="61" x2="54" y2="62" stroke="var(--t-fg)" strokeWidth="1.5" opacity="0.5" />
        <line x1="94" y1="58" x2="106" y2="55" stroke="var(--t-fg)" strokeWidth="1.5" opacity="0.5" />
        <line x1="94" y1="61" x2="106" y2="62" stroke="var(--t-fg)" strokeWidth="1.5" opacity="0.5" />
      </g>
    </svg>
  )
}

// Katalog der Kosmetik-Sets für die Auswahl-UI (Profil).
export type GearSet = { id: string; titel: string; beschreibung: string; pro?: boolean }

export const GEAR_SETS: GearSet[] = [
  { id: 'keine', titel: 'Ohne Ausrüstung', beschreibung: 'Die Katze fliegt so, wie sie ist.' },
  { id: 'gear-entdecker', titel: 'Entdecker-Set', beschreibung: 'Fliegerbrille – erspielt beim Erschließen deiner ersten Insel.' },
  { id: 'gear-meister', titel: 'Meister-Set', beschreibung: 'Fliegerbrille + goldener Schal – wenn du ein ganzes Gebiet meisterst.' },
  { id: 'gear-pro-komet', titel: 'Komet-Set (Pro)', beschreibung: 'Ein leuchtender Kometenschweif. Teil der späteren Pro-Version.', pro: true },
]
