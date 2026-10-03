import { useRef, useState } from 'react'
import { useExperience } from '../context/Experience'
import { Kid, type KidMood } from './Kid'
import { Bubble, useSceneLoop } from './parts'

type Pose = { k: KidMood; y: KidMood; kLook: number; yLook: number }
const CALM: Pose = { k: 'smile', y: 'calm', kLook: 0, yLook: 0 }

/**
 * Memory: sitting together in class. A note gets passed, both crack up,
 * the teacher yells, and two very innocent angels appear.
 */
export function ClassroomScene({ className }: { className?: string }) {
  const { reduced } = useExperience()
  const ref = useRef<SVGSVGElement>(null)
  const [pose, setPose] = useState<Pose>(reduced ? { k: 'laugh', y: 'laugh', kLook: 0, yLook: 0 } : CALM)

  useSceneLoop(
    ref,
    (tl, q) => {
      tl.set(q('.cl-note'), { x: 0, y: 0, rotate: 0, autoAlpha: 0 })
        .set([q('.cl-note-open'), q('.cl-silence'), q('.cl-halo')], { autoAlpha: 0 })
        .call(() => setPose(CALM))
        .call(() => setPose({ k: 'smile', y: 'calm', kLook: 1, yLook: 0 }), undefined, 1)
        .to(q('.cl-note'), { autoAlpha: 1, duration: 0.2 }, 1.4)
        .to(q('.cl-note'), { x: 150, rotate: 14, duration: 1, ease: 'power2.inOut' }, 1.6)
        .call(() => setPose({ k: 'side', y: 'shocked', kLook: 1, yLook: -1 }), undefined, 2.7)
        .to(q('.cl-note'), { autoAlpha: 0, duration: 0.2 }, 3)
        .fromTo(q('.cl-note-open'), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.5)' }, 3)
        .call(() => setPose({ k: 'laugh', y: 'laugh', kLook: 0, yLook: 0 }), undefined, 4)
        .to(q('.cl-kids'), { y: -4, duration: 0.09, yoyo: true, repeat: 13, ease: 'sine.inOut' }, 4)
        .to(q('.cl-note-open'), { autoAlpha: 0, duration: 0.3 }, 5.2)
        .fromTo(q('.cl-silence'), { scale: 0.3, autoAlpha: 0, rotate: -10 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.45, ease: 'back.out(3)' }, 5.5)
        .to(q('.cl-board'), { x: 4, duration: 0.05, yoyo: true, repeat: 7 }, 5.5)
        .call(() => setPose({ k: 'shocked', y: 'shocked', kLook: 0, yLook: 0 }), undefined, 5.6)
        .call(() => setPose({ k: 'innocent', y: 'innocent', kLook: 0, yLook: 0 }), undefined, 6.4)
        .to(q('.cl-halo'), { autoAlpha: 1, y: -6, duration: 0.6, ease: 'back.out(2)' }, 6.4)
        .to(q('.cl-silence'), { autoAlpha: 0, duration: 0.3 }, 7.2)
        .to(q('.cl-halo'), { autoAlpha: 0, duration: 0.4 }, 8.8)
        .to({}, { duration: 0.4 })
    },
    !reduced,
  )

  return (
    <svg ref={ref} viewBox="0 0 800 520" className={className} role="img" aria-label="Illustration: Yash and Khushboo sitting at the same desk in class, passing a note, laughing, and pretending to be innocent when the teacher shouts">
      <defs>
        <clipPath id="cl-window">
          <rect x="44" y="64" width="122" height="142" rx="6" />
        </clipPath>
      </defs>
      {/* room */}
      <rect width="800" height="520" fill="#eaf5fd" />
      <rect y="392" width="800" height="128" fill="#f6e7da" />
      <rect y="388" width="800" height="8" fill="#e3cdb8" />

      {/* window with drifting clouds */}
      <rect x="36" y="56" width="138" height="158" rx="10" fill="#fff" />
      <g clipPath="url(#cl-window)">
        <rect x="44" y="64" width="122" height="142" fill="#bfe3fb" />
        <g className="loop" style={{ animation: 'float 6s ease-in-out infinite' }}>
          <path d="M60 120 c -12 0 -12 -16 0 -16 c 0 -14 20 -16 24 -4 c 6 -12 28 -8 26 6 c 14 -2 14 14 0 14 Z" fill="#fff" />
          <path d="M110 170 c -10 0 -10 -12 0 -12 c 0 -10 16 -12 20 -2 c 4 -10 22 -6 20 4 c 10 0 10 10 0 10 Z" fill="#fff" opacity=".85" />
        </g>
      </g>
      <path d="M105 64 V206 M44 135 H166" stroke="#fff" strokeWidth="6" />

      {/* chalkboard */}
      <g className="cl-board">
        <rect x="216" y="44" width="392" height="200" rx="12" fill="#c79a6b" />
        <rect x="228" y="56" width="368" height="176" rx="6" fill="#2f4a43" />
        <g fill="#fff" fontFamily="Caveat Variable, cursive" opacity=".9">
          <text x="252" y="104" fontSize="40" fontWeight="700">Friendship 101</text>
          <text x="256" y="146" fontSize="24">• do not talk in class</text>
          <text x="256" y="178" fontSize="24">• do not pass notes</text>
          <text x="256" y="210" fontSize="24" opacity=".7">• (they did both)</text>
        </g>
        <path d="M540 196 c -8 -12 -26 -4 -16 10 l 16 16 l 16 -16 c 10 -14 -8 -22 -16 -10 Z" fill="none" stroke="#ffb3c9" strokeWidth="3" />
        <rect x="470" y="232" width="40" height="8" rx="2" fill="#fff" />
      </g>

      {/* clock */}
      <g transform="translate(694 112)">
        <circle r="44" fill="#fff" stroke="#c79a6b" strokeWidth="6" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x="-1.5" y="-38" width="3" height="7" fill="#c4b5c8" transform={`rotate(${i * 30})`} />
        ))}
        <rect className="loop" x="-2" y="-30" width="4" height="32" rx="2" fill="#2b1d2f" style={{ animation: 'spin 10s linear infinite', transformOrigin: '0 0' }} />
        <rect className="loop" x="-2.5" y="-20" width="5" height="22" rx="2" fill="#f2678f" style={{ animation: 'spin 120s linear infinite', transformOrigin: '0 0' }} />
        <circle r="4" fill="#2b1d2f" />
      </g>

      {/* kids */}
      <g className="cl-kids">
        <g transform="translate(232 196) scale(1.08)">
          <Kid who="khushboo" mood={pose.k} look={pose.kLook} arms="none" legs="none" />
        </g>
        <g transform="translate(420 196) scale(1.08)">
          <Kid who="yash" mood={pose.y} look={pose.yLook} arms="none" legs="none" blinkDelay={1.3} />
        </g>
      </g>
      <g className="cl-halo" opacity="0">
        <ellipse cx="308" cy="200" rx="34" ry="9" fill="none" stroke="#ffd36e" strokeWidth="6" />
        <ellipse cx="496" cy="200" rx="34" ry="9" fill="none" stroke="#ffd36e" strokeWidth="6" />
      </g>

      {/* desk */}
      <rect x="150" y="330" width="500" height="22" rx="6" fill="#d9a77a" />
      <rect x="166" y="352" width="468" height="84" rx="4" fill="#c99266" />
      <rect x="182" y="436" width="16" height="70" fill="#a8754c" />
      <rect x="602" y="436" width="16" height="70" fill="#a8754c" />
      <g>
        <rect x="186" y="304" width="70" height="12" rx="2" fill="#9dd0f6" />
        <rect x="190" y="292" width="62" height="12" rx="2" fill="#ffb3c9" />
        <rect x="184" y="316" width="76" height="14" rx="2" fill="#c8b6f6" />
      </g>
      <path d="M470 330 L548 330 L560 318 L482 318 Z" fill="#fff" stroke="#e1d5fc" strokeWidth="2" />
      <rect x="560" y="312" width="54" height="7" rx="3" fill="#f3b24f" transform="rotate(-8 560 312)" />

      {/* the note */}
      <g className="cl-note" opacity="0">
        <rect x="336" y="310" width="34" height="22" rx="3" fill="#fff" stroke="#f2678f" strokeWidth="2" />
        <path d="M336 312 L353 324 L370 312" fill="none" stroke="#f2678f" strokeWidth="2" />
      </g>
      <g className="cl-note-open" opacity="0" style={{ transformOrigin: '520px 280px', transformBox: 'view-box' }}>
        <Bubble x={466} y={248} w={190} h={50} text="this class is SO boring 😩" size={22} tail="down-left" />
      </g>

      {/* teacher, off-screen */}
      <g className="cl-silence" opacity="0" style={{ transformOrigin: '700px 300px', transformBox: 'view-box' }}>
        <Bubble x={620} y={262} w={164} h={56} text="SILENCE!!" size={34} tail="left" fill="#fff4f4" color="#e5484d" />
      </g>
    </svg>
  )
}
