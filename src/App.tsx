import { AnimatePresence } from 'framer-motion'
import type { ComponentType } from 'react'
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
  return (
    <GameProvider>
      <div className="bg-cyber min-h-dvh">
        <Game />
      </div>
    </GameProvider>
  )
}
