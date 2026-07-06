// Der Papierflieger aus dem Redesign – auf der Startseite groß,
// im Onboarding klein als Fortschritts-Marker.
export default function PaperPlane({ width = 150, height = 120, shadow = true }: {
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
    </svg>
  )
}
