import { fmtTime } from '../hooks/useTimer'

const c = {
  wrap: { padding: '0 16px' },
  slabel: { fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 10 },
  card: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: 16 },
  btnRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 },
  btnHalf: { padding: 11, border: '0.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14, background: 'var(--surface)', color: 'var(--text-primary)', transition: 'all 0.15s' },
  btn: (variant) => {
    const v = {
      sage:  { background: 'var(--sage-light)',      color: 'var(--sage-text)',  border: '0.5px solid var(--sage-mid)' },
      slate: { background: 'var(--slate-light)',     color: 'var(--slate-text)', border: '0.5px solid var(--slate-mid)' },
      stop:  { background: 'var(--muted-red-light)', color: 'var(--muted-red)',  border: '0.5px solid var(--muted-red-border)' }
    }
    return { width: '100%', padding: 13, borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 500, ...v[variant] }
  },
  lastLog: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }
}

export default function QuickLogScreen({ state, who, updateState }) {
  const events = state.events || []
  const lastDiaper = events.find(e => e.cat === 'Diaper')
  const lastNurse  = events.find(e => e.cat === 'Nursing')
  const lastSleep  = events.find(e => e.cat === 'Sleep')

  function logDiaper(type) {
    const ev = { cat: 'Diaper', detail: type.charAt(0).toUpperCase() + type.slice(1), who, ts: Date.now() }
    updateState(s => ({ ...s, events: [ev, ...(s.events || [])].slice(0, 30) }))
  }

  function toggleNurse() {
    if (!state.nuActive) {
      const now = Date.now()
      updateState(s => ({ ...s, nuStart: now, nuActive: true, events: [{ cat: 'Nursing', detail: 'Started', who, ts: now }, ...(s.events || [])].slice(0, 30) }))
    } else {
      const dur = Math.floor((Date.now() - state.nuStart) / 60000)
      const now = Date.now()
      updateState(s => ({ ...s, nuActive: false, nuStart: now, events: [{ cat: 'Nursing', detail: `Ended · ${dur}m`, who, ts: now }, ...(s.events || [])].slice(0, 30) }))
    }
  }

  function toggleSleep() {
    if (!state.slActive) {
      const now = Date.now()
      updateState(s => ({ ...s, slStart: now, slActive: true, events: [{ cat: 'Sleep', detail: 'Started', who, ts: now }, ...(s.events || [])].slice(0, 30) }))
    } else {
      const dur = Math.floor((Date.now() - state.slStart) / 60000)
      const now = Date.now()
      updateState(s => ({ ...s, slActive: false, slStart: now, events: [{ cat: 'Sleep', detail: `Woke after ${dur}m`, who, ts: now }, ...(s.events || [])].slice(0, 30) }))
    }
  }

  return (
    <div style={c.wrap}>
      <p style={c.slabel}>Diaper</p>
      <div style={c.card}>
        <div style={c.btnRow}>
          <button style={c.btnHalf} onClick={() => logDiaper('wet')}>Wet</button>
          <button style={c.btnHalf} onClick={() => logDiaper('dirty')}>Dirty</button>
        </div>
        <div style={c.lastLog}>{lastDiaper ? `Last: ${lastDiaper.detail} at ${fmtTime(lastDiaper.ts)}` : 'Not logged yet'}</div>
      </div>
      <p style={c.slabel}>Nursing</p>
      <div style={c.card}>
        <button style={c.btn(state.nuActive ? 'stop' : 'sage')} onClick={toggleNurse}>
          {state.nuActive ? 'Stop nursing' : 'Start nursing — now'}
        </button>
        <div style={c.lastLog}>{lastNurse ? `Last: ${lastNurse.detail} at ${fmtTime(lastNurse.ts)}` : 'Not logged yet'}</div>
      </div>
      <p style={c.slabel}>Sleep</p>
      <div style={c.card}>
        <button style={c.btn(state.slActive ? 'stop' : 'slate')} onClick={toggleSleep}>
          {state.slActive ? 'Wake — stop sleep log' : 'Sleep started — now'}
        </button>
        <div style={c.lastLog}>{lastSleep ? `Last: ${lastSleep.detail} at ${fmtTime(lastSleep.ts)}` : 'Not logged yet'}</div>
      </div>
    </div>
  )
}
