import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Himmel from './pages/Himmel'
import Post from './pages/Post'
import Sammlung from './pages/Sammlung'
import Dashboard from './pages/Dashboard'
import JourneyOverview from './pages/JourneyOverview'
import TaskDetail from './pages/TaskDetail'
import Impressum from './pages/Impressum'
import Datenschutz from './pages/Datenschutz'
import Onboarding from './pages/Onboarding'
import Profil from './pages/Profil'
import Suche from './pages/Suche'
import Termine from './pages/Termine'
import Vergleich from './pages/Vergleich'
import VergleichDetail from './pages/VergleichDetail'
import BedarfsCheck from './pages/BedarfsCheck'
import { useProfile } from './hooks/useProfile'
import { useSettings } from './hooks/useSettings'

// Startseite: Spiel (Himmelskarte) für eingerichtete Profile, sonst die
// klassische Marketing-Startseite. Über den Umschalter in den Einstellungen
// jederzeit auf „klassisch" zurückstellbar (Reversibilität).
function StartRoute() {
  const { profile, loading: pLoading } = useProfile()
  const { einstellungen, loading: sLoading } = useSettings()
  if (pLoading || sLoading) return null
  if (profile && einstellungen.startseite === 'spiel') return <Himmel />
  return <Home />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<StartRoute />} />
          <Route path="/himmel" element={<Himmel />} />
          <Route path="/post" element={<Post />} />
          <Route path="/sammlung" element={<Sammlung />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fortschritt" element={<Dashboard />} />
          <Route path="/suche" element={<Suche />} />
          <Route path="/termine" element={<Termine />} />
          <Route path="/vergleich" element={<Vergleich />} />
          <Route path="/vergleich/:kategorieId" element={<VergleichDetail />} />
          <Route path="/vergleich/:kategorieId/check" element={<BedarfsCheck />} />
          <Route path="/journey/:journeyId" element={<JourneyOverview />} />
          <Route path="/journey/:journeyId/task/:taskId" element={<TaskDetail />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
