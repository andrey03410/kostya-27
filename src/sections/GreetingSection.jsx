import { motion } from 'motion/react'
import { GREETING_PARAGRAPHS, WISHES, BIRTHDAY } from '../data/messages'
import Dango from '../components/Dango'

const DANGO_ROW = ['pink', 'green', 'yellow', 'white', 'brown']

export default function GreetingSection() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center">
      {/* Большое «27» из свечения */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        className="relative mb-2"
      >
        <span className="font-display text-[9rem] font-bold leading-none text-rg-cyan text-glow sm:text-[12rem]">
          {BIRTHDAY.age}
        </span>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '60%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="divider-arc mb-10"
      />

      {/* Абзацы поздравления — появляются по очереди */}
      <div className="flex flex-col gap-6">
        {GREETING_PARAGRAPHS.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className={
              i === 0
                ? 'text-2xl font-display font-semibold text-rg-white sm:text-3xl'
                : 'text-lg leading-relaxed text-rg-white/80'
            }
          >
            {para}
          </motion.p>
        ))}
      </div>

      {/* Лента пожеланий */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 flex flex-wrap items-center justify-center gap-2"
      >
        {WISHES.map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-full border border-cl-pink/40 bg-cl-pink/10 px-3 py-1 text-sm text-cl-sakura"
          >
            {w}
          </motion.span>
        ))}
      </motion.div>

      {/* Семья данго (мостик к тёплой части) */}
      <div className="mt-14 flex items-end justify-center gap-1">
        {DANGO_ROW.map((color, i) => (
          <motion.div
            key={color}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          >
            <Dango color={color} size={48} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
