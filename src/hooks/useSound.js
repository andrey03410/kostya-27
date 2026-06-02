import { useEffect, useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { playSfx, startAmbient, stopAmbient, ensureAudio } from '../lib/audio'

/**
 * Хук-обёртка над аудио-движком.
 * - sfx(type) — проигрывает короткий эффект (если музыка/звук включены).
 * - Синхронизирует ambient-фон с настройкой musicOn в сторе.
 */
export function useSound() {
  const musicOn = useAppStore((s) => s.musicOn)

  useEffect(() => {
    if (musicOn) {
      ensureAudio()
      startAmbient()
    } else {
      stopAmbient()
    }
  }, [musicOn])

  const sfx = useCallback(
    (type) => {
      if (musicOn) playSfx(type)
    },
    [musicOn],
  )

  return { sfx, musicOn }
}
