import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
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
