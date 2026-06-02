import { motion } from 'motion/react'
import { useAppStore } from '../store/useAppStore'
import { ensureAudio } from '../lib/audio'

// Тумблер фоновой музыки (фикс. в углу). По умолчанию вкл; из-за политики
// автоплея трек реально стартует после первого взаимодействия пользователя.
export default function MusicToggle() {
  const musicOn = useAppStore((s) => s.musicOn)
  const toggleMusic = useAppStore((s) => s.toggleMusic)

  const handle = () => {
    ensureAudio() // создаём AudioContext по жесту пользователя
    toggleMusic()
  }

  return (
    <motion.button
      type="button"
      onClick={handle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-pressed={musicOn}
      aria-label={musicOn ? 'Выключить музыку' : 'Включить музыку'}
      className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-rg-cyan/60 bg-rg-deep/70 text-xl backdrop-blur-md"
    >
      <span aria-hidden="true">{musicOn ? '🔊' : '🔈'}</span>
      {musicOn && (
        <motion.span
          className="absolute inset-0 rounded-full border border-rg-cyan"
          animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}
