import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { portfolioApps, kostprobeApp } from '../data/portfolio'
import { useGuthaben } from '../hooks/useGuthaben'
import { useCountUp } from '../hooks/useCountUp'
import {
  SCHRITT_BONUS,
  JOURNEY_BONUS,
  REFERRAL_BONUS,
  FREISCHALT_KOSTEN,
  PASS_BASIS_CENT,
  formatiereEuro,
  type GuthabenGrund,
} from '../lib/guthaben'

const journeyTitel = (id: string) => journeys.find(j => j.id === id)?.title ?? ''
const appName = (id: string) => portfolioApps.find(a => a.id === id)?.name ?? id

function grundText(grund: GuthabenGrund): string {
  switch (grund.art) {
    case 'schritt': {
      const t = journeyTitel(grund.journeyId)
      return t ? `Schritt erledigt · ${t}` : 'Schritt erledigt'
    }
    case 'journey':
      return `Bereich abgeschlossen · ${journeyTitel(grund.journeyId)}`
    case 'referral':
      return 'Freund:in geworben'
    case 'kauf-demo':
      return `Sterne gekauft (Demo) · ${grund.paket}`
    case 'freischaltung':
      return `App freigeschaltet · ${appName(grund.appId)}`
    case 'pass-demo':
      return 'Startklar+ Pass aktiviert (Demo)'
  }
}

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
}

const verdienWege = [
  { label: 'Aufgabe / Schritt erledigt', wert: `+${SCHRITT_BONUS} ⭐` },
  { label: 'Ganzen Bereich abgeschlossen', wert: `+${JOURNEY_BONUS} ⭐` },
  { label: 'Freund:in geworben (bald)', wert: `+${REFERRAL_BONUS} ⭐` },
]

