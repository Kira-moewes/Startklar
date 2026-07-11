import { lazy } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import StartIntro from './components/StartIntro'
import Home from './pages/Home'
import { useProfile } from './hooks/useProfile'
import { useSettings } from './hooks/useSettings'

// Routen werden bei Bedarf nachgeladen (eigener Chunk je Seite) – so bleibt der
// Erst-Download klein und datensparsam. Nur Layout + Home laden sofort (der
// häufigste erste Bildschirm); alles Übrige kommt beim Navigieren. Die
// Suspense-Grenze sitzt in `Layout` um den Outlet, damit die Navigation sichtbar
// bleibt, während eine Seite lädt.
const SoGehts = lazy(() => import('./pages/SoGehts'))
const Himmel = lazy(() => import('./pages/Himmel'))
const Post = lazy(() => import('./pages/Post'))
const Sammlung = lazy(() => import('./pages/Sammlung'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const JourneyOverview = lazy(() => import('./pages/JourneyOverview'))
const TaskDetail = lazy(() => import('./pages/TaskDetail'))
const Impressum = lazy(() => import('./pages/Impressum'))
const Datenschutz = lazy(() => import('./pages/Datenschutz'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Profil = lazy(() => import('./pages/Profil'))
const Suche = lazy(() => import('./pages/Suche'))
const Termine = lazy(() => import('./pages/Termine'))
const Vergleich = lazy(() => import('./pages/Vergleich'))
const VergleichDetail = lazy(() => import('./pages/VergleichDetail'))
const BedarfsCheck = lazy(() => import('./pages/BedarfsCheck'))

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

// Fallback für unbekannte Adressen (z. B. veraltete PWA-Deeplinks): ruhig,
// schamfrei, mit Weg zurück – statt einer leeren Seite ohne Hinweis.
function NichtGefunden() {
  return (
    <div className="mx-auto max-w-[640px] w-full px-7 pt-20 pb-28 text-center">
      <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Hoppla</p>
      <h1 className="mt-4 m-0 font-serif font-normal text-pine text-[clamp(30px,5vw,46px)] leading-[1.1]">
        Diese Seite gibt es nicht <em className="text-olive">(mehr)</em>.
      </h1>
      <p className="mt-4 mx-auto m-0 max-w-[420px] text-[16px] leading-relaxed text-pine/70">
        Kein Drama – vielleicht hat sich die Adresse geändert. Geh zurück zum Anfang,
        dann findest du alles wieder.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3.5">
        <Link to="/" className="rounded-pill bg-olive text-on-akzent px-8 py-4 text-base font-semibold transition hover:bg-olive-deep">
          Zur Startseite
        </Link>
        <Link to="/suche" className="rounded-pill border-[1.5px] border-pine/30 text-pine px-8 py-4 text-base font-semibold transition hover:border-pine">
          Suche öffnen →
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Auftakt beim App-Start: einmal pro Sitzung, antippbar, entfällt bei
          reduzierter Bewegung (Details in StartIntro.tsx). */}
      <StartIntro />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<StartRoute />} />
          <Route path="/so-gehts" element={<SoGehts />} />
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
          <Route path="*" element={<NichtGefunden />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
