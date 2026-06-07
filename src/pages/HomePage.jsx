import { useNavigate } from 'react-router-dom'
import { ClipboardList, BarChart3, Users, AlertTriangle, CheckCircle2,
         FileWarning, TrendingUp, Calendar, Shield, BookOpen, Download } from 'lucide-react'
import { RESEARCH_PHASES, DEPARTMENTS } from '../hooks/useStorage'
import { computeReports } from '../utils/reportEngine'
import styles from './HomePage.module.css'

export default function HomePage({ storage }) {
  const navigate   = useNavigate()
  const { respondents=[], incomplete=[], interviews=[], observations=[], setup, currentPhase=0 } = storage.data
  const n          = respondents.length
  const target     = parseInt(setup?.targetSample || 100)
  const reports    = n >= 20 ? computeReports(respondents) : null
  const days       = storage.daysToDeadline()
  const quality    = storage.dataQuality()
  const deptCounts = storage.deptCounts()

  const today = respondents.filter(r => {
    return new Date(r.completedAt).toDateString() === new Date().toDateString()
  }).length

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div>
          <div className={styles.heroLabel}>Research by {setup?.researcherName || 'Lorina Anisa'}</div>
          <h1 className={styles.heroTitle}>Medical Hazardous Waste Survey</h1>
          <p className={styles.heroSub}>Honiara Referral Hospital · Solomon Islands · {setup?.course || 'SINU ENV607'}</p>
        </div>
        <div className={styles.heroRight}>
          {days !== null && (
            <div className={`${styles.deadline} ${days < 14 ? styles.deadlineUrgent : ''}`}>
              <Calendar size={15} />
              <span>{days > 0 ? `${days} days to deadline` : days === 0 ? 'Due today!' : `${Math.abs(days)} days overdue`}</span>
            </div>
          )}
          <button className={styles.startBtn} onClick={() => navigate('/survey')}>
            <ClipboardList size={17} /> New Survey
          </button>
        </div>
      </div>

      {/* Hypothesis */}
      <div className={styles.hypothesisCard}>
        <div className={styles.hypothesisLabel}>Research Hypothesis</div>
        <div className={styles.hypothesisSplit}>
          <div className={styles.causes}>
            <div className={styles.causeLabel}>THREE CAUSES</div>
            {['Inadequate training','Insufficient disposal infrastructure','Weak enforcement of protocols'].map((c,i) => (
              <div key={i} className={styles.causeItem}><span className={styles.causeDot} />{c}</div>
            ))}
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.effects}>
            <div className={styles.effectLabel}>FOUR EFFECTS</div>
            {['Disease transmission','Air pollution','Soil degradation','Water contamination'].map((e,i) => (
              <div key={i} className={styles.effectItem}><span className={styles.effectDot} />{e}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase tracker */}
      <div className={styles.phaseCard}>
        <div className={styles.phaseHeader}>
          <span className={styles.phaseCardTitle}>Research Phase</span>
          <span className={styles.phaseCardSub}>{currentPhase + 1} of {RESEARCH_PHASES.length}</span>
        </div>
        <div className={styles.phases}>
          {RESEARCH_PHASES.map((ph, i) => (
            <button key={ph.id}
              className={`${styles.phase} ${i === currentPhase ? styles.phaseActive : ''} ${i < currentPhase ? styles.phaseDone : ''}`}
              style={ i === currentPhase ? { background: ph.color, borderColor: ph.color } : i < currentPhase ? { borderColor: ph.color, color: ph.color } : {} }
              onClick={() => storage.setPhase(i)}>
              {i < currentPhase ? '✓ ' : ''}{ph.short}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon={CheckCircle2} color="var(--green)"      label="Completed Surveys"   value={n}                  sub={`of ${target} target`} />
        <StatCard icon={FileWarning}  color="var(--gold)"       label="Incomplete Surveys"  value={incomplete.length}  sub="saved, not submitted" />
        <StatCard icon={Users}        color="var(--navy-light)"  label="Interviews Done"     value={interviews.length}  sub="administrator KIIs" />
        <StatCard icon={Shield}       color="var(--teal)"       label="Depts Observed"      value={observations.length} sub="field checklists" />
        <StatCard icon={TrendingUp}   color="var(--purple,#6a1b9a)" label="Surveyed Today"  value={today}              sub="new responses" />
        <StatCard icon={CheckCircle2} color="var(--teal)"       label="Data Quality"        value={`${quality}%`}      sub="fully answered surveys" />
      </div>

      {/* Department coverage */}
      <div className={styles.deptCard}>
        <div className={styles.deptTitle}>Department Coverage Tracker</div>
        <div className={styles.deptGrid}>
          {deptCounts.map(d => {
            const pct = Math.min(Math.round((d.count / d.target) * 100), 100)
            const done = pct >= 100
            return (
              <div key={d.id} className={styles.dept}>
                <div className={styles.deptName}>{d.label}</div>
                <div className={styles.deptBar}>
                  <div className={styles.deptFill}
                    style={{ width:`${pct}%`, background: done ? '#2e7d32' : '#0e8a7a' }} />
                </div>
                <div className={styles.deptCount}
                  style={{ color: done ? '#2e7d32' : '#64748b' }}>
                  {d.count}/{d.target}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Composite score — only after 20 surveys */}
      {reports ? (
        <div className={styles.compositeCard}>
          <div className={styles.compositeLeft}>
            <div className={styles.compositeTitle}>Composite Risk Score</div>
            <div className={styles.compositeScore} style={{ color: reports.composite.overallRisk.color }}>
              {reports.composite.overallScore}<span className={styles.compositeMax}>/100</span>
            </div>
            <div className={styles.compositeRisk} style={{ background: reports.composite.overallRisk.color }}>
              {reports.composite.overallRisk.level}
            </div>
            <div className={styles.compositeSub}>Based on {n} respondents</div>
          </div>
          <div className={styles.compositeDimensions}>
            {reports.composite.dimensions.map(d => (
              <div key={d.name} className={styles.dimension}>
                <div className={styles.dimensionName}>{d.name}</div>
                <div className={styles.dimensionBar}>
                  <div className={styles.dimensionFill} style={{ width:`${d.score}%`, background:d.color }} />
                </div>
                <div className={styles.dimensionScore}>{d.score}%</div>
              </div>
            ))}
          </div>
        </div>
      ) : n > 0 && n < 20 ? (
        <div className={styles.notEnough}>
          <AlertTriangle size={16} />
          Composite risk score unlocks after 20 completed surveys ({20-n} more needed).
        </div>
      ) : null}

      {/* Quick actions */}
      <div className={styles.actionsGrid}>
        <ActionCard icon={ClipboardList} title="Conduct Survey"      color="var(--teal)"         onClick={() => navigate('/survey')} desc="Start a new survey with hospital staff" />
        <ActionCard icon={Users}         title="View Respondents"    color="var(--navy-light)"    onClick={() => navigate('/respondents')} desc={`${n} completed · ${incomplete.length} incomplete · ${interviews.length} interviews`} />
        <ActionCard icon={BarChart3}     title="View Reports"        color={n>=1?"var(--gold)":"var(--slate)"} onClick={() => n>=1 && navigate('/reports')} desc={n>=1?"View and export all reports":"Complete surveys to unlock"} disabled={n<1} />
        <ActionCard icon={BookOpen}      title="Field Notes"         color="var(--purple,#6a1b9a)" onClick={() => navigate('/fieldnotes')} desc={`${storage.data.fieldNotes?.length||0} notes recorded`} />
        <ActionCard icon={Download}      title="Export All Data"     color="var(--green)"         onClick={storage.exportAll} desc="Download full JSON backup" />
        <ActionCard icon={Shield}        title="Research Instruments" color="var(--slate)"        onClick={() => navigate('/instruments')} desc="View questionnaire, interview guide, checklist" />
      </div>

      {n === 0 && (
        <div className={styles.emptyNote}>
          <AlertTriangle size={15} />
          No survey data yet. Start by conducting surveys with hospital personnel.
        </div>
      )}
    </div>
  )
}

function StatCard({ icon:Icon, color, label, value, sub }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background:color+'22', color }}><Icon size={19}/></div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSub}>{sub}</div>
    </div>
  )
}
function ActionCard({ icon:Icon, title, desc, color, onClick, disabled }) {
  return (
    <button className={`${styles.actionCard} ${disabled?styles.disabled:''}`} onClick={onClick} disabled={disabled}>
      <div className={styles.actionIcon} style={{ background:color+'22', color }}><Icon size={21}/></div>
      <div className={styles.actionTitle}>{title}</div>
      <div className={styles.actionDesc}>{desc}</div>
    </button>
  )
}
