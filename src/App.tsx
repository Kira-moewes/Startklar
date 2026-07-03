import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import JourneyOverview from './pages/JourneyOverview'
import TaskDetail from './pages/TaskDetail'
import Impressum from './pages/Impressum'
import Datenschutz from './pages/Datenschutz'
import Onboarding from './pages/Onboarding'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
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
