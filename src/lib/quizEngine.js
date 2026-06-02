// Чистая логика аниме-квиза. Без React — полностью тестируемо.

/** Начальное состояние квиза. */
export function createQuizState() {
  return { index: 0, answers: [], finished: false }
}

/**
 * Регистрирует ответ на ТЕКУЩИЙ вопрос и продвигает индекс.
 * choiceIndex — выбранный вариант. Возвращает НОВОЕ состояние.
 */
export function answerQuestion(state, questions, choiceIndex) {
  if (state.finished) return state
  const answers = [...state.answers, choiceIndex]
  const nextIndex = state.index + 1
  const finished = nextIndex >= questions.length
  return { index: finished ? state.index : nextIndex, answers, finished }
}

/**
 * Подсчёт результата.
 * Возвращает { correct, total, percent } (percent — целое 0..100).
 */
export function gradeQuiz(questions, answers) {
  const total = questions.length
  let correct = 0
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].correct) correct++
  }
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  return { correct, total, percent }
}

/** Текстовая оценка по доле правильных ответов. */
export function gradeLabel(percent) {
  if (percent === 100) return 'Эспер уровня 5! ⚡'
  if (percent >= 75) return 'Почти идеально! 🌸'
  if (percent >= 50) return 'Неплохо!'
  if (percent >= 25) return 'Есть куда расти 🙂'
  return 'Пересмотри тайтлы 😄'
}
