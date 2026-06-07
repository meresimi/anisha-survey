import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Download, FileText, BarChart3, AlertTriangle } from 'lucide-react'
import { computeReports } from '../utils/reportEngine'
import { exportAllReportsToPDF, exportReportToPDF } from '../utils/pdfExport'
import DemographicReport    from '../components/reports/DemographicReport'
import TrainingReport       from '../components/reports/TrainingReport'
import DisposalReport       from '../components/reports/DisposalReport'
import DiseaseReport        from '../components/reports/DiseaseReport'
import EnvironmentalReport  from '../components/reports/EnvironmentalReport'
import PolicyReport         from '../components/reports/PolicyReport'
import ChallengesReport     from '../components/reports/ChallengesReport'
import SafetyReport         from '../components/reports/SafetyReport'
import CompositeReport      from '../components/reports/CompositeReport'
import styles from './ReportsPage.module.css'

const REPORT_LIST = [
  { id:'demographic',   label:'1. Demographic Profile',            component:DemographicReport,   color:'#1a6b8a' },
  { id:'training',      label:'2. Training & Awareness',           component:TrainingReport,       color:'#2e7d32' },
  { id:'disposal',      label:'3. Disposal Practices',             component:DisposalReport,       color:'#6a1b9a' },
  { id:'disease',       label:'4. Disease Transmission',           component:DiseaseReport,        color:'#c62828' },
  { id:'environmental', label:'5. Environmental Pollution',        component:EnvironmentalReport,  color:'#0277bd' },
  { id:'policy',        label:'6. Policy & Regulation',            component:PolicyReport,         color:'#37474f' },
  { id:'challenges',    label:'7. Challenges & Recommendations',   component:ChallengesReport,     color:'#e65100' },
  { id:'safety',        label:'8. Safety Perception & Qualitative',component:SafetyReport,         color:'#0e8a7a' },
  { id:'composite',     label:'9. Composite Risk Score',           component:CompositeReport,      color:'#0f1f3d' },
]

export default function ReportsPage({ storage }) {
  const { reportId } = useParams()
  const navigate     = useNavigate()
  const [active, setActive]     = useState(reportId || 'demographic')
  const [exporting, setExporting] = useState(false)

  const { respondents=[] } = storage.data

  if (respondents.length === 0) {
    return (
      <div className={styles.empty}>
        <BarChart3 size={40} color="#94a3b8"/>
        <h2>No Data Yet</h2>
        <p>Complete at least one survey to generate reports.</p>
        <button className={styles.startBtn} onClick={() => navigate('/survey')}>Start Survey</button>
      </div>
    )
  }

  const reports  = computeReports(respondents)
  const current  = REPORT_LIST.find(r => r.id === active)
  const CurrentC = current?.component

  const handleExportAll = async () => {
    setExporting(true)
    try { await exportAllReportsToPDF(reports) } finally { setExporting(false) }
  }
  const handleExportCurrent = async () => {
    setExporting(true)
    try { await exportReportToPDF(`report-${active}`, `AnisaSurvey_${current.label.replace(/[^a-zA-Z]/g,'_')}.pdf`) }
    finally { setExporting(false) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Reports</div>
        {REPORT_LIST.map(r => (
          <button key={r.id}
            className={`${styles.reportItem} ${active===r.id?styles.active:''}`}
            style={ active===r.id ? { borderLeft:`3px solid ${r.color}`, color:r.color } : {} }
            onClick={() => { setActive(r.id); navigate(`/reports/${r.id}`) }}>
            <span className={styles.reportDot} style={ active===r.id ? { background:r.color } : {} }/>
            {r.label}
          </button>
        ))}
        <div className={styles.sidebarFooter}>
          <button className={styles.exportAllBtn} onClick={handleExportAll} disabled={exporting}>
            <Download size={14}/> {exporting ? 'Exporting...' : 'Export All to PDF'}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.reportHeader}>
          <div>
            <div className={styles.reportTitle}>{current?.label}</div>
            <div className={styles.reportMeta}>
              Based on {respondents.length} respondents · Honiara Referral Hospital
            </div>
            {reports[active]?.hypothesisLink && (
              <div className={styles.hypothesisLink}>
                🔗 {reports[active].hypothesisLink}
              </div>
            )}
          </div>
          <button className={styles.exportBtn} onClick={handleExportCurrent} disabled={exporting}>
            <FileText size={15}/> Export PDF
          </button>
        </div>

        <div id={`report-${active}`} className={styles.reportBody}>
          {CurrentC && <CurrentC data={reports[active]}/>}
        </div>
      </div>
    </div>
  )
}
