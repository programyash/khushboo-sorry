import { AnimatePresence, motion } from 'motion/react'
import { useExperience } from '../context/Experience'

/** Achievement / easter-egg toasts, top centre. */
export function Toasts() {
  const { toasts, dismissToast } = useExperience()
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-16 z-[150] flex flex-col items-center gap-2 px-4 sm:top-20">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            layout
            onClick={() => dismissToast(t.id)}
            initial={{ opacity: 0, y: -24, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="pointer-events-auto flex max-w-[92vw] items-center gap-3 rounded-2xl border border-blush-200 bg-white/95 py-2.5 pr-5 pl-2.5 text-left shadow-[0_18px_40px_-18px_rgba(178,54,97,.55)] backdrop-blur"
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl ${t.kind === 'badge' ? 'bg-gradient-to-br from-blush-100 to-lilac-100' : 'bg-cloud-100'}`}>
              {t.emoji}
            </span>
            <span className="min-w-0">
              {t.sub && <span className="eyebrow block text-[0.62rem] text-blush-600">{t.sub}</span>}
              <span className="block text-sm font-semibold text-ink sm:text-[0.95rem]">{t.title}</span>
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
