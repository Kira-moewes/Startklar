// Klaro als Charakter: der Papierflieger aus dem Redesign mit Augen,
// die blinzeln und dem Cursor folgen (--px/--py setzt der Hero).
// Für neutrale Stellen ohne Gesicht weiterhin PaperPlane verwenden.
export default function KlaroPlane({ width = 150, height = 120, shadow = true }: {
  width?: number
  height?: number
  shadow?: boolean
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 150 120"
      aria-hidden="true"
      style={shadow ? { filter: 'drop-shadow(0 22px 30px rgba(40,54,24,.3))' } : undefined}
    >
      <polygon points="8,62 142,10 96,104" fill="var(--t-akzent)" />
      <polygon points="8,62 142,10 62,66" fill="var(--t-akzent-soft)" />
      <polygon points="62,66 142,10 70,90" fill="var(--t-akzent-deep)" />
      <line x1="62" y1="66" x2="142" y2="10" stroke="var(--t-bg)" strokeWidth="2" />
      {/* Augen – blinzeln, Pupillen folgen sanft dem Cursor */}
      <g className="kp-eye">
        <ellipse cx="99" cy="47" rx="7.2" ry="7.8" fill="var(--t-bg)" />
        <circle className="kp-pupil" cx="101" cy="48" r="3.2" fill="var(--t-fg)" />
      </g>
      <g className="kp-eye">
        <ellipse cx="119" cy="39" rx="6.2" ry="6.8" fill="var(--t-bg)" />
        <circle className="kp-pupil" cx="120.8" cy="40" r="2.8" fill="var(--t-fg)" />
      </g>
    </svg>
  )
}
