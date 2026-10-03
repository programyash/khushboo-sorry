import { useRef } from 'react'
import { Doodle } from '../components/Doodle'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { useInView } from '../hooks/useInView'
import { gsap, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'
import { ClassroomScene } from '../scenes/ClassroomScene'
import { RecessScene } from '../scenes/RecessScene'

/** Opening an old school diary: ruled paper, stickies, stamps and two memories. */
export function SchoolDiary() {
  const { reduced, notify, pastaRevealed, unlock } = useExperience()
  const root = useRef<HTMLElement>(null)
  const bell = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap.from(q('.sd-cover'), { y: 80, rotate: -3, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: q('.sd-cover')[0], start: 'top 85%' } })
      q('.sd-frame').forEach((f, i) => {
        gsap.fromTo(
          f,
          { clipPath: 'inset(100% 0% 0% 0% round 28px)', rotate: i % 2 ? 4 : -4, y: 60 },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', rotate: i % 2 ? 1 : -1, y: 0, duration: 1.3, ease: 'power3.inOut', scrollTrigger: { trigger: f, start: 'top 80%' } },
        )
      })
      q('.sd-sticky').forEach((s, i) => {
        gsap.from(s, { y: -80, rotate: i % 2 ? 25 : -25, autoAlpha: 0, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: s, start: 'top 88%' } })
      })
      q('.sd-copy').forEach((c) => {
        gsap.from(c.children, { y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 80%' } })
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  const ring = () => {
    sound.chime()
    notify('🔔', 'Nobody asked for this memory.', 'School bell')
    if (bell.current && !reduced) gsap.fromTo(bell.current, { rotate: -25 }, { rotate: 0, duration: 1.2, ease: 'elastic.out(1.4, 0.2)' })
  }

  const food = () => {
    if (pastaRevealed) {
      notify('🍝', 'Pasta detected.', 'Food scanner')
      unlock('pasta')
    } else notify('🥡', 'Food detected. Type: CLASSIFIED.', 'Ask again after Level 1')
  }

  return (
    <Section id="school" sectionRef={root} className="ruled relative overflow-hidden px-4 py-24 sm:py-32">
      {/* diary cover label */}
      <div className="relative mx-auto max-w-6xl">
        <div className="sd-cover relative mx-auto w-fit max-w-full rotate-[-1.5deg] rounded-2xl border-2 border-ink/80 bg-white px-6 py-5 shadow-[6px_6px_0_#2b1d2f] sm:px-10">
          <p className="eyebrow text-blush-600">Property of</p>
          <h2 className="display mt-1 text-[clamp(2.4rem,6vw,4.4rem)] text-ink">The School Diary</h2>
          <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1 font-mono text-sm text-ink-soft sm:grid-cols-3">
            <div>
              <dt className="inline text-ink-mute">Name: </dt>
              <dd className="inline">Yash &amp; Khushboo</dd>
            </div>
            <div>
              <dt className="inline text-ink-mute">Class: </dt>
              <dd className="inline">Chaos (Section A)</dd>
            </div>
            <div>
              <dt className="inline text-ink-mute">Roll no.: </dt>
              <dd className="inline">inseparable</dd>
            </div>
          </dl>
          <span aria-hidden className="absolute -top-5 -right-5 grid h-16 w-16 rotate-12 place-items-center rounded-full border-[3px] border-dashed border-cloud-500 bg-cloud-50 text-center text-[0.55rem] leading-tight font-extrabold text-cloud-600">
            SCHOOL
            <br />
            DAYS
            <br />★
          </span>
        </div>

        <button
          ref={bell}
          type="button"
          onClick={ring}
          aria-label="Ring the school bell"
          className="sticker absolute top-2 right-2 origin-top text-4xl sm:top-6 sm:right-10 sm:text-5xl"
        >
          🔔
        </button>

        {/* memory 1 */}
        <div className="mt-20 grid items-center gap-10 lg:mt-28 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <figure className="sd-frame relative overflow-hidden rounded-[28px] border-[6px] border-white bg-white shadow-[0_40px_80px_-40px_rgba(43,29,47,.45)]">
            <ClassroomScene className="block h-auto w-full" />
          </figure>
          <div className="sd-copy relative">
            <p className="eyebrow text-cloud-600">Memory #1</p>
            <h3 className="display mt-2 text-4xl text-ink sm:text-5xl">Sitting in class together</h3>
            <p className="display mt-5 text-2xl leading-snug text-ink-soft italic sm:text-[1.75rem]">
              “Apparently sitting beside each other for hours still wasn’t enough.”
            </p>
            <div className="sd-sticky relative mt-8 w-fit max-w-xs rotate-2 bg-[#fff3a8] p-5 shadow-[0_14px_24px_-12px_rgba(0,0,0,.3)]">
              <span className="tape -top-3 left-1/2 w-16 -translate-x-1/2 -rotate-3" style={{ ['--tape' as string]: 'rgba(157,208,246,.75)' }} />
              <p className="hand text-2xl leading-tight text-ink">
                Teacher’s remark:
                <br />
                Talks too much in class.
                <br />
                <span className="text-blush-600">(Both of them.)</span>
              </p>
            </div>
          </div>
        </div>

        {/* memory 2 */}
        <div className="mt-24 grid items-center gap-10 lg:mt-36 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div className="sd-copy relative order-2 lg:order-1">
            <p className="eyebrow text-blush-600">Memory #2</p>
            <h3 className="display mt-2 text-4xl text-ink sm:text-5xl">Recess</h3>
            <p className="display mt-5 text-2xl leading-snug text-ink-soft italic sm:text-[1.75rem]">
              “Friendship was 20% emotional support and 80% stealing food.”
            </p>
            <FoodChart />
            <button type="button" onClick={food} aria-label="A sticker of a tiffin box" className="sticker mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink">
              <span className="text-2xl" aria-hidden>
                {pastaRevealed ? '🍝' : '🥡'}
              </span>
              what was in the tiffin?
            </button>
          </div>
          <figure className="sd-frame relative order-1 overflow-hidden rounded-[28px] border-[6px] border-white bg-white shadow-[0_40px_80px_-40px_rgba(43,29,47,.45)] lg:order-2">
            <RecessScene className="block h-auto w-full" />
          </figure>
        </div>

        <Doodle name="star" className="absolute top-[38%] -left-2 hidden w-10 text-cloud-400 lg:block" />
        <Doodle name="squiggle" className="absolute right-0 bottom-4 w-28 text-blush-300" />
      </div>
    </Section>
  )
}

function FoodChart() {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="mt-8 flex items-center gap-6">
      <svg viewBox="0 0 42 42" className="h-28 w-28 shrink-0 -rotate-90" role="img" aria-label="Pie chart: 20% emotional support, 80% stealing food">
        <circle cx="21" cy="21" r="15.915" fill="#fff" />
        <circle
          cx="21"
          cy="21"
          r="15.915"
          fill="none"
          stroke="#9dd0f6"
          strokeWidth="8"
          strokeDasharray={inView ? '20 80' : '0 100'}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)' }}
        />
        <circle
          cx="21"
          cy="21"
          r="15.915"
          fill="none"
          stroke="#ff8fb0"
          strokeWidth="8"
          strokeDasharray={inView ? '80 20' : '0 100'}
          strokeDashoffset="-20"
          style={{ transition: 'stroke-dasharray 1.6s cubic-bezier(.22,1,.36,1) .4s' }}
        />
      </svg>
      <ul className="space-y-2 text-sm font-semibold text-ink-soft">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-cloud-300" /> 20% emotional support
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blush-400" /> 80% stealing food
        </li>
        <li className="hand text-xl font-normal text-ink-mute">source: trust me</li>
      </ul>
    </div>
  )
}
