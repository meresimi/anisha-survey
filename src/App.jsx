import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useStorage } from './hooks/useStorage'
import Layout from './components/ui/Layout'
import HomePage from './pages/HomePage'
import SurveyPage from './pages/SurveyPage'
import RespondentsPage from './pages/RespondentsPage'
import ReportsPage from './pages/ReportsPage'
import LoadingScreen from './components/ui/LoadingScreen'

export default function App() {
  const storage = useStorage()
  const [splashDone, setSplashDone] = useState(false)

  if (storage.loading || !splashDone) {
    return <LoadingScreen onDone={() => setSplashDone(true)} />
  }

  return (
    <HashRouter>
      <Layout storage={storage}>
        <Routes>
          <Route path="/" element={<HomePage storage={storage} />} />
          <Route path="/survey" element={<SurveyPage storage={storage} />} />
          <Route path="/survey/:respondentId" element={<SurveyPage storage={storage} />} />
          <Route path="/respondents" element={<RespondentsPage storage={storage} />} />
          <Route path="/reports" element={<ReportsPage storage={storage} />} />
          <Route path="/reports/:reportId" element={<ReportsPage storage={storage} />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
