import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit2, Trash2, CheckCircle2, Clock, Search, Download, AlertTriangle, FileWarning } from 'lucide-react'
import styles from './RespondentsPage.module.css'

export default function RespondentsPage({ storage }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('completed')  // 'completed' | 'incomplete'
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { respondents = [], incomplete = [] } = storage.data
  const list = tab === 'completed' ? respondents : incomplete

  const filtered = list.filter(r => {
    return (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.answers?.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.answers?.department || '').toLowerCase().includes(search.toLowerCase())
  })

  const handleDelete = async (id) => {
    if (tab === 'completed') await storage.deleteRespondent(id)
    else await storage.deleteIncomplete(id)
    setConfirmDelete(null)
  }

  const exportCSV = () => {
    const headers = ['ID','Name','Status','Role','Department','Date']
    const rows = list.map(r => [
      r.id, r.name, r.status,
      r.answers?.role || '', r.answers?.department || '',
      new Date(r.completedAt || r.savedAt).toLocaleDateString()
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `respondents-${tab}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'completed' ? styles.activeTab : ''}`} onClick={() => setTab('completed')}>
          <CheckCircle2 size={15} /> Completed Surveys
          <span className={styles.tabCount}>{respondents.length}</span>
        </button>
        <button className={`${styles.tab} ${tab === 'incomplete' ? styles.activeTab : ''}`} onClick={() => setTab('incomplete')}>
          <FileWarning size={15} /> Incomplete Surveys
          <span className={`${styles.tabCount} ${styles.tabCountWarning}`}>{incomplete.length}</span>
        </button>
      </div>

      {tab === 'incomplete' && incomplete.length > 0 && (
        <div className={styles.incompleteNote}>
          <AlertTriangle size={15} />
          These surveys were saved but not completed. Click Edit to resume and complete them.
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input className={styles.search} placeholder="Search by name, role, department..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {list.length > 0 && (
          <button className={styles.exportBtn} onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          {tab === 'completed' ? <CheckCircle2 size={32} color="var(--text-muted)" /> : <FileWarning size={32} color="var(--text-muted)" />}
          <div>{list.length === 0
            ? tab === 'completed' ? 'No completed surveys yet.' : 'No incomplete surveys saved.'
            : 'No respondents match your search.'
          }</div>
          {tab === 'completed' && list.length === 0 && (
            <button className={styles.startBtn} onClick={() => navigate('/survey')}>Start First Survey</button>
          )}
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>#</div><div>Respondent</div><div>Role</div><div>Department</div><div>Status</div><div>Date</div><div>Actions</div>
          </div>
          {filtered.map((r, i) => (
            <div key={r.id} className={styles.row}>
              <div className={styles.rowNum}>{i + 1}</div>
              <div className={styles.rowName}>{r.name || '—'}</div>
              <div className={styles.rowCell}>{r.answers?.role || '—'}</div>
              <div className={styles.rowCell}>{r.answers?.department || '—'}</div>
              <div>
                <span className={`${styles.status} ${r.status === 'completed' ? styles.completed : styles.inProgress}`}>
                  {r.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {r.status === 'completed' ? 'Completed' : 'Incomplete'}
                </span>
              </div>
              <div className={styles.rowCell}>
                {new Date(r.completedAt || r.savedAt).toLocaleDateString()}
              </div>
              <div className={styles.rowActions}>
                <button className={styles.editBtn}
                  onClick={() => navigate(`/survey/${r.id}`)} title={tab === 'incomplete' ? 'Resume survey' : 'View'}>
                  <Edit2 size={14} />
                </button>
                <button className={styles.deleteBtn} onClick={() => setConfirmDelete(r.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <AlertTriangle size={28} color="var(--red)" />
            <h3>Delete Respondent?</h3>
            <p>This will permanently remove this respondent's data.</p>
            <div className={styles.dialogBtns}>
              <button className={styles.confirmDelete} onClick={() => handleDelete(confirmDelete)}>Yes, Delete</button>
              <button className={styles.cancelDelete} onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
