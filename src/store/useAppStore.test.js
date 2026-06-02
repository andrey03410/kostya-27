import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from './useAppStore'

function reset() {
  useAppStore.setState({
    musicOn: false,
    bestScores: { railgun: 0, dango: 0, memory: null, quiz: 0 },
    finaleCompleted: false,
  })
}

describe('useAppStore', () => {
  beforeEach(reset)

  it('переключает музыку', () => {
    expect(useAppStore.getState().musicOn).toBe(false)
    useAppStore.getState().toggleMusic()
    expect(useAppStore.getState().musicOn).toBe(true)
  })

  it('обновляет рекорд по очкам только если больше', () => {
    const { submitScore } = useAppStore.getState()
    expect(submitScore('railgun', 50)).toBe(true)
    expect(useAppStore.getState().bestScores.railgun).toBe(50)
    expect(submitScore('railgun', 30)).toBe(false)
    expect(useAppStore.getState().bestScores.railgun).toBe(50)
    expect(submitScore('railgun', 80)).toBe(true)
    expect(useAppStore.getState().bestScores.railgun).toBe(80)
  })

  it('для memory лучше = меньше ходов', () => {
    const { submitScore } = useAppStore.getState()
    expect(submitScore('memory', 12)).toBe(true)
    expect(submitScore('memory', 15)).toBe(false)
    expect(submitScore('memory', 8)).toBe(true)
    expect(useAppStore.getState().bestScores.memory).toBe(8)
  })

  it('отмечает прохождение финала', () => {
    useAppStore.getState().completeFinale()
    expect(useAppStore.getState().finaleCompleted).toBe(true)
  })

  it('сбрасывает прогресс', () => {
    useAppStore.getState().submitScore('quiz', 5)
    useAppStore.getState().completeFinale()
    useAppStore.getState().resetProgress()
    expect(useAppStore.getState().bestScores.quiz).toBe(0)
    expect(useAppStore.getState().finaleCompleted).toBe(false)
  })
})
