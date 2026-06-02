import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Глобальное состояние приложения.
 * - Рекорды мини-игр и факт «прошёл финал» сохраняются в localStorage.
 * - Музыка/звук — пользовательская настройка (по умолчанию вкл; реально
 *   стартует после первого жеста пользователя из-за политики автоплея браузеров).
 */
export const useAppStore = create(
  persist(
    (set, get) => ({
      // --- Звук ---
      musicOn: true,
      toggleMusic: () => set((s) => ({ musicOn: !s.musicOn })),
      setMusic: (on) => set({ musicOn: on }),

      // --- Рекорды игр ---
      bestScores: {
        railgun: 0, // очки
        dango: 0, // очки
        memory: null, // лучшее (меньшее) число ходов; null = не играл
        quiz: 0, // правильных ответов
      },

      /**
       * Обновляет рекорд игры. Для memory «лучше» = меньше ходов,
       * для остальных — больше очков. Возвращает true, если рекорд побит.
       */
      submitScore: (game, value) => {
        const prev = get().bestScores[game]
        let isBest
        if (game === 'memory') {
          isBest = prev === null || value < prev
        } else {
          isBest = value > prev
        }
        if (isBest) {
          set((s) => ({ bestScores: { ...s.bestScores, [game]: value } }))
        }
        return isBest
      },

      // --- Прогресс «путешествия» ---
      finaleCompleted: false,
      completeFinale: () => set({ finaleCompleted: true }),

      resetProgress: () =>
        set({
          bestScores: { railgun: 0, dango: 0, memory: null, quiz: 0 },
          finaleCompleted: false,
        }),
    }),
    {
      name: 'konstantin-bday',
      partialize: (s) => ({
        bestScores: s.bestScores,
        finaleCompleted: s.finaleCompleted,
        musicOn: s.musicOn,
      }),
    },
  ),
)
