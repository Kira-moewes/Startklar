import PageHead from '../components/PageHead'

const absaetze: string[] = [
  '[Impressum-Text folgt – von Kira, via eRecht24]',
]

export default function Impressum() {
  return (
    <div className="mx-auto max-w-[720px] w-full px-7 pt-14 pb-24">
      <PageHead eyebrow="Rechtliches" title="Impressum" />
      <div className="flex flex-col gap-4">
        {absaetze.map((a, i) => (
          <p key={i} className="m-0 text-pine/85 leading-relaxed">
            {a}
          </p>
        ))}
      </div>
    </div>
  )
}
