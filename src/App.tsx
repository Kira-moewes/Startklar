import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import JourneyOverview from './pages/JourneyOverview'
import TaskDetail from './pages/TaskDetail'
import Impressum from './pages/Impressum'
import Datenschutz from './pages/Datenschutz'
import Onboarding from './pages/Onboarding'
import Suche from './pages/Suche'
import Termine from './pages/Termine'
import Vergleich from './pages/Vergleich'
import VergleichDetail from './pages/VergleichDetail'
import Checkout from './pages/Checkout'
import Thema from './pages/Thema'
import Dokumente from './pages/Dokumente'
import DokumenteThema from './pages/DokumenteThema'
import Wallet from './pages/Wallet'
import Transparenz from './pages/Transparenz'
import Lernen from './pages/Lernen'
import LernArtikelSeite from './pages/LernArtikel'

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
          <Route path="/vergleich/:kategorieId/abschluss/:angebotId" element={<Checkout />} />
          <Route path="/thema/:themaId" element={<Thema />} />
          <Route path="/dokumente" element={<Dokumente />} />
          <Route path="/dokumente/:themaId" element={<DokumenteThema />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/transparenz" element={<Transparenz />} />
          <Route path="/lernen" element={<Lernen />} />
          <Route path="/lernen/:artikelId" element={<LernArtikelSeite />} />
          <Route path="/journey/:journeyId" element={<JourneyOverview />} />
          <Route path="/journey/:journeyId/task/:taskId" element={<TaskDetail />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profil" element={<Onboarding />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
