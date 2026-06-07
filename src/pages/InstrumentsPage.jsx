import { useState } from 'react'
import { SURVEY_SECTIONS } from '../data/questions'
import { INTERVIEW_QUESTIONS, OBSERVATION_ITEMS } from '../hooks/useStorage'
import styles from './InstrumentsPage.module.css'

const TABS = ['Questionnaire','Interview Guide','Observation Checklist']

export default function InstrumentsPage() {
  const [tab, setTab] = useState(0)
  const [openSection, setOpenSection] = useState(0)

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {TABS.map((t,i) => (
          <button key={t} className={`${styles.tab} ${tab===i ? styles.active:''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className={styles.content}>
          <div className={styles.infoBox}>
            All 8 sections of the digital questionnaire. Use this as a reference during fieldwork.
          </div>
          {SURVEY_SECTIONS.map((section, si) => (
            <div key={section.id} className={styles.section}>
              <button className={styles.sectionHeader}
                style={{ borderLeft:`4px solid ${section.color}` }}
                onClick={() => setOpenSection(openSection===si ? -1 : si)}>
                <span className={styles.sectionTitle}>{section.title}</span>
                <span className={styles.sectionCount}>{section.questions.length} questions</span>
                <span className={styles.chevron}>{openSection===si ? '▲':'▼'}</span>
              </button>
              {openSection===si && (
                <div className={styles.questions}>
                  {section.questions.map((q,qi) => (
                    <div key={q.id} className={styles.question}>
                      <div className={styles.qNum} style={{ background: section.color }}>{qi+1}</div>
                      <div className={styles.qContent}>
                        <div className={styles.qText}>{q.text}</div>
                        {q.hint && <div className={styles.qHint}>{q.hint}</div>}
                        {q.options && (
                          <div className={styles.options}>
                            {q.options.map(o => <span key={o} className={styles.option}>{o}</span>)}
                          </div>
                        )}
                        {q.type === 'rating' && (
                          <div className={styles.ratingRange}>
                            Rating 1–{q.max} &nbsp;·&nbsp;
                            {Object.entries(q.labels).map(([k,v]) => `${k}=${v}`).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 1 && (
        <div className={styles.content}>
          <div className={styles.infoBox}>
            Key informant interview guide for senior administrators and waste management officers.
            Each question should be followed by the validation probe shown in italics.
          </div>
          {INTERVIEW_QUESTIONS.map((q,i) => (
            <div key={q.id} className={styles.interviewQ}>
              <div className={styles.iNum}>{i+1}</div>
              <div className={styles.iText}>{q.text}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className={styles.content}>
          <div className={styles.infoBox}>
            Field observation checklist. Complete one per department visited.
            Tick each item as compliant or non-compliant during your observation.
          </div>
          <div className={styles.checklistGrid}>
            {OBSERVATION_ITEMS.map((item,i) => (
              <div key={item.id} className={styles.checkItem}>
                <div className={styles.checkBoxes}>
                  <span className={styles.checkYes}>✓ Compliant</span>
                  <span className={styles.checkNo}>✗ Non-compliant</span>
                  <span className={styles.checkNA}>— N/A</span>
                </div>
                <div className={styles.checkLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
