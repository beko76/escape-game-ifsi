import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import { Briefing } from './components/Briefing'
import { Dashboard } from './components/Dashboard'
import { FinalLock } from './components/FinalLock'
import { Header } from './components/Header'
import { TimeUpDialog } from './components/TimeUpDialog'
import { Victory } from './components/Victory'
import { E1Instagram } from './enigmas/E1Instagram'
import { E2LegalPuzzle } from './enigmas/E2LegalPuzzle'
import { E3WhatsApp } from './enigmas/E3WhatsApp'
import { E4DecisionTree } from './enigmas/E4DecisionTree'
import { E5Workstation } from './enigmas/E5Workstation'
import { E6TikTok } from './enigmas/E6TikTok'
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
  2: E2LegalPuzzle,
  3: E3WhatsApp,
  4: E4DecisionTree,
  5: E5Workstation,
  6: E6TikTok,
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
