interface RingProps {
  value: number // 0-100
  size?: number
  label?: string | React.ReactNode
  labelClass?: string // z. B. 'fill-cream' auf dunklen Kacheln
}

export default function Ring({ value, size = 120, label, labelClass }: RingProps) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size}>
        {/* Nur die Kreise starten oben (-90°), der Text bleibt aufrecht. */}
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* Track (pine-mist) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-pine-mist)"
            strokeWidth="4"
          />
          {/* Progress (coral) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-coral)"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-300"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </g>
        {/* Center label */}
        {label && (
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dy="0.3em"
            style={{ fontSize: Math.round(size / 5.5) }}
            className={`font-display font-semibold ${labelClass ?? 'fill-ink'}`}
          >
            {typeof label === 'string' ? label : null}
          </text>
        )}
      </svg>
      {typeof label === 'string' && label.length > 4 && (
        <span className="text-xs text-ink/60 text-center max-w-24">{label}</span>
      )}
    </div>
  )
}
