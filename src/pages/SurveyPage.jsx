import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ChevronLeft, CheckCircle2, X, AlertTriangle } from 'lucide-react'
import { SURVEY_SECTIONS } from '../data/questions'
import QuestionBlock from '../components/survey/QuestionBlock'
import SectionNav from '../components/survey/SectionNav'
import styles from './SurveyPage.module.css'

export default function SurveyPage({ storage }) {
  const navigate = useNavigate()
  const { respondentId } = useParams()
  const questionsRef = useRef(null)

  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [respondentName, setRespondentName] = useState(`Respondent #${storage.data.respondents.length + 1}`)
  const [incompleteId, setIncompleteId] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [shakeNext, setShakeNext] = useState(false)

  // Load existing incomplete if editing
  useEffect(() => {
    if (respondentId) {
      const r = [...(storage.data.respondents || []), ...(storage.data.incomplete || [])]
        .find(r => r.id === respondentId)
      if (r) {
        setAnswers(r.answers || {})
        setRespondentName(r.name || '')
        if (r.status === 'incomplete') setIncompleteId(r.id)
        if (r.sectionReached) setCurrentSection(r.sectionReached)
      }
    }
  }, [respondentId])

  const section = SURVEY_SECTIONS[currentSection]

  const updateAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    // clear error for this field when answered
    setValidationErrors(prev => {
      const next = { ...prev }
      delete next[questionId]
      return next
    })
  }

  const isAnswered = (q, ans) => {
    const v = ans[q.id]
    if (q.type === 'multi') return Array.isArray(v) && v.length > 0
    if (q.type === 'textarea') return typeof v === 'string' && v.trim().length > 0
    if (q.type === 'text') return typeof v === 'string' && v.trim().length > 0
    return v !== undefined && v !== ''
  }

  const getSectionProgress = (sectionIndex) => {
    const s = SURVEY_SECTIONS[sectionIndex]
    const answered = s.questions.filter(q => isAnswered(q, answers)).length
    return { answered, total: s.questions.length, pct: Math.round((answered / s.questions.length) * 100) }
  }

  // Validate current section — returns first unanswered question id or null
  const validateCurrentSection = () => {
    const errors = {}
    let firstError = null
    section.questions.forEach(q => {
      if (!isAnswered(q, answers)) {
        errors[q.id] = true
        if (!firstError) firstError = q.id
      }
    })
    setValidationErrors(errors)
    return { errors, firstError }
  }

  // Validate ALL sections
  const validateAll = () => {
    const errors = {}
    let firstErrorSection = null
    let firstErrorId = null
    SURVEY_SECTIONS.forEach((s, si) => {
      s.questions.forEach(q => {
        if (!isAnswered(q, answers)) {
          errors[q.id] = true
          if (firstErrorSection === null) {
            firstErrorSection = si
            firstErrorId = q.id
          }
        }
      })
    })
    return { errors, firstErrorSection, firstErrorId }
  }

  const scrollToFirstError = (questionId) => {
    setTimeout(() => {
      const el = document.getElementById(`question-${questionId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add(styles.errorHighlight)
        setTimeout(() => el.classList.remove(styles.errorHighlight), 2000)
      }
    }, 100)
  }

  const handleNext = () => {
    const { errors, firstError } = validateCurrentSection()
    if (Object.keys(errors).length > 0) {
      setShakeNext(true)
      setTimeout(() => setShakeNext(false), 600)
      scrollToFirstError(firstError)
      return
    }
    setValidationErrors({})
    setCurrentSection(c => c + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrev = () => {
    setValidationErrors({})
    setCurrentSection(c => c - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSectionNav = (index) => {
    // Allow going back freely; validate before going forward
    if (index > currentSection) {
      const { errors, firstError } = validateCurrentSection()
      if (Object.keys(errors).length > 0) {
        setShakeNext(true)
        setTimeout(() => setShakeNext(false), 600)
        scrollToFirstError(firstError)
        return
      }
    }
    setValidationErrors({})
    setCurrentSection(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleComplete = async () => {
    const { errors, firstErrorSection, firstErrorId } = validateAll()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      if (firstErrorSection !== currentSection) {
        setCurrentSection(firstErrorSection)
      }
      scrollToFirstError(firstErrorId)
      return
    }
    setSaving(true)
    try {
      const payload = { name: respondentName, answers, sectionReached: currentSection }
      if (incompleteId) {
        // was saved as incomplete — promote to completed
        await storage.deleteIncomplete(incompleteId)
      }
      await storage.addCompletedRespondent(payload)
      setDone(true)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelSave = async () => {
    setSaving(true)
    try {
      const payload = { id: incompleteId || undefined, name: respondentName, answers, sectionReached: currentSection }
      await storage.saveIncomplete(payload)
    } finally {
      setSaving(false)
      setShowCancelModal(false)
      navigate('/')
    }
  }

  const handleCloseWithoutSaving = () => {
    setShowCancelModal(false)
    navigate('/')
  }

  const currentProgress = getSectionProgress(currentSection)
  const totalAnswered = SURVEY_SECTIONS.reduce((acc, _, i) => acc + getSectionProgress(i).answered, 0)
  const totalQuestions = SURVEY_SECTIONS.reduce((acc, s) => acc + s.questions.length, 0)
  const isLastSection = currentSection === SURVEY_SECTIONS.length - 1

  if (done) {
    return (
      <div className={styles.doneScreen}>
        <div className={styles.doneCard}>
          <CheckCircle2 size={56} color="var(--teal)" />
          <h2>Survey Complete!</h2>
          <p>
            <strong>{respondentName}</strong>'s responses have been saved.
            <br />All <strong>{totalQuestions}</strong> questions answered.
          </p>
          <div className={styles.doneBtns}>
            <button className={styles.btnPrimary} onClick={() => {
              setAnswers({}); setCurrentSection(0); setDone(false); setIncompleteId(null)
              setRespondentName(`Respondent #${storage.data.respondents.length + 1}`)
            }}>
              Start Another Survey
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/respondents')}>
              View All Respondents
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/reports')}>
              View Reports
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}><AlertTriangle size={32} color="var(--gold)" /></div>
            <h3 className={styles.modalTitle}>Leave this survey?</h3>
            <p className={styles.modalText}>
              You have answered <strong>{totalAnswered}</strong> of {totalQuestions} questions.
              Would you like to save your progress?
            </p>
            <div className={styles.modalBtns}>
              <button className={styles.modalSave} onClick={handleCancelSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save and Close'}
              </button>
              <button className={styles.modalDiscard} onClick={handleCloseWithoutSaving}>
                Close Without Saving
              </button>
              <button className={styles.modalBack} onClick={() => setShowCancelModal(false)}>
                Go Back to Survey
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.surveyHeader}>
        <div className={styles.respondentField}>
          <label>Respondent Label</label>
          <input
            type="text"
            value={respondentName}
            onChange={e => setRespondentName(e.target.value)}
            placeholder="e.g. Respondent #1 or Staff ID"
          />
        </div>
        <div className={styles.overallProgress}>
          <span>{totalAnswered}/{totalQuestions} questions answered</span>
          <div className={styles.overallBar}>
            <div className={styles.overallFill} style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }} />
          </div>
        </div>
        <div className={styles.headerBtns}>
          <button className={styles.cancelTopBtn} onClick={() => setShowCancelModal(true)} title="Cancel survey">
            <X size={16} />
          </button>
        </div>
      </div>

      {Object.keys(validationErrors).length > 0 && (
        <div className={styles.validationBanner}>
          <AlertTriangle size={16} />
          Please answer all required fields before continuing. Unanswered questions are highlighted in red.
        </div>
      )}

      <div className={styles.layout}>
        <SectionNav
          sections={SURVEY_SECTIONS}
          currentSection={currentSection}
          onSelect={handleSectionNav}
          getSectionProgress={getSectionProgress}
        />

        <div className={styles.questionsPanel} ref={questionsRef}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>{section.title}</div>
            <div className={styles.sectionProgress}>
              {currentProgress.answered}/{currentProgress.total} answered
              {currentProgress.answered < currentProgress.total && (
                <span className={styles.sectionIncomplete}> — {currentProgress.total - currentProgress.answered} remaining</span>
              )}
            </div>
          </div>

          <div className={styles.questions}>
            {section.questions.map((question, qi) => (
              <QuestionBlock
                key={question.id}
                question={question}
                questionNumber={qi + 1}
                answers={answers}
                onAnswer={updateAnswer}
                sectionColor={section.color}
                hasError={!!validationErrors[question.id]}
              />
            ))}
          </div>

          {/* Navigation bar */}
          <div className={styles.navBtns}>
            <button
              className={styles.btnBack}
              onClick={handlePrev}
              disabled={currentSection === 0}
            >
              <ChevronLeft size={18} /> Previous
            </button>

            {/* Cancel button — centre */}
            <button
              className={styles.btnCancel}
              onClick={() => setShowCancelModal(true)}
              title="Cancel survey"
            >
              <X size={16} />
            </button>

            {!isLastSection ? (
              <button
                className={`${styles.btnNext} ${shakeNext ? styles.shake : ''}`}
                onClick={handleNext}
              >
                Next Section <ChevronRight size={18} />
              </button>
            ) : (
              <button
                className={`${styles.btnComplete} ${shakeNext ? styles.shake : ''}`}
                onClick={handleComplete}
                disabled={saving}
              >
                <CheckCircle2 size={18} /> {saving ? 'Saving...' : 'Complete Survey'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
