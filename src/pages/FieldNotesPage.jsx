import { useState } from 'react'
import { Plus, Trash2, BookOpen } from 'lucide-react'
import { RESEARCH_PHASES } from '../hooks/useStorage'
import styles from './FieldNotesPage.module.css'

export default function FieldNotesPage({ storage }) {
  const [text, setText] = useState('')
  const { fieldNotes = [], currentPhase } = storage.data

  const handleAdd = async () => {
    if (!text.trim()) return
    await storage.addFieldNote(text.trim())
    setText('')
  }

  const sorted = [...fieldNotes].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div className={styles.page}>
      <div className={styles.composer}>
        <div className={styles.phaseTag} style={{ background: RESEARCH_PHASES[currentPhase]?.color }}>
          {RESEARCH_PHASES[currentPhase]?.label}
        </div>
        <textarea className={styles.textarea} value={text} onChange={e => setText(e.target.value)}
          placeholder="Record a field observation, anomaly, administrator comment, or anything noteworthy..."
          rows={4} />
        <button className={styles.addBtn} onClick={handleAdd} disabled={!text.trim()}>
          <Plus size={16} /> Add Note
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className={styles.empty}>
          <BookOpen size={32} color="#94a3b8" />
          <p>No field notes yet. Start recording observations as you collect data.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {sorted.map(note => (
            <div key={note.id} className={styles.note}>
              <div className={styles.noteMeta}>
                <span className={styles.notePhase}
                  style={{ background: RESEARCH_PHASES[note.phase]?.color + '22',
                           color: RESEARCH_PHASES[note.phase]?.color }}>
                  {RESEARCH_PHASES[note.phase]?.short}
                </span>
                <span className={styles.noteTime}>
                  {new Date(note.timestamp).toLocaleString()}
                </span>
                <button className={styles.deleteBtn} onClick={() => storage.deleteFieldNote(note.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
              <p className={styles.noteText}>{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
