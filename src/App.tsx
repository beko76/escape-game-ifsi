import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import { Briefing } from './components/Briefing'
import { Dashboard } from './components/Dashboard'
import { FinalLock } from './components/FinalLock'
import { Header } from './components/Header'
import { TimeUpDialog } from './components/TimeUpDialog'
import { Victory } from './components/Victory'
import { E1Instagram } from './enigmas/E1Instagram'
import { E2Judicial } from './enigmas/E2Judicial'
import { E3WhatsApp } from './enigmas/E3WhatsApp'
import { E4Derogations } from './enigmas/E4Derogations'
import { E5DPI } from './enigmas/E5DPI'
import { E6Tribunal } from './enigmas/E6Tribunal'
import { E7Crisis } from './enigmas/E7Crisis'
import { E8Virality } from './enigmas/E8Virality'
import type { EnigmaId } from './game/config'
import { GameProvider, useGame } from './game/GameContext'

// Chargé à la demande : les équipes ne téléchargent pas le code du tableau de bord
const TeacherDashboard = lazy(() => import('./teacher/TeacherDashboard').then((m) => ({ default: m.TeacherDashboard })))

/** Route du tableau de bord enseignant : #/prof ou #/prof/CODE */
function useTeacherRoute() {
  const parse = () => {
    const m = /^#\/prof(?:\/([A-Za-z0-9]+))?/.exec(location.hash)
    return m ? { code: m[1]?.toUpperCase() ?? null } : null
  }
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onHash = () => {
      setRoute(parse())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

const ENIGMA_VIEWS: Record<EnigmaId, ComponentType> = {
  1: E1Instagram,
  2: E2Judicial,
  3: E3WhatsApp,
  4: E4Derogations,
  5: E5DPI,
  6: E6Tribunal,
  7: E7Crisis,
  8: E8Virality,
}

function Game() {
  const { state, allSolved } = useGame()

  if (state.phase === 'briefing') return <Briefing />

  let content
  if (state.phase === 'won') content = <Victory key="won" />
  else if (state.view === 'lock' && allSolved) content = <FinalLock key="lock" />
  else if (typeof state.view === 'number') {
    const View = ENIGMA_VIEWS[state.view]
    content = <View key={state.view} />
  } else content = <Dashboard key="dashboard" />

  return (
    <>
      <Header />
      <main className="pb-16">
        <AnimatePresence mode="wait">{content}</AnimatePresence>
      </main>
      <TimeUpDialog />
    </>
  )
}

export default function App() {
  const teacher = useTeacherRoute()

  if (teacher) {
    return (
      <Suspense fallback={<div className="bg-cyber min-h-dvh" />}>
        <TeacherDashboard code={teacher.code} />
      </Suspense>
    )
  }

  return (
    <GameProvider>
      <div className="bg-cyber min-h-dvh">
        <Game />
      </div>
    </GameProvider>
  )
}
