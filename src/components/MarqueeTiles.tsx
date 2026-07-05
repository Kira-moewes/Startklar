// Endlos-Marquee im dunklen Band der Startseite – sechs animierte
// Mini-Szenen aus dem Redesign. Rein dekorativ (aria-hidden); die
// Kachelgruppe ist dupliziert, damit der Loop nahtlos läuft.

function TileWohnung() {
  return (
    <Tile title="Erste Wohnung" subtitle="Mietvertrag bis Rundfunk">
      <div className="absolute top-[34px] right-[34px] size-16 rounded-full bg-olive" style={{ animation: 'drift 9s ease-in-out infinite' }} />
      <div
        className="absolute top-[62px] left-[58px] w-[68px] h-[112px] border-[2.5px] border-cream rounded-t-lg rounded-b"
        style={{ transformOrigin: 'left center', animation: 'doorSwing 6s ease-in-out infinite' }}
      >
        <div className="absolute right-2 top-[52px] size-[7px] rounded-full bg-cream" />
      </div>
    </Tile>
  )
}

function TileFinanzen() {
  return (
    <Tile title="Finanzen" subtitle="Konto, Steuer, Schufa">
      <div className="absolute top-[52px] left-[70px] w-[110px] h-[118px]">
        <div className="absolute bottom-0 left-3.5 w-16 h-3.5 rounded-pill bg-olive-soft border-2 border-cream" />
        <div className="absolute bottom-[13px] left-[18px] w-14 h-[13px] rounded-pill bg-olive border-2 border-cream" />
        <div className="absolute bottom-[25px] left-[22px] w-12 h-3 rounded-pill bg-olive-soft border-2 border-cream" />
        <div
          className="absolute bottom-[38px] left-6 size-11 rounded-full bg-cream text-pine font-bold text-[22px] flex items-center justify-center"
          style={{ animation: 'coinDrop 3s cubic-bezier(.3,.7,.3,1) infinite' }}
        >
          €
        </div>
      </div>
    </Tile>
  )
}

function TileMobilitaet() {
  return (
    <Tile title="Mobilität" subtitle="Führerschein & erstes Auto">
      <div className="absolute top-32 left-[26px] right-[26px] border-t-[2.5px] border-dashed border-cream/40" />
      <div className="absolute top-[89px] left-6" style={{ animation: 'carDrive 4.5s linear infinite' }}>
        <svg width="72" height="44" viewBox="0 0 72 44">
          <path d="M8 28 L12 16 Q14 10 22 10 L42 10 Q48 10 52 16 L56 22 L64 24 Q67 25 67 28 L67 32 L5 32 L5 30 Q5 28 8 28 Z" fill="#FEFAE0" />
          <rect x="18" y="14" width="12" height="8" rx="2" fill="#33471F" />
          <rect x="34" y="14" width="12" height="8" rx="2" fill="#33471F" />
          <g>
            <circle cx="19" cy="32" r="6.5" fill="#33471F" stroke="#FEFAE0" strokeWidth="2.5" />
            <line x1="19" y1="27.5" x2="19" y2="36.5" stroke="#FEFAE0" strokeWidth="1.5" />
            <animateTransform attributeName="transform" type="rotate" from="0 19 32" to="360 19 32" dur="0.7s" repeatCount="indefinite" />
          </g>
          <g>
            <circle cx="53" cy="32" r="6.5" fill="#33471F" stroke="#FEFAE0" strokeWidth="2.5" />
            <line x1="53" y1="27.5" x2="53" y2="36.5" stroke="#FEFAE0" strokeWidth="1.5" />
            <animateTransform attributeName="transform" type="rotate" from="0 53 32" to="360 53 32" dur="0.7s" repeatCount="indefinite" />
          </g>
        </svg>
      </div>
    </Tile>
  )
}

function TileVolljaehrig() {
  return (
    <Tile title="Volljährig & startklar" subtitle="Rechte, Ausweis, Gesundheit">
      <p className="absolute top-11 inset-x-0 m-0 text-center font-serif italic text-[92px] font-light text-cream leading-none">18</p>
      <div className="absolute top-[46px] left-11 size-[9px] rounded-full bg-olive-soft" style={{ animation: 'blink 2.4s ease-in-out infinite' }} />
      <div className="absolute top-[120px] right-10 size-[7px] rounded-full bg-olive" style={{ animation: 'blink 2.4s ease-in-out .5s infinite' }} />
      <div className="absolute top-[70px] right-[66px] size-[5px] rounded-full bg-cream" style={{ animation: 'blink 2.4s ease-in-out 1s infinite' }} />
    </Tile>
  )
}

function TileTermine() {
  return (
    <Tile title="Termine" subtitle="Fristen im Blick behalten">
      <div className="absolute top-12 left-[74px] size-25 border-[2.5px] border-cream rounded-[14px]">
        <div className="h-[26px] bg-olive rounded-t-[10px]" />
        <div className="absolute bottom-[18px] right-[18px] size-3.5 rounded-full bg-cream" style={{ animation: 'pulse-dot 2.6s ease-in-out infinite' }} />
      </div>
    </Tile>
  )
}

function TileFortschritt() {
  return (
    <Tile title="Fortschritt" subtitle="Schritt für Schritt abhaken">
      <div className="absolute top-[46px] left-[72px] size-26" style={{ animation: 'sweep 7s linear infinite' }}>
        <svg width="104" height="104" viewBox="0 0 104 104">
          <circle cx="52" cy="52" r="44" fill="none" stroke="rgba(254,250,224,.2)" strokeWidth="8" />
          <circle cx="52" cy="52" r="44" fill="none" stroke="#FEFAE0" strokeWidth="8" strokeLinecap="round" strokeDasharray="200 277" />
        </svg>
      </div>
    </Tile>
  )
}

function Tile({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="w-[250px] h-[320px] flex-none rounded-3xl bg-tile border border-cream/12 p-6 flex flex-col justify-end relative overflow-hidden">
      {children}
      <p className="m-0 font-serif text-[23px] font-medium">{title}</p>
      <p className="mt-1.5 m-0 text-[13px] text-cream/60">{subtitle}</p>
    </div>
  )
}

function TileGroup() {
  return (
    <>
      <TileWohnung />
      <TileFinanzen />
      <TileMobilitaet />
      <TileVolljaehrig />
      <TileTermine />
      <TileFortschritt />
    </>
  )
}

export default function MarqueeTiles() {
  return (
    <div aria-hidden="true" className="overflow-hidden pt-2 pb-14">
      <div className="flex gap-5 w-max" style={{ animation: 'mq 45s linear infinite' }}>
        <TileGroup />
        <TileGroup />
      </div>
    </div>
  )
}
