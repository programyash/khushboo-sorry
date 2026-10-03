import { useRef, useState } from 'react'
import { MagneticButton } from '../components/MagneticButton'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { confettiShower, sideCannons } from '../lib/celebrate'
import { gsap, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'

const CHARGES = [
  'Unnecessary arguments',
  'Overthinking (professional level)',
  'Jealousy (see: Exhibit “the jealousy arc”)',
  'Dramatic reactions',
  'Replying “fine”',
  'Saying “nothing”',
  'Both knowing something was wrong anyway',
]

/** THE PEOPLE VS. YASH & KHUSHBOO — a very serious court case. */
export function Court() {
  const { reduced, unlock } = useExperience()
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'idle' | 'deliberating' | 'verdict'>('idle')

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap.from(q('.ct-head > *'), { y: 40, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: q('.ct-head')[0], start: 'top 80%' } })
      gsap.from(q('.ct-bench'), { y: 80, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: q('.ct-bench')[0], start: 'top 85%' } })
      q('.ct-charge').forEach((row) => {
        const stamp = row.querySelector('.ct-stamp')
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 82%' } })
        tl.from(row, { x: -40, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }).from(
          stamp,
          { scale: 2.6, rotate: -40, autoAlpha: 0, duration: 0.45, ease: 'back.out(2)', onStart: () => sound.stamp() },
          '+=0.05',
        )
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  const deliver = () => {
    if (phase !== 'idle') return
    sound.click()
    if (reduced) {
      setPhase('verdict')
      unlock('idiot')
    } else setPhase('deliberating')
  }

  // Deliberation → gavel → verdict (runs once the deliberation markup exists).
  useGSAP(
    () => {
      if (phase !== 'deliberating') return
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline()
      tl.fromTo(q('.ct-review'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .to(q('.ct-review-text'), { duration: 1.8, scrambleText: { text: 'After reviewing 10 years of evidence…', chars: 'lowerCase', speed: 0.5 } })
        .fromTo(q('.ct-dots span'), { autoAlpha: 0.15 }, { autoAlpha: 1, stagger: 0.35, duration: 0.2, repeat: 1, yoyo: true })
        .to(q('.ct-gavel-head'), { rotate: -35, duration: 0.35, ease: 'power2.out' }, '+=0.2')
        .to(q('.ct-gavel-head'), { rotate: 12, duration: 0.12, ease: 'power4.in' })
        .add(() => {
          sound.gavel()
          setPhase('verdict')
          unlock('idiot')
        })
        .to(q('.ct-shake'), { x: 8, duration: 0.05, yoyo: true, repeat: 7, ease: 'none' })
        .set(q('.ct-shake'), { x: 0 })
        .to(q('.ct-gavel-head'), { rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    },
    { scope: root, dependencies: [phase] },
  )

  // Verdict animations run once the verdict markup is on screen.
  useGSAP(
    () => {
      if (phase !== 'verdict') return
      const q = gsap.utils.selector(root)
      if (reduced) return
      const tl = gsap.timeline()
      tl.from(q('.ct-guilty'), { scale: 2.6, rotate: -14, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.6)' })
        .add(() => {
          confettiShower({ x: 0.5, y: 0.5 })
          sideCannons(1200)
        }, 0.25)
        .from(q('.ct-sentence > *'), { y: 30, autoAlpha: 0, stagger: 0.35, duration: 0.7, ease: 'back.out(2)' }, '+=0.5')
    },
    { scope: root, dependencies: [phase, reduced] },
  )

  return (
    <Section id="court" sectionRef={root} className="relative overflow-hidden bg-paper-2 px-4 pt-24 pb-44 sm:pt-32 sm:pb-52">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-[repeating-linear-gradient(90deg,#d6b38f_0_38px,#cfa982_38px_40px)] opacity-60" />
      <div className="ct-shake relative mx-auto max-w-5xl">
        <header className="ct-head text-center">
          <p className="font-mono text-xs tracking-[0.25em] text-ink-mute uppercase">The Friendship Court · Case No. 10-YRS-∞</p>
          <h2 className="display mt-4 text-[clamp(2.4rem,7vw,5.4rem)] leading-[0.95] text-ink">
            The People <span className="text-blush-500 italic">vs.</span>
            <br />
            Yash &amp; Khushboo
          </h2>
          <p className="mt-4 text-ink-soft">All rise. (You can stay seated. It’s a website.)</p>
        </header>

        {/* judge's bench */}
        <div className="ct-bench relative mx-auto mt-14 max-w-xl">
          <svg viewBox="0 0 520 200" className="h-auto w-full" role="img" aria-label="The judge’s bench, with a gavel and a nameplate that reads: Judge — this website">
            <rect x="20" y="70" width="480" height="130" rx="10" fill="#b5835a" />
            <rect x="20" y="70" width="480" height="18" rx="6" fill="#9c6c45" />
            {[60, 160, 260, 360].map((x) => (
              <rect key={x} x={x} y="100" width="80" height="80" rx="6" fill="none" stroke="#9c6c45" strokeWidth="4" />
            ))}
            <rect x="170" y="40" width="180" height="40" rx="6" fill="#2b1d2f" />
            <text x="260" y="66" textAnchor="middle" fill="#ffd36e" fontFamily="Plus Jakarta Sans Variable, sans-serif" fontWeight="800" fontSize="15" letterSpacing="2">
              JUDGE: THIS WEBSITE
            </text>
            {/* scales */}
            <g transform="translate(70 18)" stroke="#d9a74a" strokeWidth="3" fill="none">
              <path d="M30 0 V50 M10 50 H50 M0 14 H60" />
              <path d="M0 14 L-8 32 H8 Z M60 14 L52 32 H68 Z" fill="#ffd36e" />
            </g>
            {/* gavel */}
            <g transform="translate(420 58)">
              <rect x="-26" y="2" width="52" height="10" rx="4" fill="#7a5134" />
              <g className="ct-gavel-head" style={{ transformBox: 'view-box', transformOrigin: '420px 58px' }}>
                <rect x="-4" y="-50" width="8" height="52" rx="3" fill="#9c6c45" transform="rotate(-50)" />
                <rect x="-22" y="-62" width="44" height="22" rx="6" fill="#6e4529" transform="rotate(-50)" />
              </g>
            </g>
          </svg>
        </div>

        {/* charges */}
        <div className="relative mx-auto mt-10 max-w-3xl rounded-[22px] border border-ink/10 bg-white p-6 shadow-[0_30px_60px_-36px_rgba(43,29,47,.45)] sm:p-10">
          <p className="text-xs font-extrabold tracking-[0.25em] text-ink-mute">CHARGES FILED</p>
          <ol className="mt-5 divide-y divide-dashed divide-ink/15">
            {CHARGES.map((c, i) => (
              <li key={c} className="ct-charge flex items-center justify-between gap-4 py-3.5">
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-ink-mute">COUNT {i + 1}</span>
                  <span className="text-[1.05rem] font-semibold text-ink sm:text-lg">{c}</span>
                </span>
                <span className="ct-stamp shrink-0 -rotate-6 rounded-md border-[2.5px] border-alert px-2 py-0.5 text-[0.65rem] font-black tracking-widest text-alert sm:text-xs">
                  CHARGED
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* verdict */}
        <div className="mt-14 flex min-h-[320px] flex-col items-center justify-start text-center" aria-live="polite">
          {phase === 'idle' && (
            <MagneticButton onClick={deliver} className="btn-primary text-lg">
              <span aria-hidden>🔨</span> Your Honour, the verdict please.
            </MagneticButton>
          )}

          {phase !== 'idle' && (
            <div className="ct-review" style={reduced ? undefined : { opacity: 0 }}>
              <p className="display text-2xl text-ink-soft italic sm:text-3xl">
                <span className="ct-review-text">{reduced ? 'After reviewing 10 years of evidence…' : ''}</span>
              </p>
              <p className="ct-dots mt-2 text-3xl tracking-[0.4em] text-ink-mute" aria-hidden>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </p>
            </div>
          )}

          {phase === 'verdict' && (
            <div className="mt-6">
              <p className="ct-guilty inline-block -rotate-3 rounded-2xl border-[5px] border-alert px-5 py-3 text-[clamp(2rem,7vw,4.6rem)] leading-none font-black tracking-tight text-alert">
                GUILTY OF BEING IDIOTS.
              </p>
              <div className="ct-sentence mt-8 space-y-2">
                <p className="display text-3xl text-ink sm:text-4xl">
                  Sentence: <em className="text-blush-500">remain best friends.</em>
                </p>
                <p className="hand text-2xl text-ink-mute">For life. No parole. No appeals.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
