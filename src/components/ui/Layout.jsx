import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ClipboardList, BarChart3, Users, Home, Menu, X, BookOpen, FileEdit } from 'lucide-react'
import { RESEARCH_PHASES } from '../../hooks/useStorage'
import styles from './Layout.module.css'

const NAV = [
  { to:'/',            icon:Home,         label:'Dashboard'    },
  { to:'/survey',      icon:ClipboardList,label:'New Survey'   },
  { to:'/respondents', icon:Users,        label:'Respondents'  },
  { to:'/reports',     icon:BarChart3,    label:'Reports'      },
  { to:'/fieldnotes',  icon:FileEdit,     label:'Field Notes'  },
  { to:'/instruments', icon:BookOpen,     label:'Instruments'  },
]

export default function Layout({ children, storage }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { respondents=[], incomplete=[], interviews=[], observations=[], currentPhase=0, setup } = storage.data
  const n = respondents.length
  const target = parseInt(setup?.targetSample||100)

  return (
    <div className={styles.root}>
      <aside className={`${styles.sidebar} ${open?styles.open:''}`}>
        <div className={styles.brand}>
          <img src="/icon.png" alt="icon" className={styles.brandIcon}/>
          <div>
            <div className={styles.brandTitle}>MedWaste Survey</div>
            <div className={styles.brandSub}>{setup?.researcherName||'Honiara Referral Hospital'}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({to,icon:Icon,label}) => (
            <NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}
              className={({isActive})=>`${styles.navItem} ${isActive?styles.active:''}`}>
              <Icon size={17}/>
              <span>{label}</span>
              {label==='Respondents' && (
                <span className={styles.badge}>{n}|{interviews.length}|{observations.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Phase indicator */}
        <div className={styles.phaseSection}>
          <div className={styles.phaseSectionTitle}>Current Phase</div>
          <div className={styles.phaseIndicator}
            style={{background:RESEARCH_PHASES[currentPhase]?.color}}>
            {RESEARCH_PHASES[currentPhase]?.label}
          </div>
          <div className={styles.phaseDots}>
            {RESEARCH_PHASES.map((_,i)=>(
              <div key={i} className={`${styles.phaseDot} ${i<=currentPhase?styles.phaseDotActive:''}`}
                style={i<=currentPhase?{background:RESEARCH_PHASES[i].color}:{}}/>
            ))}
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.progressLabel}>
            <span>Survey Progress</span>
            <span className={n>=target?styles.complete:''}>{n}/{target}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{width:`${Math.min((n/target)*100,100)}%`}}/>
          </div>
          <div className={styles.progressSub}>
            {n>=target?'🎉 Target reached!':`${target-n} respondents remaining`}
          </div>
        </div>
      </aside>

      {open && <div className={styles.overlay} onClick={()=>setOpen(false)}/>}

      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={()=>setOpen(!open)}>
            {open?<X size={20}/>:<Menu size={20}/>}
          </button>
          <div className={styles.headerTitle}>
            {NAV.find(n=>n.to===location.pathname)?.label||'Survey App'}
          </div>
          <div className={styles.headerRight}>
            {storage.data.lastUpdated && (
              <span className={styles.lastSaved}>
                Saved {new Date(storage.data.lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <div className={styles.topbarIconWrap}>
              <img src="/icon.png" alt="icon" className={styles.topbarIcon}/>
            </div>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
