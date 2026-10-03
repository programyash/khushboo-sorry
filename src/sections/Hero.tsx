import { useEffect, useRef, useState } from 'react'
import { Ambient } from '../components/Ambient'
import { CloudIcon } from '../components/Doodle'
import { MagneticButton } from '../components/MagneticButton'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { heartBurst, originOf } from '../lib/celebrate'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'
import { isFinePointer } from '../lib/utils'

/**
 * Opening scene. Handwritten lines write themselves, then the big "I'm sorry."
 * Scroll is locked until "Okay… show me." — which plays a camera-zoom +
 * scrapbook-page wipe into the story.
 */
export function Hero() {
  const { start, started, reduced, scrollTo } = useExperience()
  const root = useRef<HTMLElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const leaving = useRef(false)
  const [ctaShown, setCtaShown] = useState(false)

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const lines = q('.hero-line')
      if (reduced) {
        gsap.set([...lines, ...q('.hero-cta'), ...q('.hero-big')], { autoAlpha: 1, clipPath: 'none' })
        setCtaShown(true)
        return
      }
      const big = SplitText.create(q('.hero-big-text'), { type: 'chars' })
      gsap.set(q('.hero-cta'), { autoAlpha: 0, y: 24 })
      gsap.set(lines, { clipPath: 'inset(-30% 100% -30% 0)' })

      gsap.set(q('.l3-underline path'), { drawSVG: '0%' })
      const write = { clipPath: 'inset(-30% 0% -30% 0)', ease: 'power1.inOut' }
      const tl = gsap.timeline({ delay: 0.7 })
      tl.to(q('.l1'), { ...write, duration: 1.7 })
        .to({}, { duration: 0.5 })
        .to(q('.l2'), { ...write, duration: 1.2 })
        .to({}, { duration: 1.1 }) // the dramatic pause
        .to(q('.l3'), { ...write, duration: 1.1 })
        .to(q('.l3-underline path'), { drawSVG: '100%', duration: 0.6, ease: 'power2.out' }, '-=0.15')
        .set(q('.hero-big'), { autoAlpha: 1 }, '+=0.45')
        .add(() => sound.pop())
        .from(big.chars, { yPercent: 60, autoAlpha: 0, rotate: 14, filter: 'blur(6px)', duration: 1, ease: 'back.out(1.8)', stagger: 0.06 })
        .from(q('.sorry-heart'), { scale: 0, rotate: -40, duration: 1.1, ease: 'elastic.out(1, 0.4)' }, '-=0.35')
        .to(q('.hero-cta'), { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', onStart: () => setCtaShown(true) }, '-=0.6')
      intro.current = tl

      // Gentle "camera" drift following the pointer.
      if (isFinePointer()) {
        const xs = q('[data-depth]').map((el) => ({
          x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
          d: Number((el as HTMLElement).dataset.depth),
        }))
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          xs.forEach((o) => {
            o.x(-nx * o.d)
            o.y(-ny * o.d)
          })
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => {
          window.removeEventListener('pointermove', onMove)
          big.revert()
        }
      }
      return () => big.revert()
    },
    { scope: root, dependencies: [reduced] },
  )

  // Little hearts trail the cursor while on the opening screen.
  useEffect(() => {
    const el = root.current
    if (!el || reduced || !isFinePointer() || started) return
    let last = 0
    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now - last < 70) return
      last = now
      const h = document.createElement('span')
      h.textContent = '♥'
      h.setAttribute('aria-hidden', 'true')
      h.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:90;color:${Math.random() > 0.5 ? '#ff8fb0' : '#f2678f'};font-size:${10 + Math.random() * 10}px;transform:translate(-50%,-50%)`
      document.body.appendChild(h)
      gsap.to(h, {
        y: -30 - Math.random() * 30,
        x: (Math.random() - 0.5) * 30,
        opacity: 0,
        rotate: (Math.random() - 0.5) * 60,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => h.remove(),
      })
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [reduced, started])

  const skipIntro = () => {
    if (intro.current && intro.current.progress() < 1) intro.current.timeScale(6)
  }

  const go = contextSafe(() => {
    if (leaving.current) return
    leaving.current = true
    sound.whoosh()
    heartBurst(originOf(btn.current), 34)
    if (reduced) {
      start()
      requestAnimationFrame(() => scrollTo('#tenYears', { immediate: true }))
      return
    }
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ onComplete: () => (leaving.current = false) })
    tl.set(q('.page-wipe'), { visibility: 'visible' }, 0)
      .to(q('.hero-content'), { scale: 1.22, autoAlpha: 0, filter: 'blur(10px)', duration: 1.1, ease: 'power3.in' }, 0.1)
      .to(q('.hero-bg'), { scale: 1.35, duration: 1.4, ease: 'power2.in' }, 0)
      .fromTo(
        q('.page-sheet'),
        { yPercent: 110, rotate: (i: number) => [-5, 4, -2][i] },
        { yPercent: 0, rotate: 0, duration: 0.85, ease: 'power3.inOut', stagger: 0.12 },
        0.35,
      )
      .add(() => sound.page(), 0.5)
      .call(() => start())
      .call(() => scrollTo('#tenYears', { immediate: true }), undefined, '+=0.06')
      .to(q('.page-sheet'), { yPercent: -112, rotate: (i: number) => [3, -4, 2][i], duration: 1, ease: 'power3.inOut', stagger: 0.1 }, '+=0.2')
      .set(q('.page-wipe'), { visibility: 'hidden' })
      .set(q('.hero-content'), { scale: 1, autoAlpha: 1, filter: 'none' })
      .set(q('.hero-bg'), { scale: 1 })
  })

  return (
    <Section id="opening" sectionRef={root} className="h-[100svh] min-h-[560px] overflow-hidden">
      {/* background */}
      <div className="hero-bg absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#fff_0%,#ffe8ef_45%,#ffd3e0_100%)]" />
        <div data-depth="18" className="absolute inset-0">
          <Ambient count={18} kinds={['sparkle', 'dot']} seed={3} colors={['#ffffff', '#ff8fb0', '#9dd0f6']} maxSize={16} />
        </div>
        <div data-depth="30" className="absolute inset-0">
          <Ambient count={9} kinds={['heart']} seed={11} colors={['#ffb3c9', '#ff8fb0']} maxSize={22} />
        </div>
        <div data-depth="44" className="ambient absolute inset-x-[-10%] bottom-[-6%] h-[38%]">
          <CloudIcon className="absolute bottom-0 left-[2%] w-[38%] min-w-[220px] opacity-95" />
          <CloudIcon className="absolute bottom-[8%] left-[30%] w-[30%] min-w-[180px] opacity-80" />
          <CloudIcon className="absolute right-[0%] bottom-[-4%] w-[42%] min-w-[240px] opacity-95" />
          <CloudIcon className="absolute right-[26%] bottom-[14%] w-[22%] min-w-[140px] opacity-70" />
        </div>
        <div className="ambient absolute top-[12%] left-0 w-full">
          <CloudIcon className="w-28 opacity-70" />
        </div>
        <div className="loop absolute top-[16%] left-0 w-40 opacity-70" style={{ animation: 'drift 70s linear -20s infinite' }}>
          <CloudIcon className="w-full" />
        </div>
        <div className="loop absolute top-[30%] left-0 w-24 opacity-60" style={{ animation: 'drift 90s linear -60s infinite' }}>
          <CloudIcon className="w-full" />
        </div>
      </div>

      {/* content */}
      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-5 text-center" onPointerDown={skipIntro}>
        <div data-depth="-10" className="flex flex-col items-center">
          <p className="hero-line l1 hand text-[clamp(1.9rem,5.2vw,3.2rem)] text-ink">Khushboo… I made something.</p>
          <p className="hero-line l2 hand mt-2 text-[clamp(1.6rem,4.2vw,2.6rem)] text-ink-soft">And before you ask…</p>
          <p className="hero-line l3 hand relative mt-2 text-[clamp(1.6rem,4.2vw,2.6rem)] text-ink-soft">
            Yes. It’s about <span className="relative inline-block text-blush-600">that
              <svg viewBox="0 0 100 14" className="l3-underline absolute -bottom-1.5 left-0 w-full" aria-hidden>
                <path d="M3 9 C 25 3, 55 13, 97 5" stroke="#f2678f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            .
          </p>

          <h1 className="hero-big invisible relative mt-6 sm:mt-8">
            <span className="hero-big-text display block text-[clamp(4.2rem,15vw,11rem)] text-ink italic">I’m sorry.</span>
            <span className="sorry-heart absolute -top-2 -right-6 inline-block sm:-top-1 sm:-right-10" aria-hidden>
              <span className="block animate-beat text-[clamp(2rem,5vw,3.6rem)] text-blush-500">♥</span>
            </span>
          </h1>
        </div>

        <div className="hero-cta mt-10 flex flex-col items-center gap-4 sm:mt-12">
          <MagneticButton
            ref={btn}
            onClick={go}
            disabled={!ctaShown}
            data-cursor="heart"
            className="btn-primary group text-lg"
            onPointerEnter={() => sound.tick()}
          >
            <span>Okay… show me.</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/25 transition-transform duration-500 group-hover:rotate-[360deg]" aria-hidden>
              ♥
            </span>
          </MagneticButton>
          <p className="text-xs text-ink-mute">psst — sound is off. top right, if you want it. no pressure.</p>
        </div>
      </div>

      {/* scrapbook page wipe (used on exit) */}
      <div aria-hidden className="page-wipe pointer-events-none invisible fixed inset-0 z-[110]">
        <div className="page-sheet absolute inset-[-10%] bg-blush-200" />
        <div className="page-sheet absolute inset-[-10%] bg-cloud-200" />
        <div className="page-sheet ruled absolute inset-[-10%]" />
      </div>
    </Section>
  )
}
