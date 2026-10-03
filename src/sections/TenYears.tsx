import { useRef } from 'react'
import { PhotoImg } from '../components/PhotoImg'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { photos } from '../data/photos'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { KidHead } from '../scenes/Kid'

const NUMBERS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const LABELS = NUMBERS.map((n) => (n === 10 ? 'Year 10 · now' : n === 1 ? 'Year 1 · the beginning' : `Year ${n}`))
const FLIP = photos(['river-mountains', 'snow-lake', 'rooftop-flowers', 'birthday-white', 'lehenga-twirl', 'cafe-cocoa', 'red-dress', 'night-stripes', 'wall-lean'])
const ROT = [-4, 3, -2, 5, -5, 2, -3, 4, -1]

/**
 * "10 years." — a scroll-scrubbed rewind. The odometer rolls 10 → 1 while the
 * photo flipbook flies away, then it snaps back to play: 10 YEARS.
 */
export function TenYears() {
  const { reduced } = useExperience()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      const l1 = SplitText.create(q('.ty-line1'), { type: 'words' })
      const l2 = SplitText.create(q('.ty-line2'), { type: 'words' })

      gsap.set(q('.ty-final'), { autoAlpha: 0 })
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, pin: true, start: 'top top', end: '+=280%', scrub: 0.8 },
      })

      tl.from(q('.ty-intro'), { autoAlpha: 0, y: 30, duration: 0.5, ease: 'power2.out' }, 0)
      // Rewind: 9 steps.
      for (let i = 0; i < 9; i++) {
        const at = 0.4 + i * 0.7
        tl.to(q('.ty-strip'), { yPercent: -(i + 1) * 10, duration: 0.45, ease: 'power2.inOut' }, at)
        tl.to(q('.ty-labels'), { yPercent: -(i + 1) * 10, duration: 0.45, ease: 'power2.inOut' }, at)
        tl.to(q(`.ty-card[data-i="${i}"]`), { xPercent: i % 2 ? 140 : -140, yPercent: -30, rotate: i % 2 ? 28 : -28, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, at)
      }
      // Play.
      tl.to(q('.ty-rewind'), { autoAlpha: 0, duration: 0.2 }, 6.6)
        .to(q('.ty-play'), { autoAlpha: 1, duration: 0.2 }, 6.6)
        .to(q('.ty-count'), { scale: 0.6, autoAlpha: 0, filter: 'blur(10px)', duration: 0.6, ease: 'power2.in' }, 6.7)
        .to(q('.ty-stack'), { scale: 0.7, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 6.7)
        .to(q('.ty-intro'), { autoAlpha: 0, y: -20, duration: 0.4 }, 6.7)
        .set(q('.ty-final'), { autoAlpha: 1 }, 7.2)
        .from(q('.ty-ten'), { scale: 0.3, rotate: -8, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)' }, 7.2)
        .from(q('.ty-years span'), { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: 'back.out(2)' }, 7.5)
        .from(q('.ty-burst'), { scale: 0, rotate: -90, autoAlpha: 0, duration: 0.8, ease: 'back.out(2)' }, 7.4)
        .from(l1.words, { autoAlpha: 0, y: 24, filter: 'blur(6px)', stagger: 0.06, duration: 0.6, ease: 'power2.out' }, 8.2)
        .from(l2.words, { autoAlpha: 0, y: 40, rotate: () => gsap.utils.random(-14, 14), scale: 0.6, stagger: 0.08, duration: 0.6, ease: 'back.out(2.5)' }, 9.3)
        .to({}, { duration: 0.6 })

      return () => {
        l1.revert()
        l2.revert()
      }
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="tenYears" sectionRef={root} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[linear-gradient(180deg,#fff6f9_0%,#ffffff_55%,#f3f9ff_100%)]">
      {/* VHS-ish rewind overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.045] [background:repeating-linear-gradient(0deg,#2b1d2f_0_1px,transparent_1px_4px)]" />
      <div aria-hidden className="absolute top-20 left-4 font-mono text-sm font-bold tracking-widest text-ink/70 sm:top-24 sm:left-8">
        {!reduced && (
          <span className="ty-rewind loop inline-flex items-center gap-2" style={{ animation: 'rec 1.2s steps(2, jump-none) infinite' }}>
            ◀◀ REWINDING
          </span>
        )}
        <span className={`ty-play absolute top-0 left-0 inline-flex items-center gap-2 whitespace-nowrap text-blush-600 ${reduced ? '' : 'invisible'}`}>▶ PLAY</span>
      </div>

      {reduced ? (
        <ReducedTenYears />
      ) : (
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-6 px-5 md:flex-row md:gap-16">
          {/* photo flipbook */}
          <div className="ty-stack relative order-1 h-[210px] w-[170px] shrink-0 md:order-2 md:h-[400px] md:w-[320px]">
            <div className="ty-card absolute inset-0 z-0 rotate-2 rounded-sm bg-white p-3 shadow-xl">
              <div className="flex h-full flex-col items-center justify-center rounded-sm border-2 border-dashed border-blush-200 bg-blush-50 p-3 text-center">
                <div className="flex -space-x-3">
                  <KidHead who="khushboo" mood="happy" className="h-14 w-14 md:h-20 md:w-20" />
                  <KidHead who="yash" mood="laugh" className="h-14 w-14 md:h-20 md:w-20" />
                </div>
                <p className="hand mt-2 text-lg leading-tight text-ink-soft md:text-2xl">two kids. no photos.</p>
                <p className="hand text-sm text-ink-mute md:text-lg">(thank god.)</p>
              </div>
            </div>
            {[...FLIP].reverse().map((p, ri) => {
              const i = FLIP.length - 1 - ri
              return (
                <div key={p.id} data-i={i} className="ty-card polaroid absolute inset-0 !p-2.5 !pb-9 md:!p-3 md:!pb-12" style={{ rotate: `${ROT[i]}deg`, zIndex: 10 + FLIP.length - i }}>
                  <PhotoImg photo={p} className="h-full w-full" sizes="(max-width: 768px) 170px, 320px" eager={i < 2} />
                </div>
              )
            })}
          </div>

          {/* odometer */}
          <div className="ty-count order-2 flex flex-col items-center md:order-1 md:items-start">
            <p className="ty-intro eyebrow mb-2 text-blush-600">Let’s rewind a little</p>
            <div className="display relative h-[1em] overflow-hidden text-[clamp(8rem,30vw,19rem)] leading-none text-ink italic" aria-label="Counting down from ten years to year one">
              <div className="ty-strip">
                {NUMBERS.map((n) => (
                  <div key={n} className="flex h-[1em] items-center justify-center md:justify-start" aria-hidden>
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-3 h-8 overflow-hidden" aria-hidden>
              <div className="ty-labels">
                {LABELS.map((l) => (
                  <div key={l} className="hand flex h-8 items-center justify-center text-2xl text-ink-soft md:justify-start">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* the reveal */}
      {!reduced && (
        <div className="ty-final invisible absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <svg aria-hidden viewBox="0 0 200 200" className="ty-burst absolute h-[78vmin] w-[78vmin] text-blush-100">
            <g className="loop origin-center" style={{ animation: 'spin 60s linear infinite', transformBox: 'fill-box' }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <path key={i} d="M100 100 L104 6 L96 6 Z" fill="currentColor" transform={`rotate(${i * 22.5} 100 100)`} />
            ))}
            </g>
          </svg>
          <h2 className="relative flex flex-col items-center leading-none">
            <span className="ty-ten display text-[clamp(7rem,26vw,16rem)] text-blush-500 italic">10</span>
            <span className="ty-years -mt-2 flex overflow-hidden text-[clamp(1.4rem,4vw,2.6rem)] font-extrabold tracking-[0.4em] text-ink">
              {'YEARS'.split('').map((c, i) => (
                <span key={i} className="inline-block">
                  {c}
                </span>
              ))}
            </span>
          </h2>
          <p className="ty-line1 relative mt-8 max-w-xl text-xl leading-snug text-ink-soft sm:text-2xl">
            That’s a lot of memories for two people who were supposed to behave normally.
          </p>
          <p className="ty-line2 hand relative mt-4 text-4xl text-blush-600 sm:text-5xl">We clearly failed at that.</p>
        </div>
      )}
    </Section>
  )
}

function ReducedTenYears() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
      <h2 className="flex flex-col items-center leading-none">
        <span className="display text-[clamp(7rem,26vw,16rem)] text-blush-500 italic">10</span>
        <span className="-mt-2 text-[clamp(1.4rem,4vw,2.6rem)] font-extrabold tracking-[0.4em] text-ink">YEARS</span>
      </h2>
      <p className="mt-8 max-w-xl text-xl leading-snug text-ink-soft sm:text-2xl">
        That’s a lot of memories for two people who were supposed to behave normally.
      </p>
      <p className="hand mt-4 text-4xl text-blush-600 sm:text-5xl">We clearly failed at that.</p>
    </div>
  )
}
