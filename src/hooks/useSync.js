import { useState, useEffect, useRef, useCallback } from 'react'
import { writeFamilyState, subscribeFamilyState } from '../lib/firebase'

const DEFAULT_STATE = {
  intervalMs: 3 * 3600000,
  ivStart: null,
  ivVol: 50,
  ivActive: false,
  nuStart: null,
  nuActive: false,
  slStart: null,
  slActive: false,
  lastDp: null,
  lastDpType: null,
  events: []
}

export function useSync(familyCode) {
  const [state, setStateLocal] = useState(DEFAULT_STATE)
  const [syncStatus, setSyncStatus] = useState('idle')
  const stateRef = useRef(DEFAULT_STATE)
  const saveTimerRef = useRef(null)

  useEffect(() => {
    if (!familyCode) return
    setSyncStatus('syncing')
    const unsub = subscribeFamilyState(familyCode, (remoteState) => {
      if (remoteState) {
        stateRef.current = remoteState
        setStateLocal(remoteState)
      }
      setSyncStatus('ok')
    })
    return () => unsub()
  }, [familyCode])

  const saveState = useCallback((newState) => {
    stateRef.current = newState
    setStateLocal(newState)
    clearTimeout(saveTimerRef.current)
    setSyncStatus('syncing')
    saveTimerRef.current = setTimeout(async () => {
      try {
        await writeFamilyState(familyCode, newState)
        setSyncStatus('ok')
      } catch (e) {
        setSyncStatus('error')
        console.error('Sync failed:', e)
      }
    }, 300)
  }, [familyCode])

  const updateState = useCallback((updater) => {
    const next = typeof updater === 'function'
      ? updater(stateRef.current)
      : { ...stateRef.current, ...updater }
    saveState(next)
  }, [saveState])

  return { state, updateState, syncStatus }
}
