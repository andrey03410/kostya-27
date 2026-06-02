import { describe, it, expect } from 'vitest'
import {
  createQuizState,
  answerQuestion,
  gradeQuiz,
  gradeLabel,
} from './quizEngine'

const QS = [
  { id: 'q1', correct: 1, options: ['a', 'b'] },
  { id: 'q2', correct: 0, options: ['a', 'b'] },
  { id: 'q3', correct: 2, options: ['a', 'b', 'c'] },
]

describe('createQuizState', () => {
  it('стартует с нуля', () => {
    expect(createQuizState()).toEqual({ index: 0, answers: [], finished: false })
  })
})

describe('answerQuestion', () => {
  it('записывает ответ и двигает индекс', () => {
    const s1 = answerQuestion(createQuizState(), QS, 1)
    expect(s1.answers).toEqual([1])
    expect(s1.index).toBe(1)
    expect(s1.finished).toBe(false)
  })

  it('помечает finished на последнем вопросе', () => {
    let s = createQuizState()
    s = answerQuestion(s, QS, 1)
    s = answerQuestion(s, QS, 0)
    s = answerQuestion(s, QS, 2)
    expect(s.finished).toBe(true)
    expect(s.answers).toHaveLength(3)
  })

  it('игнорирует ответы после завершения', () => {
    let s = { index: 2, answers: [1, 0, 2], finished: true }
    const after = answerQuestion(s, QS, 1)
    expect(after).toBe(s)
  })
})

describe('gradeQuiz', () => {
  it('считает правильные и процент', () => {
    expect(gradeQuiz(QS, [1, 0, 2])).toEqual({ correct: 3, total: 3, percent: 100 })
    expect(gradeQuiz(QS, [1, 1, 1])).toEqual({ correct: 1, total: 3, percent: 33 })
    expect(gradeQuiz(QS, [0, 1, 0])).toEqual({ correct: 0, total: 3, percent: 0 })
  })

  it('пустой квиз = 0%', () => {
    expect(gradeQuiz([], [])).toEqual({ correct: 0, total: 0, percent: 0 })
  })
})

describe('gradeLabel', () => {
  it('даёт разные оценки по порогам', () => {
    expect(gradeLabel(100)).toMatch(/уровня 5/i)
    expect(gradeLabel(80)).not.toBe(gradeLabel(40))
    expect(typeof gradeLabel(0)).toBe('string')
  })
})
