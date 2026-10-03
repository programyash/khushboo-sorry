import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { HeartIcon } from '../components/Doodle'
import { PhotoImg } from '../components/PhotoImg'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { PHOTOS } from '../data/photos'
import { heartBurst, originOf } from '../lib/celebrate'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'
import { heartPoint, seeded } from '../lib/utils'
import { Kid } from '../scenes/Kid'

const COUNT = 30

/**
 * Every photo from the site gathers into a heart, beats once, dissolves into
 * light — and leaves the last two lines and one tiny button.
 */
export function Finale() {
  const { reduced, scrollTo } = useExperience()
  const root = useRef<HTMLElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const [done, setDone] = useState(false)

  const tiles = useMemo(() => {
    const rnd = seeded(2026)
    return Array.from({ length: COUNT }, (_, i) => {
      const t = (i / COUNT) * Math.PI * 2
      const p = heartPoint(t)
      const a = rnd() * Math.PI * 2
      return {
        photo: PHOTOS[i % PHOTOS.length],
        hx: p.x,
        hy: p.y,
        sx: Math.cos(a) * (0.9 + rnd() * 0.5),
        sy: Math.sin(a) * (0.9 + rnd() * 0.5),
        sr: (rnd() - 0.5) * 80,
        hr: (rnd() - 0.5) * 16,
      }
    })
  }, [])

  useGSAP(
    () => {
      if (reduced || PHOTOS.length === 0) return
      const q = gsap.utils.selector(root)
      const tilesEl = q('.fn-tile')
      const radius = () => Math.min(window.innerWidth, window.innerHeight) * (window.innerWidth < 640 ? 0.4 : 0.34)
      const far = () => Math.max(window.innerWidth, window.innerHeight) * 0.75
      const l1 = SplitText.create(q('.fn-l1'), { type: 'words' })

      gsap.set(tilesEl, {
        x: (i: number) => tiles[i].sx * far(),
        y: (i: number) => tiles[i].sy * far(),
        rotate: (i: number) => tiles[i].sr,
        scale: 1.5,
        autoAlpha: 0,
      })
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, pin: true, start: 'top top', end: '+=340%', scrub: 1, invalidateOnRefresh: true },
      })
      tl.from(q('.fn-intro'), { autoAlpha: 0, y: 30, duration: 0.6 }, 0)
        .to(
          tilesEl,
          {
            x: (i: number) => tiles[i].hx * radius(),
            y: (i: number) => tiles[i].hy * radius() - radius() * 0.08,
            rotate: (i: number) => tiles[i].hr,
            scale: 1,
            autoAlpha: 1,
            duration: 2.2,
            ease: 'power3.out',
            stagger: { each: 0.04, from: 'random' },
          },
          0.2,
        )
        .to(q('.fn-intro'), { autoAlpha: 0, y: -20, duration: 0.5 }, 2.4)
        .to(q('.fn-cluster'), { scale: 1.09, duration: 0.35, ease: 'power2.out' }, 3.4)
        .to(q('.fn-cluster'), { scale: 1, duration: 0.35, ease: 'power2.in' }, 3.75)
        .to(q('.fn-cluster'), { scale: 1.06, duration: 0.3, ease: 'power2.out' }, 4.1)
        .to(q('.fn-cluster'), { scale: 1, duration: 0.35, ease: 'power2.in' }, 4.4)
        .to(tilesEl, { scale: 0.2, autoAlpha: 0, x: 0, y: 0, duration: 1.4, ease: 'power2.in', stagger: { each: 0.02, from: 'edges' } }, 5)
        .fromTo(q('.fn-heart'), { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'back.out(1.6)' }, 5.9)
        .to(q('.fn-heart'), { y: () => -window.innerHeight * 0.16, scale: 0.6, duration: 1, ease: 'power2.inOut' }, 7.3)
        .from(l1.words, { autoAlpha: 0, y: 30, filter: 'blur(10px)', stagger: 0.12, duration: 0.8, ease: 'power2.out' }, 7.6)
        .from(q('.fn-l2'), { autoAlpha: 0, y: 16, duration: 0.6 }, 9)
        .from(q('.fn-cta'), { autoAlpha: 0, y: 16, scale: 0.9, duration: 0.6, ease: 'back.out(2)' }, 9.5)
        .to({}, { duration: 0.6 })
      return () => l1.revert()
    },
    { scope: root, dependencies: [reduced] },
  )

  const finish = () => {
    if (done) return
    sound.celebrate()
    heartBurst(originOf(btn.current), 40)
    setDone(true)
  }

  return (
    <Section id="finale" sectionRef={root} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[radial-gradient(90%_80%_at_50%_45%,#fff6f9_0%,#ffe8ef_55%,#ffd3e0_100%)]">
      {/* the photo heart */}
      {!reduced && (
        <div aria-hidden className="fn-cluster pointer-events-none absolute top-1/2 left-1/2 h-0 w-0">
          {tiles.map((t, i) => (
            <div key={i} className="fn-tile invisible absolute -top-[30px] -left-[24px] w-[48px] rounded-[6px] bg-white p-[3px] shadow-[0_8px_18px_-8px_rgba(43,29,47,.45)] sm:-top-[42px] sm:-left-[34px] sm:w-[68px]">
              {t.photo && <PhotoImg photo={t.photo} thumb className="aspect-[4/5] rounded-[4px]" />}
            </div>
          ))}
        </div>
      )}

      <div className="fn-heart pointer-events-none invisible absolute top-1/2 left-1/2 -mt-[18vmin] -ml-[20vmin] h-[36vmin] w-[40vmin]" aria-hidden style={reduced ? { visibility: 'visible', transform: 'translateY(-16vh) scale(.6)' } : undefined}>
        <div className="absolute inset-[-30%] rounded-full bg-blush-300/50 blur-[60px]" />
        <HeartIcon className="relative h-full w-full animate-beat drop-shadow-[0_0_40px_rgba(242,103,143,.6)]" color="#f2678f" />
      </div>

      <p className="fn-intro hand absolute inset-x-0 top-[14%] text-center text-3xl text-ink-soft sm:text-4xl">every memory on this website…</p>

      <div className="absolute inset-x-0 top-[50%] flex flex-col items-center px-6 text-center">
        <h2 className="fn-l1 display text-[clamp(2.2rem,6.4vw,4.8rem)] leading-[1.05] text-ink">
          10 years down. <em className="text-blush-500">Hopefully, many more to go.</em>
        </h2>
        <p className="fn-l2 mt-5 text-base text-ink-mute sm:text-lg">Now please stop being mad at me.</p>
        <div className="fn-cta mt-8">
          {!done ? (
            <button ref={btn} type="button" onClick={finish} data-cursor="heart" className="rounded-full border border-blush-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-blush-50">
              Okay, I’m done embarrassing myself.
            </button>
          ) : (
            <p className="hand text-2xl text-blush-600">embarrassment complete ✓</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[radial-gradient(90%_80%_at_50%_45%,#fff6f9_0%,#ffe8ef_60%,#ffd3e0_100%)] px-6 text-center"
            role="status"
          >
            <motion.svg
              viewBox="0 0 140 210"
              className="w-24 sm:w-28"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 1.2 }}
              role="img"
              aria-label="Tiny Yash waving goodbye"
            >
              <Kid who="yash" mood="happy" arms="wave" />
            </motion.svg>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} className="display mt-4 text-[clamp(4rem,14vw,8rem)] leading-none text-ink italic">
              fin.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="hand mt-3 text-2xl text-ink-soft sm:text-3xl">
              (of this website. not of us.)
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }} className="mt-8 text-sm text-ink-mute">
              Made with way too much effort, for Khushboo. ❤️
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
              type="button"
              onClick={() => scrollTo(0, { duration: 3 })}
              className="btn-ghost mt-6 text-sm"
            >
              ↺ Watch it again from the start
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
