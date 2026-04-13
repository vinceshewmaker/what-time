import { useState, useEffect } from 'react'

export function useTimer(ivStart, intervalMs) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  if (!ivStart) return { remaining: intervalMs, progress: 0, status: 'idle', countdownLabel: formatHMS(intervalMs), dueAt: null }

  const elapsed = Date.now() - ivStart
  const remaining = Math.max(0, intervalMs - elapsed)
  const progress = Math.min(100, (elapsed / intervalMs) * 100)
  const dueAt = new Date(ivStart + intervalMs)

  let status = 'active'
  if (remaining === 0) status = 'due'
  else if (remaining < 30 * 60 * 1000) status = 'soon'

  return { remaining, progress, status, countdownLabel: formatHMS(remaining), dueAt }
}

export function useElapsed(ts) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 10000)
    return () => clearInterval(id)
  }, [])
  return ts ? formatElapsed(Date.now() - ts) : null
}

function formatHMS(ms) {
  const t = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatElapsed(ms) {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rm = m % 60
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`
}

export function fmtTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
