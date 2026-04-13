import { useState } from 'react'
import { useSync } from './hooks/useSync'
import SetupScreen from './components/SetupScreen'
import SyncBar from './components/SyncBar'
import TabBar from './components/TabBar'
import DashboardScreen from './components/DashboardScreen'
import IVScreen from './components/IVScreen'
import QuickLogScreen from './components/QuickLogScreen'

export default function App() {
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('home')
  const { state, updateState, syncStatus } = useSync(session?.familyCode)

  if (!session) {
    return (
      <SetupScreen
        onJoin={(who, familyCode) => setSession({ who, familyCode })}
      />
    )
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div className="safe-top" style={{ background: 'var(--surface)' }} />
      <SyncBar
        who={session.who}
        familyCode={session.familyCode}
        syncStatus={syncStatus}
        onLeave={() => setSession(null)}
      />
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <TabBar active={tab} onChange={setTab} />
          {tab === 'home' && (
            <DashboardScreen
              state={state}
              onGoIV={() => setTab('iv')}
            />
          )}
          {tab === 'iv' && (
            <IVScreen
              state={state}
              who={session.who}
              updateState={updateState}
            />
          )}
          {tab === 'log' && (
            <QuickLogScreen
              state={state}
              who={session.who}
              updateState={updateState}
            />
          )}
        </div>
      </div>
      <div className="safe-bottom" />
    </div>
  )
}
