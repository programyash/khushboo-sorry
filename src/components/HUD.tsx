import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useExperience } from '../context/Experience'
import { BADGES } from '../data/badges'
import { CHAPTERS, CHAPTER_ORDER, type ChapterId } from '../data/chapters'
import { ScrollTrigger } from '../lib/gsap'
import { cn } from '../lib/utils'

/**
 * The little game HUD: current chapter, "Friendship HP" (it heals as she
 * scrolls, and only reaches 100% when the apology is accepted), achievements,
 * sound toggle and a scroll progress line.
 */
export function HUD() {
  const { started, accepted, badges, soundOn, toggleSound, quizFacts } = useExperience()
  const [chapter, setChapter] = useState<ChapterId>('opening')
  const [shelf, setShelf] = useState(false)
  const hpText = useRef<HTMLSpanElement>(null)
  const hpBar = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const shelfRef = useRef<HTMLDivElement>(null)

  // Which chapter crosses the middle of the screen?
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setChapter(e.target.getAttribute('data-chapter') as ChapterId)
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [accepted, started])

  const paintHP = useCallback(() => {
    const hp = accepted ? 100 : Math.min(96, Math.round(24 + progress.current * 62 + quizFacts * 2))
    if (hpText.current) hpText.current.textContent = `${hp}%`
    if (hpBar.current) hpBar.current.style.transform = `scaleX(${hp / 100})`
  }, [accepted, quizFacts])

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        progress.current = self.progress
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
        paintHP()
      },
    })
    paintHP()
    return () => st.kill()
  }, [paintHP])

  // Close the badge shelf on outside click / Escape.
  useEffect(() => {
    if (!shelf) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShelf(false)
    const onDown = (e: PointerEvent) => {
      if (!shelfRef.current?.contains(e.target as Node)) setShelf(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [shelf])

  const idx = CHAPTER_ORDER.indexOf(chapter) + 1

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex items-start justify-between gap-2 p-3 sm:p-5">
        <div className="min-w-0">
          <AnimatePresence>
            {started && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-auto flex h-10 max-w-[46vw] items-center gap-2 overflow-hidden rounded-full border border-white/70 bg-white/75 pr-4 pl-1.5 shadow-[0_8px_24px_-14px_rgba(43,29,47,.4)] backdrop-blur-md sm:max-w-none"
              >
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-ink px-1.5 text-[0.7rem] font-bold text-white tabular-nums">
                  {String(idx).padStart(2, '0')}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={chapter}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="truncate text-[0.8rem] font-semibold text-ink"
                  >
                    {CHAPTERS[chapter]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {started && (
            <>
              <div
                className={cn(
                  'flex h-10 items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 shadow-[0_8px_24px_-14px_rgba(43,29,47,.4)] backdrop-blur-md transition-colors',
                  accepted && 'border-blush-300 bg-blush-100/90',
                )}
                title="Friendship HP — heals as you scroll. Full recovery requires one specific button."
              >
                <span className={cn('text-sm text-blush-500', accepted && 'animate-beat')} aria-hidden>
                  ♥
                </span>
                <span className="hidden flex-col gap-1 sm:flex">
                  <span className="eyebrow text-[0.55rem] leading-none text-ink-mute">Friendship HP</span>
                  <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-blush-100">
                    <span ref={hpBar} className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-blush-400 to-blush-500 transition-transform duration-500" />
                  </span>
                </span>
                <span ref={hpText} className="text-[0.8rem] font-bold text-ink tabular-nums" aria-label="Friendship health">
                  24%
                </span>
              </div>

              <div ref={shelfRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShelf((s) => !s)}
                  aria-expanded={shelf}
                  aria-label={`Achievements: ${badges.length} of ${BADGES.length} unlocked`}
                  className="flex h-10 items-center gap-1.5 rounded-full border border-white/70 bg-white/75 px-3 text-sm font-bold shadow-[0_8px_24px_-14px_rgba(43,29,47,.4)] backdrop-blur-md"
                >
                  <span aria-hidden>🏆</span>
                  <span className="tabular-nums">
                    {badges.length}
                    <span className="text-ink-mute">/{BADGES.length}</span>
                  </span>
                </button>
                <AnimatePresence>
                  {shelf && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      className="absolute top-12 right-0 w-[min(88vw,320px)] origin-top-right rounded-3xl border border-blush-100 bg-white p-4 shadow-[0_30px_60px_-30px_rgba(43,29,47,.5)]"
                    >
                      <p className="eyebrow mb-3 text-blush-600">Friendship achievements</p>
                      <ul className="space-y-2">
                        {BADGES.map((b) => {
                          const got = badges.includes(b.id)
                          return (
                            <li key={b.id} className={cn('flex items-center gap-3 rounded-2xl p-2', got ? 'bg-blush-50' : 'opacity-60')}>
                              <span className={cn('grid h-9 w-9 place-items-center rounded-xl text-lg', got ? 'bg-white shadow-sm' : 'bg-ink/5 grayscale')}>
                                {got ? b.emoji : '?'}
                              </span>
                              <span>
                                <span className="block text-sm font-semibold">{got ? b.title : '???'}</span>
                                <span className="block text-xs text-ink-mute">{got ? b.how : 'Keep exploring…'}</span>
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full border shadow-[0_8px_24px_-14px_rgba(43,29,47,.4)] backdrop-blur-md transition-colors',
              soundOn ? 'border-blush-300 bg-blush-400 text-white' : 'border-white/70 bg-white/75 text-ink',
            )}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" fillOpacity=".15" />
              {soundOn ? (
                <>
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </>
              ) : (
                <path d="m16 9 5 6m0-6-5 6" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] h-[3px]">
        <div ref={bar} className="h-full origin-left bg-gradient-to-r from-blush-400 via-lilac-300 to-cloud-400" style={{ transform: 'scaleX(0)' }} />
      </div>
    </>
  )
}
