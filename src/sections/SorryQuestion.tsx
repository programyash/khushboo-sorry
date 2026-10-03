import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Ambient } from '../components/Ambient'
import { MagneticButton } from '../components/MagneticButton'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { grandCelebration } from '../lib/celebrate'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'
import { KidHead } from '../scenes/Kid'

const NO_TEXTS = [
  'No',
  'Nope',
  'Are you sure?',
  'Think again.',
  'Too slow.',
  'Nice try.',
  'Absolutely not? 🤨',
  'That button has left the chat.',
  'Catch me first.',
]
const QUIPS = [
  'The NO button has trust issues.',
  'It’s shy. Leave it alone.',
  'You’re chasing a button. For me. I’m touched.',
  'Legally, that button is decorative.',
  'Have you considered… the pink one?',
  'The NO button is on a coffee break.',
  'Every time you chase it, the YES gets bigger. Science.',
  'Okay, it’s getting tired.',
]
const GIVE_UP_AFTER = 9

/** "Are you accepting my sorry?" — with the NO button that refuses to be clicked. */
export function SorryQuestion() {
  const { reduced, accepted, accept, unlock, lenis, scrollTo } = useExperience()
  const root = useRef<HTMLElement>(null)
  const arena = useRef<HTMLDivElement>(null)
  const yesRef = useRef<HTMLButtonElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const attempts = useRef(0)
  const cooldown = useRef(0)
  const lastTouch = useRef(0)
  const [noText, setNoText] = useState(NO_TEXTS[0])
  const [quip, setQuip] = useState('')
  const [gaveUp, setGaveUp] = useState(false)
  const [party, setParty] = useState(false)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      const split = SplitText.create(q('.sq-title'), { type: 'words' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 55%' } })
      tl.from(q('.sq-pre'), { autoAlpha: 0, y: 20, duration: 0.8, ease: 'power2.out' })
        .from(split.words, { autoAlpha: 0, y: 50, rotate: () => gsap.utils.random(-8, 8), duration: 0.8, stagger: 0.12, ease: 'back.out(2)' }, '+=0.5')
        .from(q('.sq-btn'), { autoAlpha: 0, scale: 0.4, duration: 0.7, stagger: 0.2, ease: 'back.out(2.4)' }, '-=0.2')
      return () => split.revert()
    },
    { scope: root, dependencies: [reduced] },
  )

  // ── the escaping NO button ──
  const escape = (fromX?: number, fromY?: number) => {
    const btn = noRef.current
    const box = arena.current
    if (!btn || !box || gaveUp) return
    const now = performance.now()
    if (now - cooldown.current < 160) return
    cooldown.current = now

    attempts.current += 1
    const n = attempts.current
    const a = box.getBoundingClientRect()
    const r = btn.getBoundingClientRect()
    const baseLeft = r.left - pos.current.x
    const baseTop = r.top - pos.current.y
    const pad = 10
    const minX = a.left - baseLeft + pad
    const maxX = a.right - baseLeft - r.width - pad
    const minY = a.top - baseTop + pad
    const maxY = a.bottom - baseTop - r.height - pad
    const rand = () => ({ x: gsap.utils.random(minX, maxX), y: gsap.utils.random(minY, maxY) })

    let t: { x: number; y: number }
    if (fromX === undefined || fromY === undefined || Math.random() < 0.22) t = rand()
    else {
      let dx = r.left + r.width / 2 - fromX
      let dy = r.top + r.height / 2 - fromY
      const d = Math.hypot(dx, dy) || 1
      dx /= d
      dy /= d
      const dist = gsap.utils.random(160, 250)
      t = { x: pos.current.x + dx * dist, y: pos.current.y + dy * dist }
      if (t.x < minX || t.x > maxX || t.y < minY || t.y > maxY) t = rand()
    }
    // never land on top of YES
    const yes = yesRef.current?.getBoundingClientRect()
    for (let k = 0; k < 8 && yes; k++) {
      const L = baseLeft + t.x
      const T = baseTop + t.y
      const hit = L < yes.right + 24 && L + r.width > yes.left - 24 && T < yes.bottom + 24 && T + r.height > yes.top - 24
      if (!hit) break
      t = rand()
    }
    pos.current = t

    const shrink = Math.max(0.64, 1 - n * 0.04)
    if (reduced) gsap.set(btn, { x: t.x, y: t.y, scale: shrink })
    else gsap.to(btn, { x: t.x, y: t.y, rotation: gsap.utils.random(-14, 14), scale: shrink, duration: 0.55, ease: 'back.out(2.2)', overwrite: true })
    if (yesRef.current) gsap.to(yesRef.current, { scale: Math.min(1.5, 1 + n * 0.055), duration: reduced ? 0 : 0.6, ease: 'elastic.out(1, 0.5)' })
    sound.tick()
    setNoText(NO_TEXTS[n % NO_TEXTS.length])
    setQuip(QUIPS[(n - 1) % QUIPS.length])

    if (n >= GIVE_UP_AFTER) {
      window.setTimeout(() => {
        setGaveUp(true)
        setNoText('Okay fine… YES 🥺')
        setQuip('The NO button has given up. Even it wants you to say yes.')
        gsap.to(btn, { rotation: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      }, 650)
    }
  }

  // Mouse proximity.
  useEffect(() => {
    const box = arena.current
    if (!box || accepted) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || gaveUp) return
      const btn = noRef.current
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const near = Math.max(r.width, r.height) / 2 + 64
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < near) escape(e.clientX, e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    const onResize = () => {
      pos.current = { x: 0, y: 0 }
      if (noRef.current) gsap.set(noRef.current, { x: 0, y: 0 })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
    }
  })

  const sayYes = () => {
    if (accepted) return
    sound.celebrate()
    grandCelebration()
    accept()
    unlock('friends')
    setParty(true)
    lenis?.stop()
    if (!reduced && root.current) {
      const content = root.current.querySelector('.sq-content')
      if (content) gsap.fromTo(content, { x: -12 }, { x: 0, duration: 0.7, ease: 'elastic.out(1.4, 0.2)', clearProps: 'transform' })
    }
  }

  const onNo = (e: MouseEvent<HTMLButtonElement>) => {
    if (gaveUp) {
      sayYes()
      return
    }
    // a touch tap already escaped on pointerdown
    if (performance.now() - lastTouch.current < 900) return
    // keyboard activation has detail === 0
    if (e.detail === 0) setQuip('Keyboard warrior detected. The NO button is on strike today.')
    escape()
  }

  const continueStory = () => {
    setParty(false)
    lenis?.start()
    window.setTimeout(() => scrollTo('#climax', { duration: 2.2 }), 120)
  }

  return (
    <Section id="question" sectionRef={root} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-blush-100 px-4 py-24">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,#fff6f9_0%,#ffe8ef_55%,#ffd3e0_100%)]" />
      <Ambient count={14} kinds={['heart', 'sparkle']} seed={77} colors={['#ffb3c9', '#ff8fb0', '#ffffff']} />

      <div className="sq-content relative z-10 w-full max-w-4xl text-center">
        <p className="sq-pre hand text-3xl text-ink-soft sm:text-4xl">One last question.</p>
        <h2 className="sq-title display mt-4 text-[clamp(2.6rem,8vw,6.4rem)] leading-[1] text-ink">
          Are you accepting <em className="text-blush-500">my sorry?</em>
        </h2>

        {!accepted ? (
          <>
            <div ref={arena} className="relative mx-auto mt-10 flex h-[46vh] max-h-[460px] min-h-[300px] w-full items-center justify-center gap-6 sm:gap-10">
              <MagneticButton
                ref={yesRef}
                onClick={sayYes}
                data-cursor="heart"
                wrapClassName="sq-btn relative z-10"
                className="btn-primary px-10 py-5 text-2xl shadow-[0_0_0_8px_rgba(255,143,176,.25),0_20px_50px_-12px_rgba(217,74,117,.8)]"
              >
                YES <span aria-hidden>❤️</span>
              </MagneticButton>
              <span className="sq-btn relative z-20 inline-block">
                <button
                  ref={noRef}
                  type="button"
                  onClick={onNo}
                  onPointerDown={(e) => {
                    if (e.pointerType !== 'mouse' && !gaveUp) {
                      e.preventDefault()
                      lastTouch.current = performance.now()
                      escape()
                    }
                  }}
                  className={cn(
                    'rounded-full border-2 px-7 py-4 text-lg font-bold whitespace-nowrap shadow-md transition-colors',
                    gaveUp ? 'border-blush-400 bg-blush-400 text-white' : 'border-ink/15 bg-white text-ink',
                  )}
                >
                  {gaveUp ? noText : <>{noText === 'No' ? 'NO 😤' : noText}</>}
                </button>
              </span>
            </div>
            <p className="hand mx-auto h-8 max-w-md text-2xl text-ink-mute" aria-live="polite">
              {quip}
            </p>
            <p className="mt-6 text-sm text-ink-mute">(The rest of this website stays locked until you answer. Yes, I’m serious.)</p>
          </>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-4">
            <span className="-rotate-3 rounded-2xl border-[4px] border-blush-500 px-6 py-3 text-2xl font-black tracking-widest text-blush-500 sm:text-3xl">
              SORRY ACCEPTED ✓
            </span>
            <p className="hand text-2xl text-ink-mute">(no take-backs. it’s in writing now.)</p>
            <button type="button" onClick={() => scrollTo('#climax')} className="btn-ghost mt-4">
              Keep going ↓
            </button>
          </div>
        )}
      </div>

      <Celebration open={party} onContinue={continueStory} reduced={reduced} />
    </Section>
  )
}

function Celebration({ open, onContinue, reduced }: { open: boolean; onContinue: () => void; reduced: boolean }) {
  const [stage, setStage] = useState(0)
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) {
      setStage(0)
      return
    }
    const t1 = window.setTimeout(() => setStage(1), reduced ? 0 : 1700)
    const t2 = window.setTimeout(() => setStage(2), reduced ? 0 : 3300)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [open, reduced])
  useEffect(() => {
    if (stage === 2) btn.current?.focus({ preventScroll: true })
  }, [stage])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onContinue()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onContinue])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Celebration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[170] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#fff6f9,#ffd3e0)] px-6 text-center"
        >
          <Ambient count={22} kinds={['heart']} motion="rise" seed={5} colors={['#ff8fb0', '#f2678f', '#ffb3c9', '#c8b6f6']} maxSize={46} />
          <KidHead who="yash" mood="love" className="relative w-24 sm:w-28" />
          <motion.h2
            initial={{ scale: 0.3, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 }}
            className="display text-glow relative mt-4 text-[clamp(2.6rem,9vw,7rem)] leading-[0.95] text-blush-500 italic"
          >
            I KNEW YOU HAD A HEART.
          </motion.h2>
          <AnimatePresence>
            {stage >= 1 && (
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="hand relative mt-6 text-3xl text-ink-soft sm:text-4xl">
                Okay… maybe I deserved to panic for a while.
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {stage >= 2 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative mt-10">
                <button ref={btn} type="button" onClick={onContinue} className="btn-primary text-lg">
                  There’s one more thing ↓
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
