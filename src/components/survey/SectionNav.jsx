import { BookOpen, AlertTriangle, Wind, Droplets, Settings, FileText, User, CheckCircle2 } from 'lucide-react'
import styles from './SectionNav.module.css'

const ICONS = { User, BookOpen, AlertTriangle, Wind, Droplets, Settings, FileText }

export default function SectionNav({ sections, currentSection, onSelect, getSectionProgress }) {
  return (
    <div className={styles.nav}>
      <div className={styles.title}>Sections</div>
      {sections.map((section, i) => {
        const { answered, total, pct } = getSectionProgress(i)
        const Icon = ICONS[section.icon] || BookOpen
        const isActive = i === currentSection
        const isDone = pct === 100

        return (
          <button
            key={section.id}
            className={`${styles.item} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''}`}
            onClick={() => onSelect(i)}
            style={{ '--section-color': section.color }}
          >
            <div className={styles.iconWrap}>
              {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
            </div>
            <div className={styles.info}>
              <div className={styles.label}>{section.title.replace(/Section [A-Z]: /, '')}</div>
              <div className={styles.progress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                </div>
                <span>{answered}/{total}</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
