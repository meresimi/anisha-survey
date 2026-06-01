import styles from './ReportCard.module.css'

export function ReportCard({ children, title, accent }) {
  return (
    <div className={styles.card} style={{ '--accent': accent }}>
      {title && <div className={styles.cardTitle}>{title}</div>}
      {children}
    </div>
  )
}

export function SummaryBox({ text, icon: Icon }) {
  return (
    <div className={styles.summary}>
      {Icon && <Icon size={18} className={styles.summaryIcon} />}
      <p>{text}</p>
    </div>
  )
}

export function StatRow({ label, value, pct, color }) {
  return (
    <div className={styles.statRow}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statBar}>
        <div className={styles.statFill} style={{ width: `${pct}%`, background: color || 'var(--teal)' }} />
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statPct}>{pct}%</div>
    </div>
  )
}

export function MetricGrid({ children }) {
  return <div className={styles.metricGrid}>{children}</div>
}

export function Metric({ label, value, sub, color }) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricValue} style={{ color: color || 'var(--navy)' }}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
      {sub && <div className={styles.metricSub}>{sub}</div>}
    </div>
  )
}

export function AlertBox({ type = 'warning', children }) {
  const colors = {
    warning: { bg: '#fff8e1', border: '#ffe082', text: '#7c5700' },
    danger: { bg: '#ffebee', border: '#ef9a9a', text: '#b71c1c' },
    success: { bg: '#e8f5e9', border: '#a5d6a7', text: '#1b5e20' },
    info: { bg: '#e3f2fd', border: '#90caf9', text: '#0d47a1' }
  }
  const c = colors[type]
  return (
    <div className={styles.alertBox} style={{ background: c.bg, borderColor: c.border, color: c.text }}>
      {children}
    </div>
  )
}
