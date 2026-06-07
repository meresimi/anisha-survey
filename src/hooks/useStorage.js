import { useState, useEffect, useCallback } from 'react'

const KEY = 'anisa_survey_v2'

const DEFAULT = {
  // Research setup
  setup: null, // { researcherName, supervisorName, institution, deadline, targetSample }
  currentPhase: 0, // 0-5 index into RESEARCH_PHASES
  phaseTimestamps: {},

  // Survey data
  respondents: [],   // completed surveys only
  incomplete: [],    // saved-not-completed

  // New instruments
  interviews: [],    // key informant interview notes
  observations: [],  // field observation checklists per department

  // Research notes
  fieldNotes: [],    // [ { id, text, timestamp, phase } ]

  lastUpdated: null
}

export const RESEARCH_PHASES = [
  { id: 0, label: 'Literature Review',        short: 'Lit Review',   color: '#1a6b8a' },
  { id: 1, label: 'Ethics & Instruments',     short: 'Ethics',       color: '#6a1b9a' },
  { id: 2, label: 'Pilot Testing & Recruit',  short: 'Pilot',        color: '#e65100' },
  { id: 3, label: 'Data Collection',          short: 'Collection',   color: '#c62828' },
  { id: 4, label: 'Analysis & Reports',       short: 'Analysis',     color: '#2e7d32' },
  { id: 5, label: 'Writing & Submission',     short: 'Writing',      color: '#0e8a7a' },
]

export const DEPARTMENTS = [
  { id: 'emergency',    label: 'Emergency',          target: 12 },
  { id: 'general',      label: 'General Ward',        target: 25 },
  { id: 'surgery',      label: 'Surgery',             target: 18 },
  { id: 'outpatient',   label: 'Outpatient',          target: 20 },
  { id: 'admin',        label: 'Administration',      target: 15 },
  { id: 'sanitation',   label: 'Cleaners/Sanitation', target: 10 },
]

export const OBSERVATION_ITEMS = [
  { id: 'sharps_containers',  label: 'Sharps containers present and in use' },
  { id: 'waste_segregated',   label: 'Waste segregated by type (clinical/general/sharps)' },
  { id: 'bins_not_overflow',  label: 'Waste bins not overflowing' },
  { id: 'ppe_worn',           label: 'PPE worn by waste handlers' },
  { id: 'no_burning',         label: 'No evidence of open burning on grounds' },
  { id: 'storage_secured',    label: 'Waste storage facility present and secured' },
  { id: 'signage_visible',    label: 'Safety protocol signage visible' },
  { id: 'disposal_labelled',  label: 'Disposal containers correctly labelled' },
]

export const INTERVIEW_QUESTIONS = [
  { id: 'iq1', text: 'What are the main challenges your facility faces in managing medical hazardous waste?' },
  { id: 'iq2', text: 'What protocols are currently in place for segregation, treatment, and disposal?' },
  { id: 'iq3', text: 'How do you currently monitor and track waste management practices?' },
  { id: 'iq4', text: 'Have you implemented any staff awareness programs regarding medical waste risks?' },
  { id: 'iq5', text: 'Are there plans to improve waste disposal infrastructure in the near future?' },
  { id: 'iq6', text: 'Do you collaborate with local government or environmental agencies on waste disposal?' },
  { id: 'iq7', text: 'On a scale of 1–5, how would you rate your facility\'s current compliance with waste management standards?' },
  { id: 'iq8', text: 'What single improvement would have the greatest impact on waste management at your facility?' },
]

function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch(e) { console.error(e) }
  if (window.electronAPI) window.electronAPI.saveData(data).catch(console.error)
}

