import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import GameShell from '../components/GameShell'
import RailgunRange from '../games/RailgunRange'
import DangoCatch from '../games/DangoCatch'
import MemoryMatch from '../games/MemoryMatch'
import AnimeQuiz from '../games/AnimeQuiz'
import { useAppStore } from '../store/useAppStore'

const GAMES = [
  {
    id: 'railgun',
    title: 'Рельсотрон-тир',
    emoji: '⚡',
    accent: 'electric',
    desc: 'Поймай момент и выстрели в самый центр',
    Component: RailgunRange,
    bestLabel: (v) => `Рекорд: ${v}`,
  },
  {
    id: 'dango',
    title: 'Лови данго',
    emoji: '🍡',
    accent: 'warm',
    desc: 'Собери семью данго корзинкой',
    Component: DangoCatch,
    bestLabel: (v) => `Рекорд: ${v}`,
  },
  {
    id: 'memory',
    title: 'Найди пару',
    emoji: '🃏',
    accent: 'electric',
    desc: 'Открой все пары за меньшее число ходов',
    Component: MemoryMatch,
    bestLabel: (v) => (v === null ? 'Ещё не пройдено' : `Лучшее: ${v} ходов`),
  },
  {
    id: 'quiz',
    title: 'Аниме-квиз',
    emoji: '❓',
    accent: 'warm',
    desc: 'Проверь знания Clannad и Railgun',
    Component: AnimeQuiz,
    bestLabel: (v) => `Рекорд: ${v}`,
  },
]

export default function GamesSection() {
  const [activeId, setActiveId] = useState(null)
  const bestScores = useAppStore((s) => s.bestScores)
  const active = GAMES.find((g) => g.id === activeId)

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-3 text-4xl font-display font-bold sm:text-5xl"
      >
        Активности 🎮
      </motion.h2>
      <p className="mb-12 text-white/60">Четыре мини-игры по обеим вселенным</p>

      <div className="grid gap-5 sm:grid-cols-2">
        {GAMES.map((g, i) => (
          <motion.button
            key={g.id}
            type="button"
            onClick={() => setActiveId(g.id)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`group flex flex-col items-start gap-2 rounded-3xl border p-6 text-left backdrop-blur-sm ${
              g.accent === 'warm'
                ? 'border-cl-pink/40 bg-cl-pink/10 hover:bg-cl-pink/20'
                : 'border-rg-cyan/40 bg-rg-blue/10 hover:bg-rg-blue/20'
            }`}
          >
            <span className="text-4xl transition-transform group-hover:scale-110">
              {g.emoji}
            </span>
            <span className="font-display text-xl font-semibold">{g.title}</span>
            <span className="text-sm text-white/60">{g.desc}</span>
            <span className="mt-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              {g.bestLabel(bestScores[g.id])}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <GameShell
            title={active.title}
            accent={active.accent}
            onClose={() => setActiveId(null)}
          >
            <active.Component />
          </GameShell>
        )}
      </AnimatePresence>
    </div>
  )
}
