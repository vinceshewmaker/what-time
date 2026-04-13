import { useTimer, useElapsed, fmtTime } from '../hooks/useTimer'

const css = {
  wrap: { padding: '0 16px' },
  slabel: {
    fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 10
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.5rem' },
  dc: { background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' },
  dcLabel: { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 },
  dcTime: { fontSize: 22, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.1 },
  dcUnit: { fontSize: 12, color: 'var(--text-secondary)', fontWeight: 400 },
  dcAgo: { fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 },
  dcBy: { fontSize: 11, color: 'var(--sage)', marginTop: 1 },
  hero: {
    background: 'var(--bg)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem'
  },
  statusRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 },
  bigNum: { fontSize: 52, fontWeight: 500, letterSpacing: -2, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  nextLbl: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 },
  progressWrap: { height: 5, background: 'var(--border)', borderRadius: 3, margin: '14px 0 10px', overflow: 'hidden' },
  btn: {
    width: '100%', padding: 13, borderRadius: 'var(--radius-sm)',
    fontSize: 15, fontWeight: 500, background: 'var(--sage-light)',
    color: 'var(--sage-text)', border: '0.5px solid var(--sage-mid)'
  },
  card: {
    background: 'var(--surface)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '0 1.25rem', marginBottom: 24
  },
  logItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '0.5px solid var(--border)' },
}

function DiCard({ label, event, active }) {
  const elapsed = useElapsed(event?.ts)
  if (!event) return (
    <div style={css.dc}>
      <div style={css.dcLabel}>{label}</div>
      <div style={{ ...css.dcTime, color: 'var(--text-tertiary)' }}>—</div>
      <div style={css.dcAgo}>not logged</div>
    </div>
  )
  return (
    <div style={css.dc}>
      <div style={css.dcLabel}>{label}</div>
      <div style={css.dcTime}>{elapsed}</div>
      <div style={css.dcAgo}>{active ? '(active)' : `ago · ${fmtTime(event.ts)}`}</div>
      {event.who && <div style={css.dcBy}>{event.who}</div>}
    </div>
  )
}

function dotColor(status) {
  return status === 'due' ? '#c4766a' : status === 'soon' ? '#c4a36a' : '#8aab96'
}

export default function DashboardScreen({ state, onGoIV }) {
  const { remaining, progress, status, countdownLabel, dueAt } = useTimer(state.ivStart, state.intervalMs)
  const events = state.events || []
  const find = cat => events.find(e => e.cat === cat)

  const progColor = status === 'due' ? '#c4766a' : status === 'soon' ? '#c4a36a' : '#8aab96'
  const statusMsg = !state.ivStart ? 'Start first IV to begin tracking'
    : status === 'due' ? 'Window open — IV due now'
    : status === 'soon' ? '< 30 min to next window'
    : state.ivActive ? 'Session in progress' : 'Countdown running'

  re
