import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-cream text-ink">
      <header className="border-b border-pine-mist bg-cream-card/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold text-pine">Startklar</Link>
          <nav className="flex gap-5 text-sm" aria-label="Hauptnavigation">
            <NavLink to="/" className="text-pine hover:text-coral-deep">Start</NavLink>
            <NavLink to="/impressum" className="text-pine hover:text-coral-deep">Impressum</NavLink>
            <NavLink to="/datenschutz" className="text-pine hover:text-coral-deep">Datenschutz</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-pine-mist bg-cream-card">
        <div className="mx-auto max-w-3xl px-6 py-5 text-sm text-ink/70 flex flex-wrap gap-x-6 gap-y-2 items-center">
          <span>Keine Rechtsberatung. Angaben können sich ändern.</span>
          <Link to="/impressum" className="underline underline-offset-2 hover:text-coral-deep">Impressum</Link>
          <Link to="/datenschutz" className="underline underline-offset-2 hover:text-coral-deep">Datenschutz</Link>
        </div>
      </footer>
    </div>
  )
}
