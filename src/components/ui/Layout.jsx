import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ClipboardList, BarChart3, Users, Home, Menu, X } from 'lucide-react'
import styles from './Layout.module.css'

const NAV = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/survey', icon: ClipboardList, label: 'New Survey' },
  { to: '/respondents', icon: Users, label: 'Respondents' },
  { to: '/reports', icon: BarChart3, label: 'Reports' }
]

export default function Layout({ children, storage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const count = storage.data.respondents.length
  const currentNav = NAV.find(n => n.to === location.pathname)

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <img src="/icon.png" alt="App Icon" className={styles.brandIcon} />
          <div>
            <div className={styles.brandTitle}>MedWaste Survey</div>
            <div className={styles.brandSub}>Honiara Referral Hospital</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Respondents' && count > 0 && (
                <span className={styles.badge}>{count}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.progressLabel}>
            <span>Survey Progress</span>
            <span className={count >= 100 ? styles.complete : ''}>{count}/100</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${Math.min(count, 100)}%` }} />
          </div>
          <div className={styles.progressSub}>
            {count >= 100 ? '🎉 Target reached!' : `${100 - count} respondents remaining`}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={styles.headerTitle}>
            {currentNav?.label || 'Survey App'}
          </div>

          {/* Floating icon — right side of topbar */}
          <div className={styles.headerRight}>
            {storage.data.lastUpdated && (
              <span className={styles.lastSaved}>
                Saved {new Date(storage.data.lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <div className={styles.topbarIconWrap}>
              <img src="/icon.png" alt="App Icon" className={styles.topbarIcon} />
            </div>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
