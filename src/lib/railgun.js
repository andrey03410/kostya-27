import { clamp } from './utils'

// Логика мини-игры «Рельсотрон-тир».
// Маркер бежит по шкале 0..1; игрок «стреляет», цель — попасть в центр (0.5).

/**
 * Очки за выстрел по точности попадания в центр.
 * position — позиция маркера 0..1 в момент выстрела.
 * Возвращает { points, accuracy(0..1), label }.
 */
export function scoreShot(position) {
  const distance = Math.abs(position - 0.5) // 0 = идеально, 0.5 = край
  const accuracy = clamp(1 - distance / 0.5, 0, 1)
  let points
  let label
  if (distance <= 0.04) {
    points = 100
    label = 'PERFECT ⚡'
  } else if (distance <= 0.1) {
    points = 60
    label = 'Отлично!'
  } else if (distance <= 0.2) {
    points = 30
    label = 'Неплохо'
  } else {
    points = 10
    label = 'Мимо'
  }
  return { points, accuracy, label }
}

/** Скорость бега маркера растёт с раундом (единиц шкалы за секунду). */
export function markerSpeed(round) {
  return 0.6 + round * 0.12
}

const TOTAL_ROUNDS = 8

export function totalRounds() {
  return TOTAL_ROUNDS
}

/** Игра окончена? */
export function isRangeOver(round) {
  return round >= TOTAL_ROUNDS
}
