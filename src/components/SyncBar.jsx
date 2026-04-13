const statusColor = { ok: '#8aab96', syncing: '#c4a36a', error: '#c4766a', idle: '#b4b2a9' }

export default function SyncBar({ who, familyCode, syncStatus, onLeave }) {
  const color = statusColor[syncStatus] || statusColor.idle
  const label = { ok: 'synced', syncing: 'syncing…', error: 'sync error', idle: '—' }[syncStatus]

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px', background: 'var(--surface)',
      borderBottom: '0.5px solid var(--border)', fontSize: 12,
      color: 'var(--text-secondary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          background: 'var(--sage-light)', color: 'var(--sage-text)',
          borderRadius: 20, padding: '2px 10px', fontWeight: 500, fontSize: 11
        }}>{who}</span>
        <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>{familyCode}</span>
        <button
          onClick={onLeave}
          style={{ color: 'var(--text-tertiary)', fontSize: 12, padding: '2px 6px' }}
        >leave</button>
      </div>
    </div>
  )
}
