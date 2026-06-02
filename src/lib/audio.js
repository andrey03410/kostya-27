/**
 * Самодостаточный аудио-движок на Web Audio API — без внешних файлов.
 * - SFX: короткие звуки (монетка, разряд, поп, успех).
 * - Ambient: мягкий «пад»-фон, который включается тумблером музыки.
 *
 * Всё аккуратно защищено: если AudioContext недоступен (например, в jsdom-тестах),
 * функции просто ничего не делают и не бросают исключений.
 */

let ctx = null
let masterGain = null
let ambientNodes = null
let ambientOn = false

function hasAudio() {
  return typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
}

/** Лениво создаёт AudioContext (нужен пользовательский жест на старте). */
export function ensureAudio() {
  if (!hasAudio()) return null
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext
    ctx = new Ctor()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.35
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Короткий звуковой эффект. type: 'coin' | 'zap' | 'pop' | 'success' | 'fail'. */
export function playSfx(type) {
  const audio = ensureAudio()
  if (!audio) return
  const now = audio.currentTime
  const gain = audio.createGain()
  gain.connect(masterGain)

  const beep = (freq, start, dur, kind = 'sine', peak = 0.5) => {
    const osc = audio.createOscillator()
    const g = audio.createGain()
    osc.type = kind
    osc.frequency.setValueAtTime(freq, now + start)
    g.gain.setValueAtTime(0.0001, now + start)
    g.gain.exponentialRampToValueAtTime(peak, now + start + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
    osc.connect(g)
    g.connect(gain)
    osc.start(now + start)
    osc.stop(now + start + dur + 0.02)
  }

  switch (type) {
    case 'coin':
      beep(988, 0, 0.08, 'square', 0.3)
      beep(1319, 0.07, 0.12, 'square', 0.3)
      break
    case 'zap': {
      const osc = audio.createOscillator()
      const g = audio.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.18)
      g.gain.setValueAtTime(0.4, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
      osc.connect(g)
      g.connect(gain)
      osc.start(now)
      osc.stop(now + 0.22)
      break
    }
    case 'pop':
      beep(440, 0, 0.09, 'triangle', 0.4)
      break
    case 'success':
      beep(523, 0, 0.12, 'sine', 0.35)
      beep(659, 0.1, 0.12, 'sine', 0.35)
      beep(784, 0.2, 0.18, 'sine', 0.35)
      break
    case 'fail':
      beep(196, 0, 0.25, 'sawtooth', 0.3)
      break
    default:
      break
  }
}

/** Запускает мягкий ambient-пад (фоновая «музыка»). */
export function startAmbient() {
  const audio = ensureAudio()
  if (!audio || ambientOn) return
  ambientOn = true

  const pad = audio.createGain()
  pad.gain.value = 0
  pad.gain.linearRampToValueAtTime(0.12, audio.currentTime + 2)
  pad.connect(masterGain)

  // Тёплый аккорд (отсылка к ламповому настроению Clannad)
  const freqs = [220, 277.18, 329.63, 440] // A3, C#4, E4, A4
  const oscillators = freqs.map((f, i) => {
    const osc = audio.createOscillator()
    osc.type = i % 2 === 0 ? 'sine' : 'triangle'
    osc.frequency.value = f
    // Лёгкое биение через расстройку
    osc.detune.value = (i - 1.5) * 4
    const g = audio.createGain()
    g.gain.value = 0.25
    osc.connect(g)
    g.connect(pad)
    osc.start()
    return osc
  })

  // Медленное «дыхание» громкости
  const lfo = audio.createOscillator()
  const lfoGain = audio.createGain()
  lfo.frequency.value = 0.08
  lfoGain.gain.value = 0.04
  lfo.connect(lfoGain)
  lfoGain.connect(pad.gain)
  lfo.start()

  ambientNodes = { pad, oscillators, lfo }
}

/** Останавливает ambient-пад. */
export function stopAmbient() {
  if (!ctx || !ambientOn || !ambientNodes) {
    ambientOn = false
    return
  }
  const { pad, oscillators, lfo } = ambientNodes
  const now = ctx.currentTime
  pad.gain.cancelScheduledValues(now)
  pad.gain.setValueAtTime(pad.gain.value, now)
  pad.gain.linearRampToValueAtTime(0.0001, now + 1)
  oscillators.forEach((o) => o.stop(now + 1.1))
  lfo.stop(now + 1.1)
  ambientNodes = null
  ambientOn = false
}

export function isAmbientPlaying() {
  return ambientOn
}
