import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'anisa_survey_data'

const defaultData = {
  respondents: [],        // status: 'completed'
  incomplete: [],         // status: 'incomplete'
  lastUpdated: null
}

export function useStorage() {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)
  const isElectron = typeof window !== 'undefined' && window.electronAPI

  useEffect(() => {
    async function load() {
      try {
        let loaded = null
        if (isElectron) {
          loaded = await window.electronAPI.loadData()
        } else {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) loaded = JSON.parse(raw)
        }
        if (loaded) {
          // migrate old data that didn't have 'incomplete' array
          if (!loaded.incomplete) loaded.incomplete = []
          // migrate old in-progress respondents into incomplete
          const oldInProgress = (loaded.respondents || []).filter(r => r.status !== 'completed')
          const completed = (loaded.respondents || []).filter(r => r.status === 'completed')
          if (oldInProgress.length > 0) {
            loaded.incomplete = [...(loaded.incomplete || []), ...oldInProgress]
            loaded.respondents = completed
          }
          setData(loaded)
        }
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const saveData = useCallback(async (newData) => {
    const updated = { ...newData, lastUpdated: new Date().toISOString() }
    setData(updated)
    try {
      if (isElectron) {
        await window.electronAPI.saveData(updated)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      }
    } catch (e) {
      console.error('Failed to save data:', e)
    }
  }, [isElectron])

  // Add a COMPLETED survey (only via Complete Survey button)
  const addCompletedRespondent = useCallback(async (respondent) => {
    const entry = { ...respondent, id: crypto.randomUUID(), completedAt: new Date().toISOString(), status: 'completed' }
    const newData = { ...data, respondents: [...data.respondents, entry] }
    await saveData(newData)
    return newData
  }, [data, saveData])

  // Save an INCOMPLETE survey (via cancel → save and close)
  const saveIncomplete = useCallback(async (respondent) => {
    const existing = data.incomplete.find(r => r.id === respondent.id)
    let newIncomplete
    if (existing) {
      newIncomplete = data.incomplete.map(r => r.id === respondent.id ? { ...r, ...respondent, savedAt: new Date().toISOString() } : r)
    } else {
      newIncomplete = [...data.incomplete, { ...respondent, id: crypto.randomUUID(), savedAt: new Date().toISOString(), status: 'incomplete' }]
    }
    const newData = { ...data, incomplete: newIncomplete }
    await saveData(newData)
  }, [data, saveData])

  // Update an existing completed respondent (when editing)
  const updateRespondent = useCallback(async (id, updates) => {
    const newData = {
      ...data,
      respondents: data.respondents.map(r => r.id === id ? { ...r, ...updates } : r)
    }
    await saveData(newData)
  }, [data, saveData])

  const deleteRespondent = useCallback(async (id) => {
    const newData = {
      ...data,
      respondents: data.respondents.filter(r => r.id !== id),
      incomplete: data.incomplete.filter(r => r.id !== id)
    }
    await saveData(newData)
  }, [data, saveData])

  const deleteIncomplete = useCallback(async (id) => {
    const newData = { ...data, incomplete: data.incomplete.filter(r => r.id !== id) }
    await saveData(newData)
  }, [data, saveData])

  const clearAll = useCallback(async () => {
    await saveData(defaultData)
  }, [saveData])

  return {
    data, loading,
    addCompletedRespondent, saveIncomplete,
    updateRespondent, deleteRespondent, deleteIncomplete,
    clearAll, saveData
  }
}
