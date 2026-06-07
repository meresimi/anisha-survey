import { useState } from 'react'
import { FlaskConical, ArrowRight } from 'lucide-react'
import styles from './SetupPage.module.css'

export default function SetupPage({ onComplete }) {
  const [form, setForm] = useState({
    researcherName: '', supervisorName: '', institution: 'Solomon Islands National University (SINU)',
    course: 'ENV607 Research Methods I', deadline: '', targetSample: '100',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.researcherName.trim()) e.researcherName = 'Required'
    if (!form.supervisorName.trim()) e.supervisorName = 'Required'
    if (!form.deadline)              e.deadline        = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onComplete(form)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <FlaskConical size={36} color="#16b8a3" />
          <div>
            <h1 className={styles.title}>Welcome to MedWaste Survey</h1>
            <p className={styles.sub}>Set up your research project before you begin</p>
          </div>
        </div>

        <div className={styles.form}>
          <Field label="Your Full Name" error={errors.researcherName}>
            <input value={form.researcherName} onChange={e => set('researcherName', e.target.value)}
              placeholder="e.g. Lorina Anisa" className={errors.researcherName ? styles.errInput : ''} />
          </Field>
          <Field label="Supervisor's Full Name" error={errors.supervisorName}>
            <input value={form.supervisorName} onChange={e => set('supervisorName', e.target.value)}
              placeholder="e.g. Dr. John Smith" className={errors.supervisorName ? styles.errInput : ''} />
          </Field>
          <div className={styles.row}>
            <Field label="Institution">
              <input value={form.institution} onChange={e => set('institution', e.target.value)} />
            </Field>
            <Field label="Course Code">
              <input value={form.course} onChange={e => set('course', e.target.value)} />
            </Field>
          </div>
          <div className={styles.row}>
            <Field label="Submission Deadline" error={errors.deadline}>
              <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)}
                className={errors.deadline ? styles.errInput : ''} />
            </Field>
            <Field label="Target Sample Size">
              <input type="number" value={form.targetSample} onChange={e => set('targetSample', e.target.value)}
                min="1" max="500" />
            </Field>
          </div>
        </div>

        <button className={styles.btn} onClick={handleSubmit}>
          Start Research Project <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
      <label style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</label>
      {children}
      {error && <span style={{ fontSize:11, color:'#c62828' }}>{error}</span>}
    </div>
  )
}
