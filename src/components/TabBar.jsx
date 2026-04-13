const tabs = [
  { id: 'home', label: 'Dashboard' },
  { id: 'iv',   label: 'IV Feeding' },
  { id: 'log',  label: 'Quick Log' }
]

export default function TabBar({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 6, padding: 4,
      background: 'var(--bg)', margin: '0 16px 16px',
      borderRadius: 'var(--radius-md)',
      border: '0.5px solid var(--border)'
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1, padding: '8px 4px', borderRadius: 'var(--radius-sm)',
            fontSize: 13, fontWeight: active === t.id ? 500 : 400,
            color: active === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: active === t.id ? 'var(--surface)' : 'transparent',
            border: active === t.id ? '0.5px solid var(--border)' : 'none',
            transition: 'all 0.15s'
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
