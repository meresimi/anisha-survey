import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useStorage } from './hooks/useStorage'
import Layout        from './components/ui/Layout'
import LoadingScreen from './components/ui/LoadingScreen'
import SetupPage     from './pages/SetupPage'
import HomePage      from './pages/HomePage'
import SurveyPage    from './pages/SurveyPage'
import RespondentsPage from './pages/RespondentsPage'
import ReportsPage   from './pages/ReportsPage'
import FieldNotesPage from './pages/FieldNotesPage'
import InstrumentsPage from './pages/InstrumentsPage'

export default function App() {
  const storage    = useStorage()
  const [splashDone, setSplashDone] = useState(false)

  if (storage.loading || !splashDone) {
    return <LoadingScreen onDone={() => setSplashDone(true)} />
  }

  if (!storage.data.setup) {
    return <SetupPage onComplete={async (setup) => { await storage.saveSetup(setup) }} />
  }

  return (
    <HashRouter>
      <Layout storage={storage}>
        <Routes>
          <Route path="/"                    element={<HomePage       storage={storage}/>}/>
          <Route path="/survey"              element={<SurveyPage     storage={storage}/>}/>
          <Route path="/survey/:respondentId" element={<SurveyPage   storage={storage}/>}/>
          <Route path="/respondents"         element={<RespondentsPage storage={storage}/>}/>
          <Route path="/reports"             element={<ReportsPage    storage={storage}/>}/>
          <Route path="/reports/:reportId"   element={<ReportsPage    storage={storage}/>}/>
          <Route path="/fieldnotes"          element={<FieldNotesPage storage={storage}/>}/>
          <Route path="/instruments"         element={<InstrumentsPage/>}/>
        </Routes>
      </Layout>
    </HashRouter>
  )
}
