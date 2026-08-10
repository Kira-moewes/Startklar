interface HeatmapProps {
  data: number[]
  caption?: string
  cols?: number
}

// Skala von pine-mist zur Akzentfarbe – folgt der Farbwahl der Nutzer:in.
function interpolateColor(value: number, min: number, max: number): string {
  const normalized = (value - min) / (max - min)
  const anteil = Math.round(normalized * 100)
  return `color-mix(in srgb, var(--t-akzent) ${anteil}%, var(--t-mist))`
}

export default function Heatmap({ data, caption, cols = 7 }: HeatmapProps) {
  if (data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const isUniform = min === max

  return (
    <div>
      <div
        className="grid gap-1.5 p-4 bg-cream-card rounded-card border border-pine-mist"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(32px, 1fr))` }}
        role="img"
        aria-label={caption}
      >
        {data.map((value, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg transition-colors cursor-default min-h-8 min-w-8 sm:min-h-10 sm:min-w-10"
            style={{
              backgroundColor: isUniform
                ? 'var(--color-pine-mist)'
                : interpolateColor(value, min, max),
            }}
            title={`Value: ${value}`}
            aria-label={`Cell ${i + 1}: ${value}`}
          />
        ))}
      </div>
      {caption && (
        <p className="mt-3 text-sm text-ink/60">{caption}</p>
      )}
    </div>
  )
}