export function useStorage() {
  const [data, setData]     = useState(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        let raw = null
        if (window.electronAPI) raw = await window.electronAPI.loadData()
        if (!raw) { const s = localStorage.getItem(KEY); if (s) raw = JSON.parse(s) }
        if (raw) {
          // migrate: merge any missing keys from DEFAULT
          const merged = { ...DEFAULT, ...raw }
          if (!merged.interviews)   merged.interviews   = []
          if (!merged.observations) merged.observations = []
          if (!merged.fieldNotes)   merged.fieldNotes   = []
          if (!merged.setup)        merged.setup        = null
          // migrate old in-progress to incomplete
          const oldIP = (merged.respondents||[]).filter(r => r.status !== 'completed')
          if (oldIP.length) {
            merged.incomplete  = [...(merged.incomplete||[]), ...oldIP]
            merged.respondents = merged.respondents.filter(r => r.status === 'completed')
          }
          setData(merged)
        }
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const save = useCallback(async (next) => {
    const d = { ...next, lastUpdated: new Date().toISOString() }
    setData(d); persist(d)
  }, [])

  // ── Research setup ──────────────────────────────────────────
  const saveSetup = useCallback(async (setup) => {
    await save({ ...data, setup })
  }, [data, save])

  const setPhase = useCallback(async (phase) => {
    const ts = { ...data.phaseTimestamps, [phase]: new Date().toISOString() }
    await save({ ...data, currentPhase: phase, phaseTimestamps: ts })
  }, [data, save])

  // ── Surveys ─────────────────────────────────────────────────
  const addCompletedRespondent = useCallback(async (r) => {
    const entry = { ...r, id: crypto.randomUUID(), completedAt: new Date().toISOString(), status: 'completed' }
    await save({ ...data, respondents: [...data.respondents, entry] })
    return entry
  }, [data, save])

  const saveIncomplete = useCallback(async (r) => {
    const id = r.id || crypto.randomUUID()
    const entry = { ...r, id, savedAt: new Date().toISOString(), status: 'incomplete' }
    const exists = data.incomplete.find(x => x.id === id)
    const list   = exists ? data.incomplete.map(x => x.id === id ? entry : x)
                          : [...data.incomplete, entry]
    await save({ ...data, incomplete: list })
  }, [data, save])

  const updateRespondent = useCallback(async (id, updates) => {
    await save({ ...data, respondents: data.respondents.map(r => r.id===id ? {...r,...updates} : r) })
  }, [data, save])

  const deleteRespondent = useCallback(async (id) => {
    await save({
      ...data,
      respondents: data.respondents.filter(r => r.id !== id),
      incomplete:  data.incomplete.filter(r => r.id !== id),
    })
  }, [data, save])

  const deleteIncomplete = useCallback(async (id) => {
    await save({ ...data, incomplete: data.incomplete.filter(r => r.id !== id) })
  }, [data, save])

  // ── Interviews ───────────────────────────────────────────────
  const saveInterview = useCallback(async (interview) => {
    const id    = interview.id || crypto.randomUUID()
    const entry = { ...interview, id, savedAt: new Date().toISOString() }
    const exists = data.interviews.find(x => x.id === id)
    const list   = exists ? data.interviews.map(x => x.id===id ? entry : x)
                          : [...data.interviews, entry]
    await save({ ...data, interviews: list })
  }, [data, save])

  const deleteInterview = useCallback(async (id) => {
    await save({ ...data, interviews: data.interviews.filter(x => x.id !== id) })
  }, [data, save])

  // ── Field Observations ───────────────────────────────────────
  const saveObservation = useCallback(async (obs) => {
    const id    = obs.id || crypto.randomUUID()
    const entry = { ...obs, id, savedAt: new Date().toISOString() }
    const exists = data.observations.find(x => x.id === id)
    const list   = exists ? data.observations.map(x => x.id===id ? entry : x)
                          : [...data.observations, entry]
    await save({ ...data, observations: list })
  }, [data, save])

  const deleteObservation = useCallback(async (id) => {
    await save({ ...data, observations: data.observations.filter(x => x.id !== id) })
  }, [data, save])

  // ── Field Notes ──────────────────────────────────────────────
  const addFieldNote = useCallback(async (text) => {
    const note = { id: crypto.randomUUID(), text, timestamp: new Date().toISOString(), phase: data.currentPhase }
    await save({ ...data, fieldNotes: [...data.fieldNotes, note] })
  }, [data, save])

  const deleteFieldNote = useCallback(async (id) => {
    await save({ ...data, fieldNotes: data.fieldNotes.filter(n => n.id !== id) })
  }, [data, save])

  // ── Full export ──────────────────────────────────────────────
  const exportAll = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `anisa-survey-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click(); URL.revokeObjectURL(url)
  }, [data])

  // ── Computed helpers ─────────────────────────────────────────
  const deptCounts = useCallback(() => {
    return DEPARTMENTS.map(d => ({
      ...d,
      count: data.respondents.filter(r => r.answers?.department === d.label || r.answers?.department === d.id).length
    }))
  }, [data])

  const dataQuality = useCallback(() => {
    if (!data.respondents.length) return 0
    const perfect = data.respondents.filter(r => {
      const answers = r.answers || {}
      return Object.keys(answers).length >= 20  // heuristic: 20+ fields = complete
    }).length
    return Math.round((perfect / data.respondents.length) * 100)
  }, [data])

  const daysToDeadline = useCallback(() => {
    if (!data.setup?.deadline) return null
    const diff = new Date(data.setup.deadline) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }, [data])

  return {
    data, loading, save,
    saveSetup, setPhase,
    addCompletedRespondent, saveIncomplete, updateRespondent,
    deleteRespondent, deleteIncomplete,
    saveInterview, deleteInterview,
    saveObservation, deleteObservation,
    addFieldNote, deleteFieldNote,
    exportAll, deptCounts, dataQuality, daysToDeadline,
  }
}
