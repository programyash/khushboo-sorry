import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { MagneticButton } from '../components/MagneticButton'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { BADGES } from '../data/badges'
import { FACT_COUNT, MAX_XP, QUIZ, rankFor } from '../data/quiz'
import { heartBurst, originOf, sparkle } from '../lib/celebrate'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'
import { KidHead, type KidMood } from '../scenes/Kid'

type Phase = 'intro' | 'question' | 'feedback' | 'results'
type Result = { correct: boolean | null; picked: string[] }

const KEYS = ['A', 'B', 'C', 'D', 'E']

/** LEVEL 1 — DO YOU ACTUALLY KNOW YASH? */
export function Quiz() {
  const { reduced, unlock, setQuizFacts, revealPasta, scrollTo, badges } = useExperience()
  const [phase, setPhase] = useState<Phase>('intro')
  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [xp, setXp] = useState(0)
  const [xpPop, setXpPop] = useState<number | null>(null)
  const [nudge, setNudge] = useState<string | null>(null)
  const card = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const shake = useAnimationControls()

  const q = QUIZ[qi]
  const multi = (q.answer?.length ?? 0) > 1
  const result = results[qi]
  const factsRight = results.filter((r, i) => QUIZ[i].kind === 'fact' && r?.correct).length

  useEffect(() => setQuizFacts(factsRight), [factsRight, setQuizFacts])

  const start = () => {
    sound.pop()
    setPhase('question')
  }

  const lockIn = (picked: string[]) => {
    const isFact = q.kind === 'fact'
    const correct = isFact ? picked.length === q.answer!.length && picked.every((p) => q.answer!.includes(p)) : null
    setResults((r) => {
      const next = [...r]
      next[qi] = { correct, picked }
      return next
    })
    if (q.id === 'tiffin') revealPasta()
    const anchor = optionRefs.current[picked[picked.length - 1]]
    if (correct === false) {
      sound.boing()
      if (!reduced) void shake.start({ x: [0, -16, 14, -10, 8, -4, 0], rotate: [0, -1.5, 1.5, -1, 1, 0, 0], transition: { duration: 0.6 } })
    } else {
      sound.chime()
      const gain = q.xp
      setXp((x) => x + gain)
      setXpPop(gain)
      window.setTimeout(() => setXpPop(null), 1400)
      if (correct) {
        sparkle(originOf(anchor))
        heartBurst(originOf(anchor), 10)
        if (q.badge) window.setTimeout(() => unlock(q.badge!), 600)
      } else sparkle(originOf(anchor))
    }
    setPhase('feedback')
  }

  const choose = (opt: string) => {
    if (phase !== 'question') return
    if (!multi) {
      setSelected([opt])
      lockIn([opt])
      return
    }
    sound.click()
    if (selected.includes(opt)) setSelected(selected.filter((x) => x !== opt))
    else if (selected.length >= 2) {
      setNudge('Only 2! Choose wisely. 👀')
      window.setTimeout(() => setNudge(null), 1600)
    } else setSelected([...selected, opt])
  }

  const next = () => {
    sound.pop()
    setSelected([])
    if (qi === QUIZ.length - 1) {
      setPhase('results')
      return
    }
    setQi((i) => i + 1)
    setPhase('question')
  }

  const replay = () => {
    sound.pop()
    setQi(0)
    setSelected([])
    setResults([])
    setXp(0)
    setPhase('intro')
  }

  // Number / letter keys pick answers while a question is showing.
  useEffect(() => {
    if (phase !== 'question') return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const n = Number(e.key)
      const byLetter = KEYS.indexOf(e.key.toUpperCase())
      const idx = n >= 1 && n <= q.options.length ? n - 1 : byLetter >= 0 && byLetter < q.options.length ? byLetter : -1
      if (idx < 0) return
      const el = card.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      choose(q.options[idx])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const mood: KidMood = phase === 'feedback' ? (result?.correct === false ? 'shocked' : result?.correct ? 'happy' : 'laugh') : phase === 'results' ? 'love' : 'smile'
  const feedback =
    phase === 'feedback' && result
      ? q.kind === 'fact'
        ? result.correct
          ? q.correct!
          : q.wrong!
        : { ...q.reactions![result.picked[0]], line: undefined as string | undefined }
      : null

  return (
    <Section id="quiz" className="relative overflow-hidden bg-[linear-gradient(180deg,#f1ebff_0%,#fff6f9_100%)] px-4 py-24 sm:py-32">
      <div aria-hidden className="grid-paper absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <p className="eyebrow text-lilac-500">Mini game</p>
          <h2 className="display mt-3 text-[clamp(2.4rem,6.5vw,4.6rem)] text-ink">
            Friendship <em className="text-lilac-500">exam</em>
          </h2>
          <p className="mt-3 text-ink-soft">No pressure. (There is a little pressure.)</p>
        </header>

        <motion.div
          ref={card}
          animate={shake}
          className="relative min-h-[600px] overflow-hidden rounded-[32px] border-[3px] border-ink bg-white shadow-[8px_8px_0_#2b1d2f] sm:min-h-[560px]"
        >
          {/* HUD */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink bg-lilac-100 px-5 py-3 sm:px-7">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-black tracking-[0.2em] text-white">LEVEL 1</span>
            <div className="flex items-center gap-1 text-lg" aria-label={`Progress: ${results.filter(Boolean).length} of ${QUIZ.length} answered`}>
              {QUIZ.map((qq, i) => {
                const r = results[i]
                const icon = !r ? '🤍' : r.correct === false ? '💔' : '❤️'
                return (
                  <motion.span key={qq.id} animate={r ? { scale: [1, 1.5, 1] } : undefined} transition={{ duration: 0.4 }} aria-hidden>
                    {icon}
                  </motion.span>
                )
              })}
            </div>
            <div className="relative flex items-center gap-2">
              <span className="text-[0.65rem] font-black tracking-[0.15em] text-ink">XP</span>
              <span className="block h-3 w-24 overflow-hidden rounded-full border-2 border-ink bg-white sm:w-32">
                <motion.span
                  className="block h-full origin-left bg-[repeating-linear-gradient(90deg,#9a7ee6_0_8px,#c8b6f6_8px_10px)]"
                  animate={{ scaleX: xp / MAX_XP }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </span>
              <span className="w-9 font-mono text-xs font-bold tabular-nums">{Math.round((xp / MAX_XP) * 100)}%</span>
              <AnimatePresence>
                {xpPop !== null && (
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: -18 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="absolute -top-2 right-0 font-mono text-sm font-black text-lilac-500"
                  >
                    +{xpPop} XP
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative p-5 sm:p-8">
            <AnimatePresence mode="wait">
              {phase === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45 }}
                  className="flex min-h-[460px] flex-col items-center justify-center text-center"
                >
                  <KidHead who="yash" mood="side" look={0.8} className="w-24" title="Yash, suspicious" />
                  <p className="mt-4 text-xs font-black tracking-[0.3em] text-lilac-500">LEVEL 1</p>
                  <h3 className="display mt-2 text-[clamp(2rem,6vw,3.4rem)] leading-tight text-ink">Do you actually know Yash?</h3>
                  <p className="hand mt-3 text-3xl text-ink-mute">Let’s find out.</p>
                  <p className="mt-2 text-sm text-ink-mute">{QUIZ.length} questions · {FACT_COUNT} facts · a few opinions · zero mercy</p>
                  <MagneticButton onClick={start} className="btn-primary mt-8 text-lg">
                    ▶ Start level
                  </MagneticButton>
                </motion.div>
              )}

              {(phase === 'question' || phase === 'feedback') && (
                <motion.div
                  key={`q-${qi}`}
                  initial={{ opacity: 0, x: 80, rotate: 3 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -80, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-sm font-bold text-ink-mute">
                      Question {qi + 1} / {QUIZ.length}
                    </p>
                    <span className={cn('rounded-full px-3 py-1 text-[0.65rem] font-black tracking-[0.15em]', q.kind === 'fact' ? 'bg-blush-100 text-blush-700' : 'bg-cloud-100 text-cloud-600')}>
                      {q.kind === 'fact' ? 'FACT CHECK' : 'OPINION ROUND'}
                    </span>
                  </div>
                  <h3 className="display mt-4 text-[clamp(1.7rem,4.6vw,2.6rem)] leading-tight text-ink">{q.question}</h3>
                  {q.hint && <p className="hand mt-2 text-2xl text-lilac-500">{q.hint}</p>}

                  <div className={cn('mt-6 grid gap-3', q.options.length > 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-2')} role={multi ? 'group' : undefined}>
                    {q.options.map((opt, i) => {
                      const picked = selected.includes(opt)
                      const isAnswer = q.answer?.includes(opt)
                      const reveal = phase === 'feedback'
                      const state = !reveal
                        ? picked
                          ? 'picked'
                          : 'idle'
                        : q.kind === 'opinion'
                          ? picked
                            ? 'chosen'
                            : 'dim'
                          : isAnswer
                            ? 'right'
                            : picked
                              ? 'wrong'
                              : 'dim'
                      return (
                        <motion.button
                          key={opt}
                          ref={(el) => {
                            optionRefs.current[opt] = el
                          }}
                          type="button"
                          role={multi ? 'checkbox' : undefined}
                          aria-checked={multi ? picked : undefined}
                          disabled={reveal}
                          onClick={() => choose(opt)}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: state === 'dim' ? 0.45 : 1, y: 0, scale: state === 'right' || state === 'chosen' ? [1, 1.05, 1] : 1 }}
                          transition={{ delay: reveal ? 0 : 0.08 * i, duration: 0.35 }}
                          whileHover={!reveal ? { y: -3 } : undefined}
                          whileTap={!reveal ? { scale: 0.97 } : undefined}
                          className={cn(
                            'group flex items-center gap-3 rounded-2xl border-[2.5px] px-4 py-3.5 text-left text-lg font-semibold transition-colors',
                            state === 'idle' && 'border-ink/15 bg-white hover:border-lilac-300 hover:bg-lilac-100/50',
                            state === 'picked' && 'border-lilac-500 bg-lilac-100',
                            state === 'right' && 'border-mint bg-[#e5f7ef] text-ink',
                            state === 'chosen' && 'border-cloud-500 bg-cloud-100',
                            state === 'wrong' && 'border-alert bg-[#fdecec] text-ink',
                            state === 'dim' && 'border-ink/10 bg-white',
                          )}
                        >
                          <span
                            className={cn(
                              'grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 font-mono text-sm font-black',
                              state === 'right' ? 'border-mint bg-mint text-white' : state === 'wrong' ? 'border-alert bg-alert text-white' : picked ? 'border-lilac-500 bg-lilac-500 text-white' : 'border-ink/20 text-ink-soft',
                            )}
                          >
                            {state === 'right' ? '✓' : state === 'wrong' ? '✕' : multi && picked ? '✓' : KEYS[i]}
                          </span>
                          {opt}
                          {state === 'wrong' && <span className="hand ml-auto -rotate-6 text-xl text-alert">bruh.</span>}
                        </motion.button>
                      )
                    })}
                  </div>

                  {multi && phase === 'question' && (
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <button type="button" disabled={selected.length !== 2} onClick={() => lockIn(selected)} className="btn-primary disabled:opacity-40 disabled:saturate-50">
                        Lock in answer ({selected.length}/2)
                      </button>
                      <AnimatePresence>
                        {nudge && (
                          <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="hand text-2xl text-blush-600">
                            {nudge}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.15 }}
                        className={cn(
                          'mt-6 flex flex-col gap-4 rounded-2xl border-[2.5px] p-4 sm:flex-row sm:items-center sm:p-5',
                          result?.correct === false ? 'border-alert/40 bg-[#fff5f5]' : 'border-mint/40 bg-[#f0faf5]',
                        )}
                        role="status"
                      >
                        <motion.span
                          initial={{ scale: 0, rotate: -40 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.25 }}
                          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-4xl shadow-sm"
                          aria-hidden
                        >
                          {feedback.emoji}
                        </motion.span>
                        <div className="min-w-0 flex-1">
                          <p className={cn('text-xl font-extrabold sm:text-2xl', result?.correct === false ? 'text-alert' : 'text-ink')}>{feedback.title}</p>
                          {feedback.line && <p className="mt-1 text-ink-soft">{feedback.line}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <KidHead who="yash" mood={mood} className="hidden w-14 sm:block" />
                          <MagneticButton onClick={next} className="btn-primary whitespace-nowrap" autoFocus>
                            {qi === QUIZ.length - 1 ? 'See results' : 'Next →'}
                          </MagneticButton>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {phase === 'results' && <Results key="results" factsRight={factsRight} xp={xp} earned={badges} onReplay={replay} onContinue={() => scrollTo('#question', { offset: 0 })} />}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

function Results({ factsRight, xp, earned, onReplay, onContinue }: { factsRight: number; xp: number; earned: string[]; onReplay: () => void; onContinue: () => void }) {
  const rank = rankFor(factsRight)
  const quizBadges = BADGES.filter((b) => (b.id === 'crime' || b.id === 'pasta') && earned.includes(b.id))
  useEffect(() => {
    sound.celebrate()
    heartBurst({ x: 0.5, y: 0.45 }, 40)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className="flex min-h-[460px] flex-col items-center justify-center text-center"
    >
      <p className="text-xs font-black tracking-[0.3em] text-lilac-500">LEVEL COMPLETE</p>
      <div className="mt-4 flex gap-2 text-4xl" aria-label={`${factsRight} of ${FACT_COUNT} facts correct`}>
        {Array.from({ length: FACT_COUNT }).map((_, i) => (
          <motion.span key={i} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 400, damping: 14 }} aria-hidden>
            {i < factsRight ? '⭐' : '☆'}
          </motion.span>
        ))}
      </div>
      <p className="mt-4 font-mono text-sm text-ink-mute">
        {factsRight} / {FACT_COUNT} facts · {xp} XP
      </p>
      <h3 className="display mt-3 text-[clamp(2rem,5.5vw,3.2rem)] leading-tight text-ink">{rank.title}</h3>
      <p className="mt-1 text-xs font-black tracking-[0.25em] text-blush-500">{rank.tier.toUpperCase()} TIER</p>
      <p className="mt-3 max-w-md text-ink-soft">{rank.line}</p>
      {quizBadges.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {quizBadges.map((b) => (
            <span key={b.id} className="rounded-full bg-blush-50 px-3 py-1.5 text-sm font-semibold">
              {b.emoji} {b.title}
            </span>
          ))}
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onReplay} className="btn-ghost">
          ↺ Play again
        </button>
        <MagneticButton onClick={onContinue} className="btn-primary">
          One more question… ↓
        </MagneticButton>
      </div>
    </motion.div>
  )
}
