import { useMemo } from 'react'
import { motion } from 'motion/react'
import ParticleField from './components/ParticleField'
import MusicToggle from './components/MusicToggle'
import ScrollNav from './components/ScrollNav'
import EasterEgg from './components/EasterEgg'
import HeroSection from './sections/HeroSection'
import GreetingSection from './sections/GreetingSection'
import GamesSection from './sections/GamesSection'
import FinaleSection from './sections/FinaleSection'
import { useActiveSection } from './hooks/useActiveSection'
import { useReducedMotion } from './hooks/useReducedMotion'

const SECTIONS = [
  { id: 'hero', label: 'Интро', theme: 'railgun', bg: '#0a1a2f' },
  { id: 'greeting', label: 'Поздравление', theme: 'clannad', bg: '#1a1430' },
  { id: 'games', label: 'Игры', theme: 'railgun', bg: '#0a1a2f' },
  { id: 'finale', label: 'Финал', theme: 'clannad', bg: '#2a1a28' },
]

export default function App() {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), [])
  const activeId = useActiveSection(ids)
  const reduced = useReducedMotion()
  const activeSection = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0]

  return (
    <div className="relative">
      {/* Плавно меняющийся фон-градиент */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: `radial-gradient(120% 120% at 50% 0%, ${activeSection.bg} 0%, #060d18 100%)`,
        }}
        transition={{ duration: 1.2 }}
      />

      {/* Поле частиц (переключается по активной секции) */}
      <ParticleField theme={activeSection.theme} reducedMotion={reduced} />

      {/* Глобальный UI */}
      <MusicToggle />
      <ScrollNav sections={SECTIONS} activeId={activeId} />
      <EasterEgg />

      {/* Контент */}
      <main className="relative z-10">
        <section id="hero">
          <HeroSection nextId="greeting" />
        </section>
        <section id="greeting">
          <GreetingSection />
        </section>
        <section id="games">
          <GamesSection />
        </section>
        <section id="finale">
          <FinaleSection />
        </section>
      </main>
    </div>
  )
}
