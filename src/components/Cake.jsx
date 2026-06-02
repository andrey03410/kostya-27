import { motion } from 'motion/react'

// Одна свечка. lit — горит ли. onBlow — задуть.
function Candle({ lit, onBlow }) {
  return (
    <button
      type="button"
      onClick={onBlow}
      aria-label={lit ? 'Задуть свечу' : 'Свеча задута'}
      className="relative flex flex-col items-center"
      style={{ width: 10 }}
    >
      {/* пламя / дымок */}
      <span className="flex h-4 items-end justify-center">
        {lit ? (
          <motion.span
            className="block h-3 w-2 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 70%, #fff3b0 0%, #ffb347 55%, #ff7a00 100%)',
              boxShadow: '0 0 8px #ffb347',
            }}
            animate={{ scaleY: [1, 1.25, 0.9, 1.1, 1], opacity: [0.9, 1, 0.85, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ) : (
          <span className="text-[10px] opacity-40">💨</span>
        )}
      </span>
      {/* фитиль */}
      <span className="h-1 w-[2px] bg-stone-700" />
      {/* тело свечи */}
      <span
        className="h-6 w-[6px] rounded-sm"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #ff8fab 0 4px, #ffd6e0 4px 8px)',
        }}
      />
    </button>
  )
}

/**
 * Торт с произвольным числом свечей.
 * candles — массив boolean (горит/нет). onBlow(index) — задуть конкретную.
 */
export default function Cake({ candles, onBlow }) {
  return (
    <div className="flex flex-col items-center">
      {/* свечи */}
      <div className="flex max-w-md flex-wrap items-end justify-center gap-x-2 gap-y-1 px-4">
        {candles.map((lit, i) => (
          <Candle key={i} lit={lit} onBlow={() => onBlow(i)} />
        ))}
      </div>

      {/* торт */}
      <div className="relative mt-1 w-72 max-w-full">
        {/* верхний ярус + глазурь */}
        <div className="relative h-16 rounded-t-2xl bg-gradient-to-b from-cl-cream to-cl-sunset">
          <div className="absolute -bottom-2 left-0 right-0 h-6">
            <svg viewBox="0 0 288 24" preserveAspectRatio="none" className="h-full w-full">
              <path
                d="M0 0 Q18 24 36 8 Q54 24 72 8 Q90 24 108 8 Q126 24 144 8 Q162 24 180 8 Q198 24 216 8 Q234 24 252 8 Q270 24 288 8 L288 24 L0 24 Z"
                fill="#fff6e9"
              />
            </svg>
          </div>
        </div>
        {/* нижний ярус */}
        <div className="h-20 rounded-b-2xl bg-gradient-to-b from-cl-pink to-[#e87fa0]" />
        {/* свечения-вишенки */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-around px-6">
          {['#c0392b', '#c0392b', '#c0392b'].map((c, i) => (
            <span key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  )
}
