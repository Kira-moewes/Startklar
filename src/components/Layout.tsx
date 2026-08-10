import { Link, NavLink, Outlet } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import AgentButton from './agent/AgentButton'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-[15px] font-medium py-1 transition ${isActive ? 'text-olive' : 'text-pine hover:text-olive'}`

export default function Layout() {
  const { profile, loading } = useProfile()

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
        <Outlet />
      </main>
      <AgentButton />
      <footer className="bg-band text-paper/65 border-t border-paper/10">
        <div className="mx-auto max-w-[1200px] px-7 py-6 flex flex-wrap gap-x-6 gap-y-2 items-center text-[13.5px]">
          <span className="font-serif text-[17px] text-paper">Startklar</span>
          <span>Keine Rechtsberatung. Angaben können sich ändern.</span>
          <span className="ml-auto flex gap-4.5">
            <Link to="/impressum" className="underline underline-offset-3 hover:text-paper transition">Impressum</Link>
            <Link to="/datenschutz" className="underline underline-offset-3 hover:text-paper transition">Datenschutz</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
