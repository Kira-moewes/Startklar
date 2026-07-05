interface HeatmapProps {
  data: number[]
  caption?: string
  cols?: number
}

function interpolateColor(value: number, min: number, max: number): string {
  // Normalize value between 0 and 1
  const normalized = (value - min) / (max - min)

  // Colors: pine-mist (#E4EAE7) to coral (#F47B5B)
  const startR = 0xe4 / 255
  const startG = 0xea / 255
  const startB = 0xe7 / 255

  const endR = 0xf4 / 255
  const endG = 0x7b / 255
  const endB = 0x5b / 255

  const r = Math.round((startR + (endR - startR) * normalized) * 255)
  const g = Math.round((startG + (endG - startG) * normalized) * 255)
  const b = Math.round((startB + (endB - startB) * normalized) * 255)

  return `rgb(${r}, ${g}, ${b})`
}

export default function Heatmap({ data, caption, cols = 7 }: HeatmapProps) {
  if (data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const isUniform = min === max

  return (
    <div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(24px, 1fr))` }}
        role="img"
        aria-label={caption}
      >
        {data.map((value, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg transition-colors cursor-default min-h-6 min-w-6 sm:min-h-8 sm:min-w-8"
            style={{
              backgroundColor: isUniform
                ? 'var(--color-pine-mist)'
                : interpolateColor(value, min, max),
            }}
            title={`${value} erledigt`}
            aria-label={`Tag ${i + 1}: ${value} erledigt`}
          />
        ))}
      </div>
      {caption && (
        <p className="mt-3 text-sm text-ink/60">{caption}</p>
      )}
    </div>
  )
}
