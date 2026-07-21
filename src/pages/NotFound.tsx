import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[680px] w-full px-7 pt-20 pb-24 text-center">
      <h1 className="m-0 font-serif font-normal text-[clamp(38px,6vw,64px)] text-pine">
        Hier ist <em className="text-olive">nichts</em>
      </h1>
      <p className="mt-4 m-0 text-[17px] text-pine/70">
        Diese Seite gibt es nicht (mehr) – vielleicht ein alter Link oder ein Tippfehler in der Adresse.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/" className="rounded-pill bg-olive px-7 py-3.5 font-semibold text-on-akzent hover:bg-olive-deep transition">
          Zur Startseite
        </Link>
        <Link to="/suche" className="rounded-pill border-[1.5px] border-pine/30 text-pine px-7 py-3.5 font-semibold hover:border-pine transition">
          Suchen
        </Link>
      </div>
    </div>
  )
}
