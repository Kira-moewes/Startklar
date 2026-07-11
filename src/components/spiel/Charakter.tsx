// Charaktere „Über dem Nebel": Fiete (Papierflieger-Kater, Co-Pilot) und Klaro
// (der Lotse). Bewusst als EIN austauschbarer Baustein gebaut: Heute
// hand-gemachte SVGs; später lassen sich hier Studio-Rigs (Rive/Lottie)
// einsetzen, ohne die aufrufenden Stellen (Intro, Tour, Feier) zu ändern –
// Prop-Signatur (`pose`, `size`) bleibt gleich.

export type FietePose = 'ruhig' | 'winkt' | 'jubelt'
export type KlaroPose = 'funk'

// ---------------------------------------------------------------------------
// Fiete – der Kater. Fell = Akzentfarbe (fliegt farblich mit dem Flieger/Nutzer).
// ---------------------------------------------------------------------------
export function Fiete({ size = 128, pose = 'ruhig' }: { size?: number; pose?: FietePose }) {
  const armWink = pose === 'winkt' || pose === 'jubelt'
  return (
    <svg
      width={size}
      height={size * (150 / 128)}
      viewBox="0 0 128 150"
      role="img"
      aria-label="Fiete, dein Co-Pilot"
      style={{
        overflow: 'visible',
        animation: pose === 'jubelt' ? 'glide 1.1s ease-in-out infinite' : undefined,
      }}
    >
      {/* Schal – weht im Akzent-Ton */}
      <path d="M40 74 q-16 4 -22 18 q10 -4 18 -2 q-4 6 -2 14 q7 -9 16 -13 Z" fill="var(--t-akzent-deep)" opacity="0.95" />
      {/* Körper */}
      <ellipse cx="64" cy="104" rx="30" ry="34" fill="var(--t-akzent)" />
      <ellipse cx="64" cy="112" rx="18" ry="22" fill="var(--cloud, #fff)" opacity="0.85" />
      {/* Beine */}
      <rect x="50" y="130" width="11" height="16" rx="5" fill="var(--t-akzent-deep)" />
      <rect x="67" y="130" width="11" height="16" rx="5" fill="var(--t-akzent-deep)" />
      {/* Arm (winkt) */}
      <g style={armWink ? { transformOrigin: '92px 92px', animation: 'wink 0.9s ease-in-out infinite' } : undefined}>
        <rect x="86" y="86" width="22" height="10" rx="5" fill="var(--t-akzent)" transform="rotate(-28 92 92)" />
      </g>
      {/* Kopf */}
      <g>
        <polygon points="42,54 50,32 60,52" fill="var(--t-akzent)" />
        <polygon points="86,54 78,32 68,52" fill="var(--t-akzent)" />
        <polygon points="46,50 51,39 57,50" fill="var(--cloud,#fff)" opacity="0.7" />
        <polygon points="82,50 77,39 71,50" fill="var(--cloud,#fff)" opacity="0.7" />
        <circle cx="64" cy="62" r="26" fill="var(--t-akzent)" />
        <ellipse cx="64" cy="70" rx="15" ry="11" fill="var(--cloud,#fff)" opacity="0.92" />
        {/* Fliegerbrille auf der Stirn */}
        <rect x="43" y="46" width="42" height="7" rx="3.5" fill="var(--t-akzent-deep)" />
        <circle cx="53" cy="50" r="6" fill="none" stroke="var(--t-akzent-deep)" strokeWidth="3" />
        <circle cx="75" cy="50" r="6" fill="none" stroke="var(--t-akzent-deep)" strokeWidth="3" />
        {/* Augen */}
        <circle cx="56" cy="62" r="3" fill="var(--cloud,#fff)" />
        <circle cx="72" cy="62" r="3" fill="var(--cloud,#fff)" />
        {/* Näschen + Schnurrhaare */}
        <polygon points="61,68 67,68 64,72" fill="var(--t-akzent-deep)" />
        <line x1="50" y1="69" x2="38" y2="66" stroke="var(--cloud,#fff)" strokeWidth="1.5" opacity="0.6" />
        <line x1="50" y1="72" x2="38" y2="74" stroke="var(--cloud,#fff)" strokeWidth="1.5" opacity="0.6" />
        <line x1="78" y1="69" x2="90" y2="66" stroke="var(--cloud,#fff)" strokeWidth="1.5" opacity="0.6" />
        <line x1="78" y1="72" x2="90" y2="74" stroke="var(--cloud,#fff)" strokeWidth="1.5" opacity="0.6" />
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Klaro – der Lotse. Eule mit Headset. Silhouette aus --t-fg (funktioniert
// hell wie dunkel), Headset im Akzent.
// ---------------------------------------------------------------------------
export function Klaro({ size = 120, pose = 'funk' }: { size?: number; pose?: KlaroPose }) {
  void pose
  return (
    <svg
      width={size}
      height={size * (140 / 120)}
      viewBox="0 0 120 140"
      role="img"
      aria-label="Klaro, der Lotse"
      style={{ overflow: 'visible' }}
    >
      {/* Körper */}
      <ellipse cx="60" cy="92" rx="34" ry="40" fill="var(--t-fg)" />
      <ellipse cx="60" cy="98" rx="21" ry="27" fill="var(--cloud,#fff)" opacity="0.9" />
      {/* Flügel */}
      <path d="M28 84 q-8 18 4 34 q8 -6 12 -18 Z" fill="var(--t-fg)" />
      <path d="M92 84 q8 18 -4 34 q-8 -6 -12 -18 Z" fill="var(--t-fg)" />
      {/* Federohren */}
      <polygon points="40,40 46,20 54,40" fill="var(--t-fg)" />
      <polygon points="80,40 74,20 66,40" fill="var(--t-fg)" />
      {/* Kopf */}
      <circle cx="60" cy="52" r="30" fill="var(--t-fg)" />
      {/* Augen (groß, freundlich) */}
      <circle cx="49" cy="50" r="11" fill="var(--cloud,#fff)" />
      <circle cx="71" cy="50" r="11" fill="var(--cloud,#fff)" />
      <circle cx="51" cy="51" r="4.5" fill="var(--t-fg)" />
      <circle cx="69" cy="51" r="4.5" fill="var(--t-fg)" />
      {/* Schnabel */}
      <polygon points="56,60 64,60 60,68" fill="var(--t-akzent)" />
      {/* Headset (Lotse) */}
      <path d="M34 46 a26 26 0 0 1 52 0" fill="none" stroke="var(--t-akzent)" strokeWidth="4" />
      <rect x="28" y="44" width="10" height="14" rx="4" fill="var(--t-akzent)" />
      <rect x="82" y="44" width="10" height="14" rx="4" fill="var(--t-akzent)" />
      {/* Mikrofonarm */}
      <path d="M33 58 q-6 10 8 14" fill="none" stroke="var(--t-akzent)" strokeWidth="3" />
      <circle cx="42" cy="72" r="3.5" fill="var(--t-akzent-deep)" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Kleiner Kopf-Avatar für Dialog/Tour.
// ---------------------------------------------------------------------------
export function Avatar({ wer, size = 44 }: { wer: 'fiete' | 'klaro'; size?: number }) {
  return (
    <span
      className="inline-grid place-items-center rounded-full shrink-0"
      style={{ width: size, height: size, background: 'var(--cloud, #fff)', boxShadow: '0 2px 8px rgba(40,54,24,.18)' }}
    >
      <span style={{ transform: 'translateY(2px)' }}>
        {wer === 'fiete' ? <Fiete size={size * 0.82} /> : <Klaro size={size * 0.78} />}
      </span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Sprechblase – Figur + Text, optional mit Weiter/Überspringen.
// ---------------------------------------------------------------------------
export function Sprechblase({
  wer,
  name,
  text,
  onWeiter,
  weiterLabel = 'Weiter',
  onSkip,
  skipLabel,
  fortschritt,
}: {
  wer: 'fiete' | 'klaro'
  name: string
  text: string
  onWeiter?: () => void
  weiterLabel?: string
  onSkip?: () => void
  skipLabel?: string
  fortschritt?: string
}) {
  return (
    <div
      className="w-full max-w-[520px] rounded-[22px] border border-pine/15 bg-cream-card/95 backdrop-blur p-5 shadow-[0_16px_40px_rgba(40,54,24,.22)]"
      style={{ animation: 'panel-in .45s cubic-bezier(.2,.7,.2,1) both' }}
      role="dialog"
      aria-label={`${name} sagt`}
    >
      <div className="flex items-start gap-3.5">
        <Avatar wer={wer} />
        <div className="flex-1">
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-olive">{name}</p>
          <p className="mt-1 m-0 text-[16px] leading-[1.5] text-pine">{text}</p>
        </div>
      </div>
      {(onWeiter || onSkip) && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[12.5px] text-pine/50">{fortschritt}</span>
          <span className="flex items-center gap-2.5">
            {onSkip && (
              <button onClick={onSkip} className="text-[13.5px] font-semibold text-pine/55 hover:text-pine transition">
                {skipLabel ?? 'Überspringen'}
              </button>
            )}
            {onWeiter && (
              <button
                onClick={onWeiter}
                className="rounded-pill bg-olive text-on-akzent px-5 py-2 text-sm font-semibold hover:scale-[1.03] transition"
              >
                {weiterLabel}
              </button>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
