import { Link, NavLink, Outlet } from 'react-router-dom'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `transition ${isActive ? 'text-coral-deep font-semibold' : 'text-pine hover:text-coral-deep'}`

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-cream text-ink">
      <header className="border-b border-pine-mist bg-cream-card/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 min-h-16 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Link to="/" className="font-display text-2xl font-semibold text-pine">Startklar</Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Hauptnavigation">
            <NavLink to="/" end className={navClass}>Start</NavLink>
            <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
            <NavLink to="/vergleich" className={navClass}>Vergleich</NavLink>
            <NavLink to="/dokumente" className={navClass}>Dokumente</NavLink>
            <NavLink to="/termine" className={navClass}>Termine</NavLink>
            <NavLink to="/wallet" className={navClass}>Wallet</NavLink>
            <NavLink to="/lernen" className={navClass}>Lernen</NavLink>
            <NavLink to="/suche" className={navClass} aria-label="Suche">
              <span aria-hidden="true">🔍</span> Suche
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-pine-mist bg-cream-card">
        <div className="mx-auto max-w-3xl px-6 py-5 text-sm text-ink/70 flex flex-wrap gap-x-6 gap-y-2 items-center">
          <span>Keine Rechtsberatung. Angaben können sich ändern.</span>
          <Link to="/transparenz" className="underline underline-offset-2 hover:text-coral-deep">Transparenz</Link>
          <Link to="/impressum" className="underline underline-offset-2 hover:text-coral-deep">Impressum</Link>
          <Link to="/datenschutz" className="underline underline-offset-2 hover:text-coral-deep">Datenschutz</Link>
        </div>
      </footer>
    </div>
  )
}
