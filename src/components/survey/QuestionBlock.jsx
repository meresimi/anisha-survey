import styles from './QuestionBlock.module.css'

export default function QuestionBlock({ question, questionNumber, answers, onAnswer, sectionColor, hasError }) {
  const value = answers[question.id]

  const shouldShowFollowUp = () => {
    if (!question.followUp) return false
    const { condition } = question.followUp
    if (condition === 'any') return value !== undefined && value !== ''
    if (Array.isArray(condition)) return condition.includes(value)
    return value === condition
  }

  return (
    <div
      id={`question-${question.id}`}
      className={`${styles.block} ${hasError ? styles.errorBlock : ''}`}
      style={{ '--q-color': hasError ? '#c62828' : sectionColor }}
    >
      <div className={`${styles.qNumber} ${hasError ? styles.qNumberError : ''}`}>{questionNumber}</div>
      <div className={styles.qBody}>
        <div className={styles.qText}>
          {question.text}
          <span className={styles.required}> *</span>
        </div>

        {hasError && (
          <div className={styles.errorMsg}>⚠ This field is required</div>
        )}

        {question.type === 'single' && (
          <div className={styles.options}>
            {question.options.map(opt => (
              <label key={opt} className={`${styles.option} ${value === opt ? styles.selected : ''}`}>
                <input type="radio" name={question.id} value={opt} checked={value === opt} onChange={() => onAnswer(question.id, opt)} />
                <span className={styles.radio} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'multi' && (
          <div className={styles.options}>
            {question.options.map(opt => {
              const checked = Array.isArray(value) && value.includes(opt)
              return (
                <label key={opt} className={`${styles.option} ${checked ? styles.selected : ''}`}>
                  <input type="checkbox" value={opt} checked={checked}
                    onChange={() => {
                      const current = Array.isArray(value) ? value : []
                      onAnswer(question.id, checked ? current.filter(v => v !== opt) : [...current, opt])
                    }}
                  />
                  <span className={styles.checkbox} />
                  <span>{opt}</span>
                </label>
              )
            })}
          </div>
        )}

        {question.type === 'text' && (
          <input
            className={`${styles.textInput} ${hasError ? styles.inputError : ''}`}
            type="text" value={value || ''}
            onChange={e => onAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
          />
        )}

        {question.type === 'textarea' && (
          <textarea
            className={`${styles.textarea} ${hasError ? styles.inputError : ''}`}
            value={value || ''}
            onChange={e => onAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
            rows={3}
          />
        )}

        {question.type === 'rating' && (
          <div className={styles.rating}>
            <div className={styles.ratingBtns}>
              {Array.from({ length: question.max - question.min + 1 }, (_, i) => {
                const score = question.min + i
                return (
                  <button key={score} type="button"
                    className={`${styles.ratingBtn} ${Number(value) === score ? styles.ratingSelected : ''}`}
                    onClick={() => onAnswer(question.id, score)}
                  >{score}</button>
                )
              })}
            </div>
            {question.labels && (
              <div className={styles.ratingLabels}>
                {Object.entries(question.labels).map(([score, label]) => (
                  <span key={score} className={styles.ratingLabel}>{label}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Follow-up questions */}
        {shouldShowFollowUp() && question.followUp.questions.map(fq => (
          <div key={fq.id} className={styles.followUp}>
            <div className={styles.followUpText}>{fq.text}</div>
            {fq.type === 'text' && (
              <input className={styles.textInput} type="text" value={answers[fq.id] || ''}
                onChange={e => onAnswer(fq.id, e.target.value)} placeholder="Type your answer..." />
            )}
            {fq.type === 'textarea' && (
              <textarea className={styles.textarea} value={answers[fq.id] || ''}
                onChange={e => onAnswer(fq.id, e.target.value)} placeholder="Type your answer..." rows={3} />
            )}
            {fq.type === 'single' && (
              <div className={styles.options}>
                {fq.options.map(opt => (
                  <label key={opt} className={`${styles.option} ${answers[fq.id] === opt ? styles.selected : ''}`}>
                    <input type="radio" name={fq.id} value={opt} checked={answers[fq.id] === opt} onChange={() => onAnswer(fq.id, opt)} />
                    <span className={styles.radio} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
