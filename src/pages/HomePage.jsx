import { useNavigate } from 'react-router-dom'
import { ClipboardList, BarChart3, Users, AlertTriangle, CheckCircle2, Clock, TrendingUp, FileWarning } from 'lucide-react'
import { computeReports } from '../utils/reportEngine'
import styles from './HomePage.module.css'

export default function HomePage({ storage }) {
  const navigate = useNavigate()
  const { respondents = [], incomplete = [] } = storage.data
  const n = respondents.length  // only completed
  const reports = n > 0 ? computeReports(respondents) : null

  const today = respondents.filter(r => {
    const d = new Date(r.completedAt)
    return d.toDateString() === new Date().toDateString()
  }).length

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div>
          <h1 className={styles.heroTitle}>Medical Hazardous Waste Survey</h1>
          <p className={styles.heroSub}>Honiara Referral Hospital · Solomon Islands · Research by Lorina Anisa</p>
        </div>
        <button className={styles.startBtn} onClick={() => navigate('/survey')}>
          <ClipboardList size={18} /> Start New Survey
        </button>
      </div>

      {/* Hypothesis */}
      <div className={styles.hypothesisCard}>
        <div className={styles.hypothesisLabel}>Research Hypothesis</div>
        <p className={styles.hypothesisText}>
          "Inadequate training, insufficient disposal infrastructure, and weak enforcement of waste management
          protocols in Honiara's medical centers are significantly contributing to increased risks of disease
          transmission, air pollution, soil degradation, and water contamination, thereby posing serious health
          and environmental threats to healthcare workers and surrounding communities in the Solomon Islands."
        </p>
      </div>

      {/* Stats — 4 cards, completed surveys only */}
      <div className={styles.statsGrid}>
        <StatCard icon={CheckCircle2} color="var(--green)"      label="Completed Surveys"  value={n}              sub="fully answered" />
        <StatCard icon={FileWarning}  color="var(--gold)"       label="Incomplete Surveys" value={incomplete.length} sub="saved, not submitted" />
        <StatCard icon={TrendingUp}   color="var(--teal)"       label="Completed Today"    value={today}          sub="new responses" />
        <StatCard icon={Users}        color="var(--navy-light)"  label="Target Progress"    value={`${n}/100`}     sub="respondents" />
      </div>

      {/* Progress bar toward 100 */}
      <div className={styles.targetCard}>
        <div className={styles.targetHeader}>
          <span>Survey Progress to Target (100)</span>
          <span className={n >= 100 ? styles.targetDone : ''}>{n >= 100 ? '🎉 Target Reached!' : `${100 - n} remaining`}</span>
        </div>
        <div className={styles.targetBar}>
          <div className={styles.targetFill} style={{ width: `${Math.min(n, 100)}%` }} />
        </div>
      </div>

      {/* Composite score */}
      {reports && (
        <div className={styles.compositeCard}>
          <div className={styles.compositeLeft}>
            <div className={styles.compositeTitle}>Current Composite Risk Score</div>
            <div className={styles.compositeScore} style={{ color: reports.composite.overallRisk.color }}>
              {reports.composite.overallScore}<span className={styles.compositeMax}>/100</span>
            </div>
            <div className={styles.compositeRisk} style={{ background: reports.composite.overallRisk.color }}>
              {reports.composite.overallRisk.level}
            </div>
          </div>
          <div className={styles.compositeDimensions}>
            {reports.composite.dimensions.map(d => (
              <div key={d.name} className={styles.dimension}>
                <div className={styles.dimensionName}>{d.name}</div>
                <div className={styles.dimensionBar}>
                  <div className={styles.dimensionFill} style={{ width: `${d.score}%`, background: d.color }} />
                </div>
                <div className={styles.dimensionScore}>{d.score}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className={styles.actionsGrid}>
        <ActionCard icon={ClipboardList} title="Conduct Survey"       desc="Start a new survey with a hospital staff member"           color="var(--teal)"       onClick={() => navigate('/survey')} />
        <ActionCard icon={Users}         title="View Respondents"     desc={`Manage all ${n} completed + ${incomplete.length} incomplete responses`} color="var(--navy-light)"  onClick={() => navigate('/respondents')} />
        <ActionCard icon={BarChart3}     title="View Reports"         desc={n > 0 ? 'View and export all 8 analysis reports' : 'Complete surveys to unlock reports'} color={n > 0 ? 'var(--gold)' : 'var(--slate)'} onClick={() => n > 0 && navigate('/reports')} disabled={n === 0} />
      </div>

      {n === 0 && incomplete.length === 0 && (
        <div className={styles.emptyNote}>
          <AlertTriangle size={16} />
          No survey data yet. Start by conducting surveys with hospital personnel.
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, color, label, value, sub }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: color + '18', color }}><Icon size={20} /></div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSub}>{sub}</div>
    </div>
  )
}

function ActionCard({ icon: Icon, title, desc, color, onClick, disabled }) {
  return (
    <button className={`${styles.actionCard} ${disabled ? styles.disabled : ''}`} onClick={onClick} disabled={disabled}>
      <div className={styles.actionIcon} style={{ background: color + '18', color }}><Icon size={22} /></div>
      <div className={styles.actionTitle}>{title}</div>
      <div className={styles.actionDesc}>{desc}</div>
    </button>
  )
}
