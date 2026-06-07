import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ClipboardList, BarChart3, Users, Home, Menu, X,
         BookOpen, FileEdit, LogOut, AlertTriangle } from 'lucide-react'
import { RESEARCH_PHASES } from '../../hooks/useStorage'
import styles from './Layout.module.css'

const NAV = [
  { to:'/',            icon:Home,          label:'Dashboard'   },
  { to:'/survey',      icon:ClipboardList, label:'New Survey'  },
  { to:'/respondents', icon:Users,         label:'Respondents' },
  { to:'/reports',     icon:BarChart3,     label:'Reports'     },
  { to:'/fieldnotes',  icon:FileEdit,      label:'Field Notes' },
  { to:'/instruments', icon:BookOpen,      label:'Instruments' },
]

// Routes considered "child screens" — back button returns to Dashboard
const CHILD_ROUTES = [
  '/survey', '/respondents', '/reports', '/fieldnotes', '/instruments'
]

export default function Layout({ children, storage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showExitModal, setShowExitModal]   = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const { respondents=[], incomplete=[], interviews=[], observations=[],
          currentPhase=0, setup } = storage.data
  const n      = respondents.length
  const target = parseInt(setup?.targetSample || 100)

  const isDashboard = location.pathname === '/'
  const isChild     = CHILD_ROUTES.some(r =>
    location.pathname === r || location.pathname.startsWith(r + '/')
  )

  // ── Android hardware back button ──────────────────────
  useEffect(() => {
    const handleBack = (e) => {
      // Capacitor / Cordova back button event
      if (e.type === 'backbutton') {
        e.preventDefault?.()
        e.stopPropagation?.()
        if (isDashboard) {
          setShowExitModal(true)
        } else if (isChild) {
          navigate('/')
        }
      }
    }

    // Standard browser/Capacitor back event
    document.addEventListener('backbutton', handleBack, false)

    // Also handle popstate for web/Electron
    const handlePop = () => {
      if (isDashboard) setShowExitModal(true)
    }
    window.addEventListener('popstate', handlePop)

    return () => {
      document.removeEventListener('backbutton', handleBack, false)
      window.removeEventListener('popstate', handlePop)
    }
  }, [isDashboard, isChild, navigate])

  // Push a dummy state so popstate fires when back is pressed on dashboard
  useEffect(() => {
    if (isDashboard) {
      window.history.pushState({ dashboard: true }, '')
    }
  }, [isDashboard])

  const handleExitApp = () => {
    // On Capacitor Android — exit the app
    if (window.Capacitor?.Plugins?.App) {
      window.Capacitor.Plugins.App.exitApp()
    } else if (navigator.app?.exitApp) {
      navigator.app.exitApp()
    } else {
      window.close()
    }
  }

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <img src="/icon.png" alt="icon" className={styles.brandIcon} />
          <div>
            <div className={styles.brandTitle}>MedWaste Survey</div>
            <div className={styles.brandSub}>{setup?.researcherName || 'Honiara Referral Hospital'}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <Icon size={17} />
              <span>{label}</span>
              {label === 'Respondents' && (
                <span className={styles.badge}>
                  {n}|{interviews.length}|{observations.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Phase indicator */}
        <div className={styles.phaseSection}>
          <div className={styles.phaseSectionTitle}>Current Phase</div>
          <div className={styles.phaseIndicator}
            style={{ background: RESEARCH_PHASES[currentPhase]?.color }}>
            {RESEARCH_PHASES[currentPhase]?.label}
          </div>
          <div className={styles.phaseDots}>
            {RESEARCH_PHASES.map((ph, i) => (
              <div key={i} className={styles.phaseDot}
                style={i <= currentPhase ? { background: ph.color } : {}} />
            ))}
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.progressLabel}>
            <span>Survey Progress</span>
            <span className={n >= target ? styles.complete : ''}>{n}/{target}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}
              style={{ width: `${Math.min((n / target) * 100, 100)}%` }} />
          </div>
          <div className={styles.progressSub}>
            {n >= target ? '🎉 Target reached!' : `${target - n} respondents remaining`}
          </div>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.header}>
          {/* Left — hamburger */}
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Centre — absolutely positioned so it is always truly centred */}
          <div className={styles.headerCenter}>
            <span className={styles.headerTitle}>
              {NAV.find(n => n.to === location.pathname)?.label ||
               (location.pathname.startsWith('/survey/') ? 'Survey' :
                location.pathname.startsWith('/reports/') ? 'Reports' : 'Survey App')}
            </span>
          </div>

          {/* Right — saved time + floating icon */}
          <div className={styles.headerRight}>
            {storage.data.lastUpdated && (
              <span className={styles.lastSaved}>
                Saved {new Date(storage.data.lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <img src="/icon.png" alt="App Icon" className={styles.topbarIcon} />
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* Exit confirmation modal (Android back on Dashboard) */}
      {showExitModal && (
        <div className={styles.exitOverlay}>
          <div className={styles.exitModal}>
            <div className={styles.exitIcon}>
              <AlertTriangle size={30} color="#d4a843" />
            </div>
            <div className={styles.exitTitle}>Exit App?</div>
            <div className={styles.exitText}>
              Are you sure you want to exit MedWaste Survey?
              Any unsaved survey progress will be lost.
            </div>
            <div className={styles.exitBtns}>
              <button className={styles.exitConfirm} onClick={handleExitApp}>
                <LogOut size={16} style={{ marginRight: 6 }} />
                Yes, Exit App
              </button>
              <button className={styles.exitCancel} onClick={() => setShowExitModal(false)}>
                Stay in App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
