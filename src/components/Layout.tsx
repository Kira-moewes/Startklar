import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import AgentButton from './agent/AgentButton'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `nav-u text-[15px] font-medium py-1 transition ${isActive ? 'nav-u-on text-olive' : 'text-pine hover:text-olive'}`

const FOOTER_NAV = [
  { to: '/', label: 'Start' },
  { to: '/fortschritt', label: 'Fortschritt' },
  { to: '/termine', label: 'Termine' },
  { to: '/vergleich', label: 'Vergleich' },
  { to: '/suche', label: 'Suche' },
  { to: '/profil', label: 'Profil' },
]

export default function Layout() {
  const { profile, loading } = useProfile()
  const location = useLocation()

  return (
    <div className="min-h-dvh flex flex-col bg-cream text-ink">
      <header className="sticky top-0 z-50 bg-cream/85 backdrop-blur-md border-b border-pine/12">
        <div className="mx-auto max-w-[1200px] px-7 min-h-[68px] py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <Link to="/" className="flex items-baseline">
            <span className="font-serif text-[27px] text-pine">Startklar</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1" aria-label="Hauptnavigation">
            <NavLink to="/" end className={navClass}>Start</NavLink>
            <NavLink to="/fortschritt" className={navClass}>Fortschritt</NavLink>
            <NavLink to="/termine" className={navClass}>Termine</NavLink>
            <NavLink to="/vergleich" className={navClass}>Vergleich</NavLink>
            <NavLink to="/suche" className={navClass}>Suche</NavLink>
            <NavLink to="/profil" className={navClass}>Profil</NavLink>
            {!loading && !profile && (
              <Link
                to="/onboarding"
                className="rounded-pill bg-pine text-cream px-5 py-2.5 text-sm font-semibold hover:bg-olive transition"
              >
                Loslegen
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Sanfter Auftritt bei Seitenwechsel (nur opacity/transform) */}
        <div key={location.pathname} style={{ animation: 'pageIn .5s var(--ease-out) both' }}>
          <Outlet />
        </div>
      </main>
      <AgentButton />
      <footer className="bg-band text-paper/65 border-t border-paper/10">
        <div className="mx-auto max-w-[1200px] px-7 pt-14 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-10">
            <div className="max-w-[420px]">
              <p className="m-0 font-serif text-[clamp(34px,4vw,48px)] leading-none text-paper">Startklar</p>
              <p className="mt-4 m-0 text-[14.5px] leading-relaxed text-paper/60">
                Erwachsen werden — aber machbar. To-dos rund um Behörden, Geld und Wohnung,
                ein Schritt nach dem anderen. Alles bleibt lokal auf deinem Gerät.
              </p>
            </div>
            <nav aria-label="Fußzeilen-Navigation" className="grid grid-cols-2 gap-x-14 gap-y-2.5">
              {FOOTER_NAV.map(l => (
                <Link key={l.to} to={l.to} className="text-[14.5px] text-paper/70 hover:text-paper transition">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-12 pt-6 border-t border-paper/12 flex flex-wrap gap-x-6 gap-y-2 items-center text-[13.5px]">
            <span>Keine Rechtsberatung. Angaben können sich ändern.</span>
            <span className="ml-auto flex gap-4.5">
              <Link to="/impressum" className="underline underline-offset-3 hover:text-paper transition">Impressum</Link>
              <Link to="/datenschutz" className="underline underline-offset-3 hover:text-paper transition">Datenschutz</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
