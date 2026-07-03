import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import JourneyOverviewPage from './pages/JourneyOverviewPage'
import PlaceholderPage from './pages/PlaceholderPage'
import TaskDetailPage from './pages/TaskDetailPage'

function AppLayout() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-pine/10 bg-cream-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-2xl text-pine">
            Startklar
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-pine-soft">
            <Link to="/" className="hover:text-coral">Start</Link>
            <Link to="/impressum" className="hover:text-coral">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-coral">Datenschutz</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey/:journeyId" element={<JourneyOverviewPage />} />
          <Route path="/journey/:journeyId/task/:taskId" element={<TaskDetailPage />} />
          <Route path="/impressum" element={<PlaceholderPage title="Impressum" description="Hier erscheint später das Impressum." />} />
          <Route path="/datenschutz" element={<PlaceholderPage title="Datenschutz" description="Hier erscheint später die Datenschutzerklärung." />} />
        </Routes>
      </main>

      <footer className="border-t border-pine/10 bg-cream-card/80">
        <div className="mx-auto max-w-5xl px-6 py-4 text-sm text-pine-soft">
          Keine Rechtsberatung. Angaben können sich ändern.
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
