import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit2, Trash2, CheckCircle2, Clock, Search, Download,
         AlertTriangle, FileWarning, Mic, Eye, Plus, X } from 'lucide-react'
import { DEPARTMENTS, INTERVIEW_QUESTIONS, OBSERVATION_ITEMS } from '../hooks/useStorage'
import styles from './RespondentsPage.module.css'

export default function RespondentsPage({ storage }) {
  const navigate = useNavigate()
  const [tab, setTab]               = useState('completed')
  const [search, setSearch]         = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showInterviewForm, setShowInterviewForm] = useState(false)
  const [showObsForm, setShowObsForm]             = useState(false)
  const [editingInterview, setEditingInterview]   = useState(null)
  const [editingObs, setEditingObs]               = useState(null)

  const { respondents=[], incomplete=[], interviews=[], observations=[] } = storage.data

  const TABS = [
    { id:'completed',    label:'Completed Surveys',    count: respondents.length,  icon: CheckCircle2 },
    { id:'incomplete',   label:'Incomplete Surveys',   count: incomplete.length,   icon: FileWarning  },
    { id:'interviews',   label:'KII Interviews',       count: interviews.length,   icon: Mic          },
    { id:'observations', label:'Field Observations',   count: observations.length, icon: Eye          },
  ]

  const currentList = tab === 'completed'    ? respondents
                    : tab === 'incomplete'   ? incomplete
                    : tab === 'interviews'   ? interviews
                    : observations

  const filtered = currentList.filter(r => {
    const s = search.toLowerCase()
    return (r.name||'').toLowerCase().includes(s) ||
           (r.answers?.role||'').toLowerCase().includes(s) ||
           (r.answers?.department||r.department||'').toLowerCase().includes(s) ||
           (r.interviewee||'').toLowerCase().includes(s)
  })

  const handleDelete = async (id) => {
    if (tab==='completed')    await storage.deleteRespondent(id)
    if (tab==='incomplete')   await storage.deleteIncomplete(id)
    if (tab==='interviews')   await storage.deleteInterview(id)
    if (tab==='observations') await storage.deleteObservation(id)
    setConfirmDelete(null)
  }

  const exportCSV = () => {
    let headers, rows
    if (tab==='completed'||tab==='incomplete') {
      headers = ['ID','Name','Status','Role','Department','Date']
      rows = currentList.map(r=>[r.id,r.name,r.status,r.answers?.role||'',r.answers?.department||'',
        new Date(r.completedAt||r.savedAt).toLocaleDateString()])
    } else if (tab==='interviews') {
      headers = ['ID','Interviewee','Role','Department','Date']
      rows = interviews.map(r=>[r.id,r.interviewee||'',r.role||'',r.department||'',
        new Date(r.savedAt).toLocaleDateString()])
    } else {
      headers = ['ID','Department','Date','Compliant','Non-compliant']
      rows = observations.map(r=>[r.id,r.department||'',new Date(r.savedAt).toLocaleDateString(),
        Object.values(r.items||{}).filter(v=>v==='yes').length,
        Object.values(r.items||{}).filter(v=>v==='no').length])
    }
    const csv = [headers,...rows].map(r=>r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}))
    a.download = `${tab}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className={styles.page}>
      {/* Summary bar */}
      <div className={styles.summaryBar}>
        {[
          { label:'Completed', value: respondents.length,  color:'var(--green)' },
          { label:'Incomplete',value: incomplete.length,   color:'var(--gold)'  },
          { label:'Interviews',value: interviews.length,   color:'var(--teal)'  },
          { label:'Observed',  value: observations.length, color:'#6a1b9a'      },
        ].map(s => (
          <div key={s.label} className={styles.summaryItem}>
            <div className={styles.summaryVal} style={{color:s.color}}>{s.value}</div>
            <div className={styles.summaryLbl}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id} className={`${styles.tab} ${tab===t.id?styles.activeTab:''}`}
            onClick={() => setTab(t.id)}>
            <t.icon size={14} />
            {t.label}
            <span className={styles.tabCount}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab==='incomplete' && incomplete.length>0 && (
        <div className={styles.infoNote}>
          <AlertTriangle size={14}/> These surveys were saved but not completed. Click Edit to resume.
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon}/>
          <input className={styles.search} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {(tab==='interviews') && (
          <button className={styles.addBtn} onClick={() => { setEditingInterview({ id:null, interviewee:'', role:'', department:'', answers:{} }); setShowInterviewForm(true) }}>
            <Plus size={14}/> New Interview
          </button>
        )}
        {(tab==='observations') && (
          <button className={styles.addBtn} onClick={() => { setEditingObs({ id:null, department:'', items:{} }); setShowObsForm(true) }}>
            <Plus size={14}/> New Observation
          </button>
        )}
        {currentList.length>0 && (
          <button className={styles.exportBtn} onClick={exportCSV}><Download size={14}/> Export CSV</button>
        )}
      </div>

      {/* List */}
      {filtered.length===0 ? (
        <div className={styles.empty}>
          <div style={{fontSize:32}}>📭</div>
          <div>{currentList.length===0 ? `No ${tab} records yet.` : 'No matches found.'}</div>
          {tab==='completed' && currentList.length===0 && (
            <button className={styles.startBtn} onClick={()=>navigate('/survey')}>Start First Survey</button>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {(tab==='completed'||tab==='incomplete') && (
            <div className={styles.listHead}>
              <span>#</span><span>Respondent</span><span>Role</span>
              <span>Department</span><span>Status</span><span>Date</span><span>Actions</span>
            </div>
          )}
          {filtered.map((r,i) => (
            <div key={r.id} className={styles.listRow}>
              {(tab==='completed'||tab==='incomplete') ? (
                <>
                  <span className={styles.rowNum}>{i+1}</span>
                  <span className={styles.rowName}>{r.name||'—'}</span>
                  <span className={styles.rowCell}>{r.answers?.role||'—'}</span>
                  <span className={styles.rowCell}>{r.answers?.department||'—'}</span>
                  <span>
                    <span className={`${styles.badge} ${r.status==='completed'?styles.badgeGreen:styles.badgeGold}`}>
                      {r.status==='completed'?'Completed':'Incomplete'}
                    </span>
                  </span>
                  <span className={styles.rowCell}>{new Date(r.completedAt||r.savedAt).toLocaleDateString()}</span>
                </>
              ) : tab==='interviews' ? (
                <>
                  <span className={styles.rowNum}>{i+1}</span>
                  <span className={styles.rowName}>{r.interviewee||'Unnamed'}</span>
                  <span className={styles.rowCell}>{r.role||'—'}</span>
                  <span className={styles.rowCell}>{r.department||'—'}</span>
                  <span><span className={styles.badge} style={{background:'#e3f2fd',color:'#0277bd'}}>Interview</span></span>
                  <span className={styles.rowCell}>{new Date(r.savedAt).toLocaleDateString()}</span>
                </>
              ) : (
                <>
                  <span className={styles.rowNum}>{i+1}</span>
                  <span className={styles.rowName}>{r.department||'Unnamed'}</span>
                  <span className={styles.rowCell}>
                    ✓ {Object.values(r.items||{}).filter(v=>v==='yes').length} compliant
                  </span>
                  <span className={styles.rowCell}>
                    ✗ {Object.values(r.items||{}).filter(v=>v==='no').length} non-compliant
                  </span>
                  <span><span className={styles.badge} style={{background:'#f3e5f5',color:'#6a1b9a'}}>Observation</span></span>
                  <span className={styles.rowCell}>{new Date(r.savedAt).toLocaleDateString()}</span>
                </>
              )}
              <span className={styles.rowActions}>
                <button className={styles.editBtn}
                  onClick={() => {
                    if (tab==='completed'||tab==='incomplete') navigate(`/survey/${r.id}`)
                    else if (tab==='interviews') { setEditingInterview(r); setShowInterviewForm(true) }
                    else { setEditingObs(r); setShowObsForm(true) }
                  }}>
                  <Edit2 size={13}/>
                </button>
                <button className={styles.deleteBtn} onClick={()=>setConfirmDelete(r.id)}>
                  <Trash2 size={13}/>
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Interview Form Modal */}
      {showInterviewForm && editingInterview && (
        <InterviewFormModal
          interview={editingInterview}
          onSave={async (data) => { await storage.saveInterview(data); setShowInterviewForm(false) }}
          onClose={() => setShowInterviewForm(false)}
        />
      )}

      {/* Observation Form Modal */}
      {showObsForm && editingObs && (
        <ObservationFormModal
          obs={editingObs}
          onSave={async (data) => { await storage.saveObservation(data); setShowObsForm(false) }}
          onClose={() => setShowObsForm(false)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className={styles.overlay}>
          <div className={styles.dialog}>
            <AlertTriangle size={28} color="var(--red)"/>
            <h3>Delete this record?</h3>
            <p>This cannot be undone.</p>
            <div className={styles.dialogBtns}>
              <button className={styles.confirmDel} onClick={()=>handleDelete(confirmDelete)}>Delete</button>
              <button className={styles.cancelDel}  onClick={()=>setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InterviewFormModal({ interview, onSave, onClose }) {
  const [form, setForm] = useState({ ...interview })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const setAns = (k,v) => setForm(f=>({...f, answers:{...f.answers,[k]:v}}))

  return (
    <div className={styles.overlay}>
      <div className={styles.formModal}>
        <div className={styles.formModalHeader}>
          <h3>Key Informant Interview</h3>
          <button onClick={onClose}><X size={18}/></button>
        </div>
        <div className={styles.formModalBody}>
          <div className={styles.formRow}>
            <FormField label="Interviewee Name">
              <input value={form.interviewee||''} onChange={e=>set('interviewee',e.target.value)} placeholder="Name of administrator"/>
            </FormField>
            <FormField label="Role / Position">
              <input value={form.role||''} onChange={e=>set('role',e.target.value)} placeholder="e.g. Waste Management Officer"/>
            </FormField>
          </div>
          <FormField label="Department">
            <select value={form.department||''} onChange={e=>set('department',e.target.value)}>
              <option value="">Select department...</option>
              {DEPARTMENTS.map(d=><option key={d.id} value={d.label}>{d.label}</option>)}
            </select>
          </FormField>
          <div className={styles.interviewQs}>
            {INTERVIEW_QUESTIONS.map((q,i)=>(
              <div key={q.id} className={styles.interviewQBlock}>
                <div className={styles.interviewQNum}>{i+1}</div>
                <div style={{flex:1}}>
                  <div className={styles.interviewQText}>{q.text}</div>
                  <textarea className={styles.interviewAns}
                    value={form.answers?.[q.id]||''}
                    onChange={e=>setAns(q.id,e.target.value)}
                    placeholder="Record response here..." rows={3}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.formModalFooter}>
          <button className={styles.saveBtn} onClick={()=>onSave(form)}>Save Interview</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function ObservationFormModal({ obs, onSave, onClose }) {
  const [form, setForm] = useState({ ...obs, items: obs.items||{} })
  const setItem = (id,v) => setForm(f=>({...f, items:{...f.items,[id]:v}}))
  const setDept = (v) => setForm(f=>({...f, department:v}))

  const opts = ['yes','no','n/a']
  const optLabels = { yes:'✓ Compliant', no:'✗ Non-compliant', 'n/a':'— N/A' }
  const optColors = { yes:'#e8f5e9', no:'#ffebee', 'n/a':'#f1f5f9' }
  const optText   = { yes:'#2e7d32', no:'#c62828', 'n/a':'#64748b' }

  return (
    <div className={styles.overlay}>
      <div className={styles.formModal}>
        <div className={styles.formModalHeader}>
          <h3>Field Observation Checklist</h3>
          <button onClick={onClose}><X size={18}/></button>
        </div>
        <div className={styles.formModalBody}>
          <FormField label="Department Observed">
            <select value={form.department||''} onChange={e=>setDept(e.target.value)}>
              <option value="">Select department...</option>
              {DEPARTMENTS.map(d=><option key={d.id} value={d.label}>{d.label}</option>)}
            </select>
          </FormField>
          <div className={styles.obsNotes}>
            <label style={{fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>General Notes</label>
            <textarea value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}
              placeholder="Any general observations about the department..." rows={2}
              style={{border:'1px solid #e2e8f0',borderRadius:8,padding:'10px 12px',fontFamily:'DM Sans,sans-serif',fontSize:14,resize:'vertical',background:'#f8f5ef',width:'100%'}}/>
          </div>
          {OBSERVATION_ITEMS.map(item=>(
            <div key={item.id} className={styles.obsItem}>
              <div className={styles.obsLabel}>{item.label}</div>
              <div className={styles.obsOpts}>
                {opts.map(o=>(
                  <button key={o}
                    className={`${styles.obsOpt} ${form.items[item.id]===o?styles.obsOptActive:''}`}
                    style={form.items[item.id]===o ? {background:optColors[o],color:optText[o],borderColor:optText[o]} : {}}
                    onClick={()=>setItem(item.id,o)}>
                    {optLabels[o]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.formModalFooter}>
          <button className={styles.saveBtn} onClick={()=>onSave(form)}>Save Observation</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4,flex:1}}>
      <label style={{fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</label>
      {children}
    </div>
  )
}
