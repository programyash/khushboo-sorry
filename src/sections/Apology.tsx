import { useRef } from 'react'
import { Doodle } from '../components/Doodle'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { gsap, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'

const SORRY_LINES = [
  'I’m sorry for the moments when my words hurt you.',
  'I’m sorry for the fights that became bigger than they needed to be.',
  'I’m sorry for the times I didn’t understand what you were feeling.',
  'And I’m sorry for the stupid things I did, said, or failed to say.',
]

/**
 * The letter. A pinned envelope opens with the scroll (seal pops, flap
 * swings, letter slides out, camera pushes into the paper), then the letter
 * writes itself line by line.
 */
export function Apology() {
  const { reduced } = useExperience()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)

      // 1. The envelope floats in as the section arrives…
      const stage = q('.env-stage')[0]
      gsap.from(q('.env'), { y: 140, rotate: -8, autoAlpha: 0, duration: 1.4, ease: 'back.out(1.4)', scrollTrigger: { trigger: stage, start: 'top 70%' } })
      gsap.from(q('.env-title > *'), { y: 30, autoAlpha: 0, stagger: 0.15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: stage, start: 'top 70%' } })

      // …then opens with the scroll.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: stage, pin: true, start: 'top top', end: '+=170%', scrub: 0.9 },
      })
      tl.to(q('.env-seal'), { scale: 1.5, rotate: 40, autoAlpha: 0, duration: 0.6, ease: 'back.in(2)', onStart: () => sound.pop() }, 0.3)
        .to(q('.env-title'), { autoAlpha: 0, y: -50, duration: 0.6, ease: 'power2.in' }, 0.7)
        .to(q('.env-flap'), { rotateX: 180, duration: 1, ease: 'power2.inOut' }, 0.8)
        .set(q('.env-flap'), { zIndex: 1 }, 1.3)
        .to(q('.env'), { y: '12vh', duration: 1.6, ease: 'power1.inOut' }, 0.8)
        .to(q('.env-letter'), { yPercent: -58, duration: 1.2, ease: 'power2.out' }, 1.8)
        .to(q('.env-part'), { y: '60vh', autoAlpha: 0, duration: 1.1, ease: 'power2.in' }, 3.1)
        .to(q('.env-letter'), { scale: 2.6, y: '6vh', autoAlpha: 0, duration: 1.2, ease: 'power2.in' }, 3.3)
        .to(q('.env-glow'), { autoAlpha: 1, scale: 1.6, duration: 1 }, 3.4)

      // 2. The letter writes itself, one line at a time.
      q('.write-line').forEach((line) => {
        gsap.fromTo(
          line,
          { clipPath: 'inset(-20% 100% -20% 0)', autoAlpha: 1 },
          {
            clipPath: 'inset(-20% 0% -20% 0)',
            duration: Math.min(2.2, 0.6 + (line.textContent?.length ?? 20) / 45),
            ease: 'power1.inOut',
            scrollTrigger: { trigger: line, start: 'top 82%', toggleActions: 'play none none none' },
          },
        )
      })
      q('.sorry-bullet').forEach((b) =>
        gsap.from(b, { scale: 0, rotate: -30, duration: 0.8, ease: 'back.out(3)', scrollTrigger: { trigger: b, start: 'top 82%' } }),
      )
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="apology" sectionRef={root} className="bg-cloud-50">
      {/* ── the envelope ── */}
      <div className="env-stage relative flex h-[100svh] min-h-[600px] flex-col items-center justify-center overflow-hidden px-5">
        <div aria-hidden className="dots-bg absolute inset-0 opacity-60" />
        <div aria-hidden className="env-glow invisible absolute top-1/2 left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />

        <div className="env-title relative z-10 mb-10 text-center">
          <p className="eyebrow text-cloud-600">Chapter one-ish</p>
          <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.2rem)] text-ink">
            I wrote you a <em className="text-blush-500">letter</em>.
          </h2>
          <p className="hand mt-2 text-2xl text-ink-mute">(an actual one. sort of. keep scrolling to open it.)</p>
        </div>

        <div className="env relative z-10 w-[min(520px,86vw)]">
          <div className="env-body relative aspect-[1.55] w-full" style={{ perspective: '1100px' }}>
            {/* back */}
            <div className="env-part absolute inset-0 rounded-[14px] bg-[#f6b9cb] shadow-[0_30px_60px_-30px_rgba(178,54,97,.6)]" />
            {/* letter peeking out */}
            <div className="env-letter paper absolute inset-x-[7%] top-[7%] z-[2] h-[92%] rounded-md p-[6%] shadow-md">
              <p className="hand text-[clamp(1.4rem,4vw,2rem)] text-ink">Dear Khushboo,</p>
              <div className="mt-3 space-y-3" aria-hidden>
                {[92, 80, 86, 60].map((w, i) => (
                  <div key={i} className="h-2 rounded-full bg-cloud-100" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
            {/* front pocket */}
            <svg viewBox="0 0 155 100" preserveAspectRatio="none" className="env-part absolute inset-0 z-[3] h-full w-full drop-shadow-[0_-2px_4px_rgba(178,54,97,.12)]" aria-hidden>
              <path d="M0 4 L72 56 Q77.5 60 83 56 L155 4 L155 92 Q155 100 147 100 L8 100 Q0 100 0 92 Z" fill="#ffd3e0" />
              <path d="M0 100 L66 50 Q77.5 42 89 50 L155 100 Z" fill="#ffc4d5" />
              <path d="M0 4 L72 56 M155 4 L83 56" stroke="#f6b9cb" strokeWidth="0.8" fill="none" />
            </svg>
            {/* flap */}
            <div className="env-flap env-part absolute inset-x-0 top-0 z-[4] h-[62%] origin-top" style={{ transformStyle: 'preserve-3d' }}>
              <svg viewBox="0 0 155 62" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
                <path d="M0 0 L155 0 L155 4 L83 58 Q77.5 62 72 58 L0 4 Z" fill="#ffb3c9" />
              </svg>
            </div>
            {/* wax seal */}
            <div className="env-seal absolute top-[50%] left-1/2 z-[5] grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff8fb0,#d94a75_70%)] text-xl text-white shadow-[0_4px_10px_rgba(178,54,97,.5),inset_0_-3px_6px_rgba(0,0,0,.15)] sm:h-16 sm:w-16">
              ♥
            </div>
          </div>
        </div>
      </div>

      {/* ── the letter ── */}
      <div className="relative px-5 pb-28 sm:pb-36">
        <article className="paper relative mx-auto max-w-2xl rounded-[28px] px-6 py-12 shadow-[0_40px_80px_-40px_rgba(74,159,223,.45)] sm:px-14 sm:py-16">
          <span className="tape -top-3 left-10 -rotate-6" style={{ ['--tape' as string]: 'rgba(157,208,246,.8)' }} />
          <span className="tape -top-3 right-10 rotate-6" />
          <Doodle name="sparkle" className="absolute -top-6 -right-4 w-12 text-cloud-400" />
          <Doodle name="heart" className="absolute top-1/3 -left-5 w-10 text-blush-400" delay={0.3} />
          <Doodle name="swirl" className="absolute right-6 bottom-10 w-16 text-lilac-300" delay={0.5} />

          <p className="write-line hand text-4xl text-ink sm:text-5xl">Dear Khushboo,</p>

          <div className="mt-8 space-y-6 text-[1.18rem] leading-relaxed text-ink-soft sm:text-[1.3rem]">
            <p className="write-line">
              I’m not going to write a dramatic 17-page apology and pretend I’m suddenly the most mature person alive.
            </p>
            <p className="write-line relative inline-block text-ink">
              But I do want to say this{' '}
              <span className="relative inline-block font-semibold">
                properly.
                <Doodle name="underline" className="absolute -bottom-2 left-0 w-full text-blush-400" delay={0.8} />
              </span>
            </p>
          </div>

          <div className="my-10 flex items-center gap-3 text-blush-300" aria-hidden>
            <span className="h-px flex-1 bg-current" />
            <span className="text-lg">♥</span>
            <span className="h-px flex-1 bg-current" />
          </div>

          <ul className="space-y-6">
            {SORRY_LINES.map((line) => (
              <li key={line} className="flex items-start gap-4">
                <span className="sorry-bullet mt-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blush-100 text-sm text-blush-500" aria-hidden>
                  ♥
                </span>
                <p className="write-line display text-[1.45rem] leading-snug text-ink italic sm:text-[1.75rem]">{line}</p>
              </li>
            ))}
          </ul>

          <p className="write-line hand mt-12 text-right text-3xl text-ink-mute">…but there’s one thing I’m not sorry about.</p>
        </article>
      </div>
    </Section>
  )
}