export default function Guthaben() {
  const { guthaben, loading, passPreisCent, passPreisText, passAktivieren, kaufeSterneDemo } = useGuthaben()
  const animSterne = useCountUp(guthaben.sterne)

  const bisKostprobe = Math.max(0, FREISCHALT_KOSTEN - guthaben.sterne)
  const kostprobePct = Math.min(100, Math.round((guthaben.sterne / FREISCHALT_KOSTEN) * 100))
  const rabattCent = PASS_BASIS_CENT - passPreisCent

  if (loading) {
    return (
      <div className="mx-auto max-w-[820px] px-7 py-14">
        <p className="text-pine/60">Lädt...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[820px] w-full px-7 pt-14 pb-24">
      <h1 className="m-0 font-serif font-normal text-[clamp(38px,5vw,60px)] text-pine" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        Dein <em className="text-olive">Guthaben</em>
      </h1>
      <p className="mt-3 m-0 text-[17px] text-pine/70" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .05s both' }}>
        Sterne verdienst du, indem du deine To-dos erledigst. Damit schaltest du Apps aus dem Portfolio frei.
      </p>

      {/* Kontostand + Kostprobe */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4.5" style={{ animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .1s both' }}>
        <div className="bg-band text-paper rounded-[22px] p-7 flex flex-col justify-center items-center gap-1">
          <p className="m-0 font-serif text-[52px] leading-none">{animSterne} ⭐</p>
          <p className="m-0 text-sm text-paper/65">Sterne auf deinem Konto</p>
        </div>
        <div className="bg-cream-card border border-pine/14 rounded-[22px] px-6.5 py-6 flex flex-col justify-center">
          <div className="flex items-baseline justify-between gap-3">
            <p className="m-0 font-serif text-xl font-medium text-pine">Deine erste Kostprobe</p>
            <span className="text-[13.5px] font-semibold text-olive">{kostprobePct} %</span>
          </div>
          <span className="block mt-3 h-2 rounded-pill bg-pine/12 overflow-hidden">
            <span className="block h-full rounded-pill bg-olive transition-all duration-600" style={{ width: `${kostprobePct}%` }} />
          </span>
          <p className="mt-3 m-0 text-sm text-pine/65">
            {bisKostprobe > 0
              ? <>Noch <strong className="text-pine">{bisKostprobe} ⭐</strong> bis du {kostprobeApp ? `„${kostprobeApp.name}"` : 'eine App'} gratis freischalten kannst.</>
              : <>Geschafft! Du kannst dir jetzt eine App gratis freischalten.</>}
          </p>
        </div>
      </div>

      {/* Startklar+ Pass */}
      <section>
        <h2 className="mt-13 m-0 font-serif font-medium text-[28px] text-pine">Startklar+ Pass</h2>
        <div className="mt-5 bg-cream-card border border-pine/14 rounded-[22px] p-7">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
            {rabattCent > 0 && <span className="text-pine/45 line-through font-serif text-xl">{formatiereEuro(PASS_BASIS_CENT)}</span>}
            <span className="font-serif text-[40px] leading-none text-olive">{passPreisText}</span>
            <span className="text-pine/60 text-sm mb-1">/ Monat</span>
          </div>
          {rabattCent > 0 && (
            <span className="mt-3 inline-block rounded-pill bg-olive/12 text-olive px-3.5 py-1 text-sm font-semibold">
              − {formatiereEuro(rabattCent)} durch deine Aktivität
            </span>
          )}
          <p className="mt-4 m-0 text-[15px] leading-[1.55] text-pine/80">
            Ein Preis, das ganze wachsende Portfolio. Je mehr Sterne du hast, desto günstiger dein Pass –
            nie umsonst, aber wer beiträgt, zahlt weniger.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {guthaben.passAktiv ? (
              <span className="rounded-pill border-[1.5px] border-olive bg-olive/8 px-5 py-2.5 text-sm font-semibold text-olive">
                ✓ Pass aktiv{guthaben.passSeit ? ` seit ${formatDatum(guthaben.passSeit)}` : ''}
              </span>
            ) : (
              <button
                onClick={() => void passAktivieren()}
                className="rounded-pill bg-olive px-6 py-3 font-semibold text-on-akzent hover:bg-olive-deep transition"
              >
                Pass aktivieren
              </button>
            )}
            <Link to="/portfolio" className="text-sm font-semibold text-olive hover:text-pine transition">
              Portfolio entdecken →
            </Link>
          </div>
          <p className="mt-4 m-0 text-[13px] text-pine/50">
            Prototyp: Der Pass ist hier eine Demo – echte Zahlung kommt später. Startklar selbst bleibt
            immer kostenlos und werbefrei.
          </p>
        </div>
      </section>

      {/* So verdienst du Sterne */}
      <section>
        <h2 className="mt-13 m-0 font-serif font-medium text-[28px] text-pine">So verdienst du Sterne</h2>
        <div className="mt-5 bg-cream-card border border-pine/14 rounded-[22px] divide-y divide-pine/10">
          {verdienWege.map(w => (
            <div key={w.label} className="flex items-center justify-between gap-4 px-6 py-4">
              <span className="text-[15.5px] text-pine/85">{w.label}</span>
              <span className="font-serif text-lg text-olive whitespace-nowrap">{w.wert}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Verlauf */}
      {guthaben.verlauf.length > 0 && (
        <section>
          <h2 className="mt-13 m-0 font-serif font-medium text-[28px] text-pine">Verlauf</h2>
          <div className="mt-5 flex flex-col gap-2.5">
            {guthaben.verlauf.slice(0, 20).map(e => (
              <div key={e.id} className="flex items-center gap-3.5 rounded-[16px] bg-cream-card border border-pine/14 px-5 py-3.5">
                <span className={`font-serif text-lg whitespace-nowrap ${e.betrag < 0 ? 'text-pine/60' : 'text-olive'}`}>
                  {e.betrag > 0 ? '+' : ''}{e.betrag} ⭐
                </span>
                <span className="flex-1 min-w-0 text-[15px] text-pine/80 truncate">{grundText(e.grund)}</span>
                <span className="text-sm text-pine/45 whitespace-nowrap">{formatDatum(e.am)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Demo: Sterne dazukaufen */}
      <section>
        <h2 className="mt-13 m-0 font-serif font-medium text-[28px] text-pine">Keine Zeit zum Sammeln?</h2>
        <div className="mt-5 bg-cream-card border border-pine/14 rounded-[22px] p-7">
          <p className="m-0 text-[15px] leading-[1.55] text-pine/80">
            Wer viel nutzt, wird belohnt – wer wenig Zeit hat, kann Sterne auch dazukaufen und trotzdem
            alles nutzen. Niemand wird ausgeschlossen.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { anzahl: 200, paket: '200 ⭐' },
              { anzahl: 800, paket: '800 ⭐' },
            ].map(p => (
              <button
                key={p.paket}
                onClick={() => void kaufeSterneDemo(p.anzahl, p.paket)}
                className="rounded-pill border-[1.5px] border-pine/30 px-5.5 py-2.5 text-sm font-semibold text-pine hover:border-pine transition"
              >
                {p.paket} dazu <span className="text-pine/50">(Demo)</span>
              </button>
            ))}
          </div>
          <p className="mt-4 m-0 text-[13px] text-pine/50">
            Prototyp: Der Kauf ist hier nur eine Demo, es wird kein echtes Geld abgebucht.
          </p>
        </div>
      </section>
    </div>
  )
}
