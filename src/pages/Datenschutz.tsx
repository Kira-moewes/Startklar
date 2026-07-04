const absaetze: string[] = [
  '[Datenschutz-Text folgt – von Kira, via eRecht24]',
]

export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-pine">Datenschutz</h1>
      <div className="mt-6 flex flex-col gap-4">
        {absaetze.map((a, i) => (
          <p key={i} className="text-ink/85 leading-relaxed">
            {a}
          </p>
        ))}
      </div>
    </div>
  )
}
