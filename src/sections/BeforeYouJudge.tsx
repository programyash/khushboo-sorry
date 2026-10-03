import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { Doodle, HeartIcon } from '../components/Doodle'
import { Lightbox } from '../components/Lightbox'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { photo, SECRET_PHOTO } from '../data/photos'
import { heartBurst, originOf } from '../lib/celebrate'
import { gsap, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

const CLAUSES = [
  'Yes, I made an entire website instead of just texting properly. I am aware this is a choice.',
  'The jokes are a coping mechanism. The apology is not a joke.',
  'You agree to read till the end before deciding my fate.',
  'You will not screenshot this and send it to everyone. (Okay. Maybe one person.)',
  'Some parts are cringe. All parts are real.',
]

/** "Terms & Conditions of this apology" — tickable, with a stamp payoff and a secret sticker. */
export function BeforeYouJudge() {
  const { reduced, unlock } = useExperience()
  const root = useRef<HTMLElement>(null)
  const [checked, setChecked] = useState<boolean[]>(() => CLAUSES.map(() => false))
  const [secretOpen, setSecretOpen] = useState(false)
  const [touched, setTouched] = useState(false)
  const stickerRef = useRef<HTMLButtonElement>(null)
  const allAgreed = checked.every(Boolean)
  const secret = photo(SECRET_PHOTO)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap.from(q('.tc-card'), {
        y: 120,
        rotate: 4,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.tc-card')[0], start: 'top 85%' },
      })
      gsap.from(q('.tc-clause'), {
        x: -30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: q('.tc-list')[0], start: 'top 80%' },
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  const toggle = (i: number) => {
    const next = checked.map((v, j) => (j === i ? !v : v))
    setChecked(next)
    sound.pop()
    if (next.every(Boolean) && !allAgreed) window.setTimeout(() => sound.stamp(), 250)
  }

  const touch = () => {
    sound.boing()
    setTouched(true)
    heartBurst(originOf(stickerRef.current), 16)
    if (stickerRef.current && !reduced) gsap.fromTo(stickerRef.current, { rotate: -20 }, { rotate: 0, duration: 1, ease: 'elastic.out(1.2, 0.3)' })
    window.setTimeout(() => {
      setSecretOpen(true)
      unlock('hunter')
    }, 900)
  }

  return (
    <Section id="judge" sectionRef={root} className="relative overflow-hidden bg-blush-50 px-4 py-24 sm:py-32">
      <div aria-hidden className="dots-bg absolute inset-0 opacity-70" />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="eyebrow text-blush-600">Important legal stuff</p>
          <h2 className="display mt-3 text-[clamp(2.6rem,7vw,5rem)] text-ink">
            Before you <em className="text-blush-500">judge</em> me…
          </h2>
        </div>

        <div className="tc-card paper relative rounded-[22px] border border-blush-100 px-5 py-8 shadow-[0_40px_80px_-40px_rgba(178,54,97,.4)] sm:px-12 sm:py-12">
          <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-2" />
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-dashed border-blush-200 pb-4">
            <p className="text-sm font-extrabold tracking-[0.18em] text-ink uppercase">Terms &amp; Conditions of this Apology</p>
            <p className="font-mono text-xs text-ink-mute">v10.0 · non-negotiable-ish</p>
          </div>
          <p className="hand mt-3 text-xl text-ink-mute">Please read carefully. (Or at least pretend to.)</p>

          <ol className="tc-list mt-6 space-y-3">
            {CLAUSES.map((c, i) => (
              <li key={c} className="tc-clause">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked[i]}
                  onClick={() => toggle(i)}
                  className={cn(
                    'group flex w-full items-start gap-4 rounded-2xl border-2 p-3 text-left transition-colors sm:p-4',
                    checked[i] ? 'border-blush-200 bg-blush-50' : 'border-transparent hover:bg-cloud-50',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 transition-all duration-300',
                      checked[i] ? 'scale-110 border-blush-500 bg-blush-500' : 'border-ink/25 bg-white group-hover:border-blush-300',
                    )}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                      <path
                        d="M4 12.5 L10 18 L20 6"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                        style={{ strokeDasharray: 1, strokeDashoffset: checked[i] ? 0 : 1, transition: 'stroke-dashoffset .35s ease .05s' }}
                      />
                    </svg>
                  </span>
                  <span className="text-[1.02rem] leading-relaxed text-ink-soft sm:text-lg">
                    <span className="mr-2 font-mono text-sm text-blush-500">§{i + 1}</span>
                    {c}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest text-ink-mute uppercase">Signed</p>
              <p className="hand text-3xl text-ink">Yash <span className="text-xl text-ink-mute">(nervously)</span></p>
              <Doodle name="loop" className="-mt-1 w-40 text-blush-400" />
            </div>
            <p className="font-mono text-sm text-ink-mute" aria-live="polite">
              {checked.filter(Boolean).length} / {CLAUSES.length} agreed
            </p>
          </div>

          {/* the stamp */}
          <AnimatePresence>
            {allAgreed && (
              <motion.div
                initial={{ scale: 3, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: -12 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.15 }}
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                aria-hidden
              >
                <div className="rounded-xl border-[5px] border-blush-500 px-6 py-2 font-black tracking-[0.2em] text-blush-500 opacity-85 mix-blend-multiply sm:text-5xl [text-shadow:0_0_1px_#f2678f] text-4xl">
                  AGREED ✓
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* secret sticker */}
          <button
            ref={stickerRef}
            type="button"
            onClick={touch}
            data-cursor="heart"
            aria-label={touched ? 'You touched it. Of course you did.' : 'A tiny sticker that says: don’t touch this'}
            className="absolute -right-3 -bottom-8 flex flex-col items-center sm:-right-10 sm:-bottom-10"
          >
            <span className="sticker block w-12 animate-wiggle sm:w-14" style={{ ['--r' as string]: '12deg' }}>
              <HeartIcon className="h-full w-full" color="#f2678f" />
            </span>
            <span className="hand mt-1 max-w-[9rem] rotate-[-6deg] text-center text-base leading-tight text-ink-soft">
              {touched ? 'you touched it. of course you did.' : 'don’t touch this.'}
            </span>
          </button>
        </div>

        <AnimatePresence>
          {allAgreed && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-14 text-center text-lg text-ink-soft"
            >
              Excellent. You are now <strong className="text-ink">legally obligated</strong> to keep scrolling. ↓
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {secret && (
        <Lightbox
          photo={secretOpen ? secret : null}
          onClose={() => setSecretOpen(false)}
          eyebrow="Hidden memory unlocked"
          title="You touched it. Of course you did."
          note={<p>Secret file: proof that you’re cute even in black &amp; white. Please don’t let this go to your head.</p>}
        />
      )}
    </Section>
  )
}
