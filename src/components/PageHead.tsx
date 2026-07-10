// Einheitlicher Seitenkopf für alle Unterseiten: kleine Eyebrow-Zeile,
// große Serifen-Überschrift und optionaler Einleitungstext. Tritt beim
// Laden sanft und gestaffelt ein (respektiert reduzierte Bewegung über
// die globalen Motion-Regeln in index.css).
export default function PageHead({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="mb-10">
      {eyebrow && (
        <p
          className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive"
          style={{ animation: 'rise .6s var(--ease-out) both' }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className="mt-3 m-0 font-serif font-normal text-pine text-[clamp(34px,5vw,58px)] leading-[1.05]"
        style={{ animation: 'rise .7s var(--ease-out) .05s both' }}
      >
        {title}
      </h1>
      {intro && (
        <p
          className="mt-4 m-0 text-[17px] leading-relaxed text-pine/70 max-w-[560px]"
          style={{ animation: 'rise .7s var(--ease-out) .12s both' }}
        >
          {intro}
        </p>
      )}
      {children && (
        <div style={{ animation: 'rise .7s var(--ease-out) .18s both' }}>{children}</div>
      )}
    </header>
  )
}
