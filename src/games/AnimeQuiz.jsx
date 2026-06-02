import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { QUIZ_QUESTIONS } from '../data/quiz'
import {
  createQuizState,
  answerQuestion,
  gradeQuiz,
  gradeLabel,
} from '../lib/quizEngine'
import { useAppStore } from '../store/useAppStore'
import { useSound } from '../hooks/useSound'
import Button from '../components/Button'

export default function AnimeQuiz() {
  const [state, setState] = useState(createQuizState)
  const [selected, setSelected] = useState(null) // выбранный вариант (для подсветки)
  const submitScore = useAppStore((s) => s.submitScore)
  const best = useAppStore((s) => s.bestScores.quiz)
  const { sfx } = useSound()

  const q = QUIZ_QUESTIONS[state.index]

  // Подача результата в стор по завершении
  useEffect(() => {
    if (state.finished) {
      const { correct } = gradeQuiz(QUIZ_QUESTIONS, state.answers)
      submitScore('quiz', correct)
    }
  }, [state.finished, state.answers, submitScore])

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    sfx(i === q.correct ? 'success' : 'fail')
    setTimeout(() => {
      setState((prev) => answerQuestion(prev, QUIZ_QUESTIONS, i))
      setSelected(null)
    }, 850)
  }

  function restart() {
    setState(createQuizState())
    setSelected(null)
  }

  if (state.finished) {
    const { correct, total, percent } = gradeQuiz(QUIZ_QUESTIONS, state.answers)
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-2 text-5xl font-display font-bold text-glow"
        >
          {correct}/{total}
        </motion.div>
        <p className="mb-1 text-lg text-rg-cyan">{gradeLabel(percent)}</p>
        <p className="mb-6 text-sm text-white/60">Лучший результат: {best}</p>
        <Button onClick={restart}>Сыграть ещё раз</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-white/60">
        <span>
          Вопрос {state.index + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 uppercase tracking-wider">
          {q.universe === 'railgun' ? '⚡ Railgun' : '🌸 Clannad'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.h4
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="mb-5 min-h-[3.5rem] text-xl font-display"
        >
          {q.question}
        </motion.h4>
      </AnimatePresence>

      <div className="grid gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = selected !== null && i === q.correct
          const isWrong = selected === i && i !== q.correct
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => choose(i)}
              whileHover={selected === null ? { scale: 1.02 } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              disabled={selected !== null}
              className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                isCorrect
                  ? 'border-cl-green bg-cl-green/30 text-white'
                  : isWrong
                    ? 'border-red-400 bg-red-500/20 text-white'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
