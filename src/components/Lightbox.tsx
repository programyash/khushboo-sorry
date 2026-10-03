import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useExperience } from '../context/Experience'
import type { Photo } from '../data/photos'
import { PhotoImg } from './PhotoImg'

interface LightboxProps {
  photo: Photo | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  eyebrow?: string
  title?: string
  note?: ReactNode
}

/** Full-screen memory viewer. Esc closes, arrows navigate, focus is restored. */
export function Lightbox({ photo, onClose, onPrev, onNext, eyebrow, title, note }: LightboxProps) {
  const { lenis } = useExperience()
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<Element | null>(null)
  const open = Boolean(photo)

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    lenis?.stop()
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      ;(lastFocus.current as HTMLElement | null)?.focus?.()
    }
  }, [open, lenis, onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? photo.caption}
          className="fixed inset-0 z-[180] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close" tabIndex={-1} className="absolute inset-0 bg-ink/70 backdrop-blur-md" onClick={onClose} />
          <motion.figure
            key={photo.id}
            initial={{ opacity: 0, y: 40, rotate: -3, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative z-10 flex max-h-full w-full max-w-4xl flex-col items-center gap-5 sm:flex-row sm:items-end"
          >
            <div className="polaroid relative w-auto max-w-full shrink-0 rotate-[-1.5deg] !pb-4">
              <PhotoImg
                photo={photo}
                fit="contain"
                eager
                sizes="(max-width: 640px) 90vw, 520px"
                className="max-h-[62vh] w-[min(80vw,460px)]"
                style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
              />
            </div>
            <figcaption className="max-w-sm text-center text-white sm:pb-6 sm:text-left">
              {eyebrow && <p className="eyebrow mb-2 text-blush-200">{eyebrow}</p>}
              <p className="display text-3xl text-white italic sm:text-4xl">{title ?? photo.caption}</p>
              {note && <div className="mt-3 text-sm leading-relaxed text-white/80">{note}</div>}
              <div className="mt-6 flex items-center justify-center gap-2 sm:justify-start">
                {onPrev && (
                  <button type="button" onClick={onPrev} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Previous photo">
                    ←
                  </button>
                )}
                {onNext && (
                  <button type="button" onClick={onNext} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Next photo">
                    →
                  </button>
                )}
                <button ref={closeBtn} type="button" onClick={onClose} className="ml-1 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink">
                  Close
                </button>
              </div>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
