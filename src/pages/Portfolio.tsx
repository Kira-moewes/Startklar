import { Link } from 'react-router-dom'
import { portfolioApps, empfehlungFuerProfil, type PortfolioApp } from '../data/portfolio'
import { useProfile } from '../hooks/useProfile'
import { useGuthaben } from '../hooks/useGuthaben'
import { FREISCHALT_KOSTEN } from '../lib/guthaben'

export default function Portfolio() {
  const { profile } = useProfile()
  const { guthaben, istFreigeschaltet, freischalten } = useGuthaben()
  const empfehlung = empfehlungFuerProfil(profile)

  return (
    <div className="mx-auto max-w-[960px] w-full px-7 pt-14 pb-24">
      <h1 className="m-0 font-serif font-normal text-[clamp(38px,5vw,60px)] text-pine" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        Das <em className="text-olive">Portfolio</em>
      </h1>
      <p className="mt-3 m-0 text-[17px] text-pine/70" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .05s both' }}>
        Kleine Apps rund ums Erwachsenwerden. Eine schaltest du dir mit Sternen frei – der Pass öffnet alle.
      </p>

      {/* Timing-Empfehlung */}
      {empfehlung && (
        <div className="mt-8 rounded-[22px] bg-olive text-on-akzent p-6.5 flex items-start gap-4" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .1s both' }}>
          <span className="text-3xl leading-none">{empfehlung.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="m-0 text-sm font-semibold uppercase tracking-wide opacity-80">Das könnte dir jetzt helfen</p>
            <p className="mt-1 m-0 font-serif text-2xl font-medium">{empfehlung.name}</p>
            <p className="mt-1 m-0 text-[15px] leading-[1.5] opacity-90">{empfehlung.tagline}</p>
          </div>
        </div>
      )}

      {/* Galerie */}
      <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4.5">
        {portfolioApps.map((app, i) => (
          <AppKachel
            key={app.id}
            app={app}
            sterne={guthaben.sterne}
            passAktiv={guthaben.passAktiv}
            frei={istFreigeschaltet(app.id)}
            onFreischalten={() => void freischalten(app.id)}
            index={i}
          />
        ))}
      </div>

      <p className="mt-8 text-[13px] text-pine/50">
        Prototyp: Bis auf Projektor sind das Platzhalter-Apps, damit du das Modell ausprobieren kannst.
        Echtgeld-Käufe sind hier Demos.
      </p>
    </div>
  )
}

function AppKachel({
  app,
  sterne,
  passAktiv,
  frei,
  onFreischalten,
  index,
}: {
  app: PortfolioApp
  sterne: number
  passAktiv: boolean
  frei: boolean
  onFreischalten: () => void
  index: number
}) {
  const gedimmt = app.art === 'bald'
  return (
    <div
      className={`flex flex-col rounded-[22px] border p-6 transition ${
        gedimmt ? 'border-pine/10 bg-cream-card/60 opacity-70' : 'border-pine/14 bg-cream-card hover:border-olive'
      }`}
      style={{ animation: `rise .55s cubic-bezier(.2,.7,.2,1) ${index * 0.06}s both` }}
    >
      <span className="text-4xl leading-none">{app.emoji}</span>
      <p className="mt-4 m-0 font-serif text-xl font-medium text-pine">{app.name}</p>
      {app.kategorie && <p className="mt-0.5 m-0 text-[12.5px] font-semibold uppercase tracking-wide text-olive">{app.kategorie}</p>}
      <p className="mt-2 m-0 flex-1 text-sm leading-[1.5] text-pine/70">{app.tagline}</p>
      <div className="mt-5">
        <KachelAktion app={app} sterne={sterne} passAktiv={passAktiv} frei={frei} onFreischalten={onFreischalten} />
      </div>
    </div>
  )
}

function KachelAktion({
  app,
  sterne,
  passAktiv,
  frei,
  onFreischalten,
}: {
  app: PortfolioApp
  sterne: number
  passAktiv: boolean
  frei: boolean
  onFreischalten: () => void
}) {
  if (app.art === 'bald') {
    return <span className="text-sm font-semibold text-pine/45">Kommt bald</span>
  }

  if (app.art === 'extern') {
    return (
      <Link
        to={app.href ?? '/'}
        className="inline-block rounded-pill bg-pine text-cream px-5 py-2.5 text-sm font-semibold hover:bg-olive transition"
      >
        Öffnen →
      </Link>
    )
  }

  // Durch Pass geöffnet oder als Kostprobe erspielt → frei nutzbar
  if (passAktiv || frei) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-olive bg-olive/8 px-4 py-2 text-sm font-semibold text-olive">
        ✓ {frei && !passAktiv ? 'Freigeschaltet' : 'Mit Pass frei'}
      </span>
    )
  }

  if (app.art === 'erspielbar') {
    const reicht = sterne >= FREISCHALT_KOSTEN
    return (
      <button
        onClick={reicht ? onFreischalten : undefined}
        disabled={!reicht}
        className={`rounded-pill px-5 py-2.5 text-sm font-semibold transition ${
          reicht
            ? 'bg-olive text-on-akzent hover:bg-olive-deep'
            : 'border-[1.5px] border-pine/20 text-pine/45 cursor-not-allowed'
        }`}
      >
        {reicht ? `Für ${FREISCHALT_KOSTEN} ⭐ freischalten` : `Noch ${FREISCHALT_KOSTEN - sterne} ⭐`}
      </button>
    )
  }

  // art:'pass', Pass nicht aktiv
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-pine-mist/60 px-4 py-2 text-sm font-semibold text-pine/60">
      🔒 Mit Pass
    </span>
  )
}
