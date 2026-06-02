// Монетка Мисаки — SVG. Анимацию вращения/полёта навешивает родитель (Framer Motion).

export default function Coin({ size = 64, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Монетка"
    >
      <defs>
        <radialGradient id="coin-face" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffe9b0" />
          <stop offset="55%" stopColor="#e8b94a" />
          <stop offset="100%" stopColor="#b9852a" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#coin-face)" stroke="#8a5f1c" strokeWidth="3" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#8a5f1c" strokeWidth="1.5" opacity="0.6" />
      <text
        x="50"
        y="63"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        fill="#8a5f1c"
        fontFamily="serif"
      >
        ¥
      </text>
      {/* блик */}
      <ellipse cx="36" cy="32" rx="10" ry="6" fill="#fff" opacity="0.5" />
    </svg>
  )
}
