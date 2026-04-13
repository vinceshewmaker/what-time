import { useState } from 'react'

const s = {
  wrap: { padding: '2rem 1.5rem', maxWidth: 420, margin: '0 auto' },
  logo: {
    width: 48, height: 48, borderRadius: '50%',
    background: 'var(--sage-light)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
  },
  dot: { width: 16, height: 16, borderRadius: '50%', background: 'var(--sage)' },
  title: { fontSize: 24, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 },
  sub: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' },
  label: {
    fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase',
    color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, display: 'block'
  },
  input: {
    width: '100%', padding: '12px 14px', border: '1px solid var(--border-mid)',
    borderRadius: 'var(--radius-sm)', fontSize: 16, color: 'var(--text-primary)',
    background: 'var(--surface)', marginBottom: 16, outline: 'none'
  },
  hint: {
    fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6,
    marginBottom: '1.5rem', padding: '10px 14px',
    background: 'var(--slate-light)', borderRadius: 'var(--radius-sm)'
  },
  btn: {
    width: '100%', padding: 14, borderRadius: 'var(--radius-sm)',
    background: 'var(--sage-light)', color: 'var(--sage-text)',
    border: '1px solid var(--sage-mid)', fontSize: 16, fontWeight: 500
  },
  err: { fontSize: 13, color: 'var(--muted-red)', marginTop: 10 }
}

export default function SetupScreen({ onJoin }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [err, setErr] = useState(false)

  function join() {
    if (!name.trim() || !code.trim()) { setErr(true); return }
    onJoin(name.trim(), code.trim().toLowerCase().replace(/\s+/g, '-'))
  }

  return (
    <div style={s.wrap} className="safe-top">
      <div style={s.logo}><div style={s.dot} /></div>
      <div style={s.title}>What Time?</div>
      <div style={s.sub}>
        Shared infant care tracker. Both caregivers use the same Family Code
        to see a live, synced feed — no accounts needed.
      </div>
      <label style={s.label}>Your name</label>
      <input
        style={s.input} placeholder="e.g. Dad, Mom, Grandma..."
        value={name} maxLength={20}
        onChange={e => { setName(e.target.value); setErr(false) }}
        onKeyDown={e => e.key === 'Enter' && join()}
      />
      <label style={s.label}>Family code</label>
      <input
        style={s.input} placeholder="e.g. baby-rivera-2025"
        value={code} maxLength={40}
        onChange={e => { setCode(e.target.value.toLowerCase()); setErr(false) }}
        onKeyDown={e => e.key === 'Enter' && join()}
      />
      <div style={s.hint}>
        Pick any phrase — share it with your co-caregiver so they can join the same feed.
        Anyone with this code can view and log events.
      </div>
      <button style={s.btn} onClick={join}>Join shared tracker</button>
      {err && <div style={s.err}>Please enter your name and a family code.</div>}
    </div>
  )
}
