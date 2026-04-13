import { useState } from 'react'
import { useTimer, fmtTime } from '../hooks/useTimer'

const INTERVAL_PRESETS = [1.5, 2, 2.5, 3, 3.5, 4]
const VOL_PRESETS = [25, 50, 75, 100, 150]

const c = {
  wrap: { padding: '0 16px' },
  slabel: { fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 10 },
  card: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: 12 },
  hero: { background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' },
  chips: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  chip: (sel) => ({
    padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
    background: sel ? 'var(--sage-light)' : 'var(--surface)',
    color: sel ? 'var(--sage-text)' : 'var(--text-secondary)',
    border: sel ? '1px solid var(--sage-mid)' : '0.5px solid var(--border)',
    fontWeight: sel ? 500 : 400, transition: 'all 0.15s'
  }),
  sliderRow: { display: 'flex', alignItems: 'center', gap: 10 },
  sliderVal: { fontSize: 14, fontWeight: 500, minWidth: 48, color: 'var(--text-primary)' },
  statusRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 },
  bigNum: { fontSize: 52, fontWeight: 500, letterSpacing: -2, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  nextLbl: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 },
  progressWrap: { height: 5, background: 'var(--border)', borderRadius: 3, margin: '14px 0 10px', overflow: 'hidden' },
  btn: (variant) => {
    const variants = {
      sage:    { background: 'var(--sage-light)',       color: 'var(--sage-text)',    border: '0.5px solid var(--sage-mid)' },
      stop:    { background: 'var(--muted-red-light)',  color: 'var(--muted-red)',    border: '0.5px solid var(--muted-red-border)' },
      confirm: { background: 'var(--sage-light)',       color: 'var(--sage-text)',    border: '2px solid var(--sage)' },
      cancel:  { background: 'transparent',             color: 'var(--text-secondary)', border: '0.5px solid var(--border)' }
    }
    return { width: '100%', padding: 13, borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 500, marginBottom: 8, ...variants[variant] }
  },
  confirmBox: {
    background: 'var(--surface)', border: '2px solid var(--sage)',
    borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: 12
  },
  btnRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  remembered: { fontSize: 11, color: 'var(--sage)', marginTop: 6 },
  hint: { fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }
}

function dotColor(status) {
  return status === 'due' ? '#c4766a' : status === 'soon' ? '#c4a36a' : '#8aab96'
}

export default function IVScreen({ state, who, updateState }) {
  const [confirming, setConfirming] = useState(false)
  const { remaining, progress, status, countdownLabel, dueAt } = useTimer(state.ivStart, state.intervalMs)
  const intervalHours = state.intervalMs / 3600000
  const progColor = dotColor(status)
  const statusMsg = !state.ivStart ? 'No active session'
    : status === 'due' ? 'Window open — IV due now'
    : status === 'soon' ? '< 30 min to next window'
    : state.ivActive ? 'Session in progress' : 'Countdown running'

  function setInterval_(h) {
    updateState(s => ({ ...s, intervalMs: h * 3600000 }))
  }
  function pickVol(v) {
    updateState(s => ({ ...s, ivVol: v }))
  }
  function confirmStart() {
    setConfirming(false)
    const now = Date.now()
    const newEvent = { cat: 'IV feeding', detail: `Started ${state.ivVol}ml · ${intervalHours.toFixed(1)}h interval`, who, ts: now }
    updateState(s => ({ ...s, ivStart: now, ivActive: true, events: [newEvent, ...(s.events || [])].slice(0, 30) }))
  }
  function stopIV() {
    const now = Date.now()
    const newEvent = { cat: 'IV feeding', detail: `Session ended · ${state.ivVol}ml`, who, ts: now }
    updateState(s => ({ ...s, ivActive: false, ivStart: now, events: [newEvent, ...(s.events || [])].slice(0, 30) }))
  }

  return (
    <div style={c.wrap}>
      <p style={c.slabel}>Feeding interval</p>
      <div style={c.card}>
        <div style={c.chips}>
          {INTERVAL_PRESETS.map(h => (
            <button key={h} style={c.chip(intervalHours === h)} onClick={() => setInterval_(h)}>{h} h</button>
          ))}
        </div>
        <div style={c.sliderRow}>
          <input type="range" min="1" max="6" step="0.5" value={intervalHours} style={{ flex: 1 }} onChange={e => setInterval_(parseFloat(e.target.value))} />
          <span style={c.sliderVal}>{intervalHours.toFixed(1)} h</span>
        </div>
      </div>
      <p style={c.slabel}>IV countdown</p>
      <div style={c.hero}>
        <div style={c.statusRow}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor(status), flexShrink: 0 }} />
          <span>{statusMsg}</span>
        </div>
        <div style={{ textAlign: 'center', paddingBottom: 4 }}>
          <div style={c.bigNum}>{state.ivStart ? countdownLabel : '—:——:——'}</div>
          <div style={c.nextLbl}>{dueAt ? `due at ${fmtTime(dueAt.getTime())}` : 'next due time will show here'}</div>
        </div>
        <div style={c.progressWrap}>
          <div style={{ height: '100%', borderRadius: 3, background: progColor, width: `${progress.toFixed(1)}%`, transition: 'width 1s linear' }} />
        </div>
      </div>
      <p style={c.slabel}>Volume</p>
      <div style={c.card}>
        <div style={c.chips}>
          {VOL_PRESETS.map(v => (
            <button key={v} style={c.chip(state.ivVol === v)} onClick={() => pickVol(v)}>{v} ml</button>
          ))}
        </div>
        <div style={c.sliderRow}>
          <input type="range" min="5" max="250" step="5" value={state.ivVol} style={{ flex: 1 }} onChange={e => pickVol(parseInt(e.target.value))} />
          <span style={c.sliderVal}>{state.ivVol} ml</span>
        </div>
        <div style={c.remembered}>{state.events?.find(e => e.cat === 'IV feeding') ? `Last used: ${state.ivVol} ml` : ''}</div>
      </div>
      {confirming ? (
        <div style={c.confirmBox}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Confirm IV start</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
            {state.ivVol} ml · {intervalHours.toFixed(1)}h interval<br />
            Next due at {fmtTime(Date.now() + state.intervalMs)}<br />
            Logging as {who} at {fmtTime(Date.now())}
          </div>
          <div style={c.btnRow}>
            <button style={c.btn('cancel')} onClick={() => setConfirming(false)}>Cancel</button>
            <button style={c.btn('confirm')} onClick={confirmStart}>Confirm start</button>
          </div>
        </div>
      ) : (
        <>
          {!state.ivActive
            ? <button style={c.btn('sage')} onClick={() => setConfirming(true)}>Start IV — now</button>
            : <button style={c.btn('stop')} onClick={stopIV}>End session</button>
          }
        </>
      )}
      <div style={c.hint}>{state.ivStart ? `Last started at ${fmtTime(state.ivStart)} · ${state.ivVol} ml` : 'Tap "Start IV" — a confirmation step prevents accidental logs.'}</div>
    </div>
  )
}
