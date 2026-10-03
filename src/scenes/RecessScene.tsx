import { useRef, useState } from 'react'
import { useExperience } from '../context/Experience'
import { Kid, type KidMood } from './Kid'
import { Bubble, useSceneLoop } from './parts'

type Pose = { k: KidMood; y: KidMood; kLook: number; yLook: number }
const START: Pose = { k: 'smile', y: 'happy', kLook: 0.6, yLook: 0 }

/**
 * Memory: recess. A bird distracts Yash, a fork sneaks into his tiffin,
 * he turns back, Khushboo whistles innocently, and everyone laughs.
 * The food stays CLASSIFIED until the quiz reveals it.
 */
export function RecessScene({ className }: { className?: string }) {
  const { reduced, pastaRevealed } = useExperience()
  const ref = useRef<SVGSVGElement>(null)
  const [pose, setPose] = useState<Pose>(reduced ? { k: 'laugh', y: 'laugh', kLook: 0, yLook: 0 } : START)

  useSceneLoop(
    ref,
    (tl, q) => {
      tl.set([q('.rc-hey'), q('.rc-notes'), q('.rc-bite')], { autoAlpha: 0 })
        .set(q('.rc-bird'), { x: 0, y: 0 })
        .set(q('.rc-fork'), { x: 0, y: 0, rotate: 0 })
        .call(() => setPose(START))
        .to(q('.rc-bird'), { x: -620, y: 30, duration: 2.6, ease: 'none' }, 0.6)
        .call(() => setPose({ k: 'side', y: 'happy', kLook: 1, yLook: 1 }), undefined, 1)
        .to(q('.rc-fork'), { x: 62, y: 24, rotate: 28, duration: 0.7, ease: 'power2.inOut' }, 1.5)
        .to(q('.rc-bite'), { autoAlpha: 1, duration: 0.1 }, 2.2)
        .to(q('.rc-fork'), { x: 0, y: 0, rotate: 0, duration: 0.6, ease: 'power2.inOut' }, 2.35)
        .call(() => setPose({ k: 'innocent', y: 'shocked', kLook: 0, yLook: -1 }), undefined, 3.1)
        .fromTo(q('.rc-hey'), { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(3)' }, 3.2)
        .fromTo(q('.rc-notes'), { y: 10, autoAlpha: 0 }, { y: -10, autoAlpha: 1, duration: 0.6 }, 3.5)
        .to(q('.rc-hey'), { autoAlpha: 0, duration: 0.3 }, 4.6)
        .to(q('.rc-notes'), { autoAlpha: 0, duration: 0.3 }, 4.9)
        .call(() => setPose({ k: 'laugh', y: 'laugh', kLook: 0, yLook: 0 }), undefined, 5)
        .to(q('.rc-kids'), { y: -4, duration: 0.09, yoyo: true, repeat: 15, ease: 'sine.inOut' }, 5)
        .to(q('.rc-bite'), { autoAlpha: 0, duration: 0.2 }, 6.4)
        .to({}, { duration: 0.6 })
    },
    !reduced,
  )

  return (
    <svg ref={ref} viewBox="100 96 624 406" className={className} role="img" aria-label="Illustration: Yash and Khushboo on a school bench at recess; while Yash looks at a bird, Khushboo sneaks food from his tiffin with a fork">
      <defs>
        <linearGradient id="rc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4e3fb" />
          <stop offset="1" stopColor="#fff6f9" />
        </linearGradient>
        <linearGradient id="rc-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cdeccb" />
          <stop offset="1" stopColor="#b1dcab" />
        </linearGradient>
      </defs>
      <rect width="800" height="520" fill="url(#rc-sky)" />

      {/* sun */}
      <g transform="translate(690 86)">
        <g className="loop" style={{ animation: 'spin 30s linear infinite' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x="-3" y="-62" width="6" height="16" rx="3" fill="#ffd36e" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle r="36" fill="#ffc94a" />
      </g>

      {/* school building */}
      <g fill="#ecdff4">
        <rect x="430" y="200" width="300" height="160" rx="6" />
        <path d="M410 206 L580 140 L750 206 Z" />
        {Array.from({ length: 4 }).map((_, i) => (
          <rect key={i} x={456 + i * 66} y="236" width="36" height="36" rx="4" fill="#fff" opacity=".8" />
        ))}
        <rect x="560" y="300" width="40" height="60" rx="4" fill="#d9c6e6" />
        <path d="M580 140 V100" stroke="#c8b6f6" strokeWidth="4" />
        <path d="M580 100 L606 108 L580 116 Z" fill="#ff8fb0" />
      </g>

      {/* tree */}
      <rect x="86" y="200" width="26" height="170" rx="8" fill="#b98457" />
      <circle cx="100" cy="190" r="74" fill="#9fd89a" />
      <circle cx="56" cy="214" r="44" fill="#8fd08a" />
      <circle cx="148" cy="214" r="46" fill="#a9de9f" />

      {/* grass */}
      <rect y="356" width="800" height="164" fill="url(#rc-grass)" />
      {[60, 180, 300, 640, 720].map((x, i) => (
        <g key={x} transform={`translate(${x} ${430 + (i % 2) * 40})`}>
          <circle r="5" fill="#fff" />
          <circle r="2.5" fill="#ffd36e" />
        </g>
      ))}

      {/* bird */}
      <g className="rc-bird" transform="translate(820 120)">
        <path d="M0 0 q 12 -14 24 0 q 12 -14 24 0" stroke="#2b1d2f" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>

      {/* bench back */}
      <rect x="190" y="252" width="420" height="16" rx="5" fill="#d9a77a" />
      <rect x="190" y="280" width="420" height="16" rx="5" fill="#d9a77a" />

      {/* kids sitting */}
      <g className="rc-kids">
        <g transform="translate(232 162)">
          <Kid who="khushboo" mood={pose.k} look={pose.kLook} arms="down" legs="sit" />
        </g>
        <g transform="translate(428 162)">
          <Kid who="yash" mood={pose.y} look={pose.yLook} arms="down" legs="sit" blinkDelay={0.8} />
        </g>
      </g>

      {/* seat */}
      <rect x="180" y="318" width="440" height="18" rx="6" fill="#c99266" />
      <rect x="200" y="336" width="14" height="50" fill="#a8754c" />
      <rect x="586" y="336" width="14" height="50" fill="#a8754c" />

      {/* Yash's tiffin, on the bench between them */}
      <g transform="translate(398 290)">
        <rect x="-34" y="0" width="68" height="30" rx="8" fill="#cfd8e0" />
        <ellipse cx="0" cy="0" rx="34" ry="10" fill="#e9eef2" stroke="#b8c4ce" strokeWidth="2.5" />
        {pastaRevealed ? (
          <g stroke="#f3b24f" strokeWidth="4" fill="none" strokeLinecap="round">
            <path d="M-22 0 q 6 -6 12 0 t 12 0 t 12 0 t 12 0" />
            <path d="M-18 3 q 6 -5 12 0 t 12 0 t 12 0" />
          </g>
        ) : (
          <>
            <ellipse cx="0" cy="0" rx="27" ry="6.5" fill="#f7d38a" />
            <rect x="-30" y="-9" width="60" height="16" rx="3" fill="#2b1d2f" transform="rotate(-6)" />
            <text x="0" y="2" transform="rotate(-6)" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Plus Jakarta Sans Variable, sans-serif" letterSpacing="1.5">
              CLASSIFIED
            </text>
          </>
        )}
        <g stroke="#c4d6e6" strokeWidth="3" strokeLinecap="round" fill="none" className="loop" style={{ animation: 'float 2.6s ease-in-out infinite' }}>
          <path d="M-10 -14 c -6 -8 6 -12 0 -22" />
          <path d="M8 -14 c -6 -8 6 -12 0 -22" />
        </g>
      </g>

      {/* Khushboo's sneaky fork */}
      <g className="rc-fork" style={{ transformBox: 'fill-box', transformOrigin: '0% 100%' }}>
        <g transform="translate(330 270) rotate(-30)">
          <rect x="-3" y="0" width="6" height="40" rx="3" fill="#9aa8b4" />
          <path d="M-6 0 V-14 M-2 0 V-16 M2 0 V-16 M6 0 V-14" stroke="#9aa8b4" strokeWidth="2.6" strokeLinecap="round" />
          <circle className="rc-bite" cx="0" cy="-16" r="6" fill={pastaRevealed ? '#f3b24f' : '#f7d38a'} opacity="0" />
        </g>
      </g>

      {/* reactions */}
      <g className="rc-hey" opacity="0" style={{ transformOrigin: '560px 150px', transformBox: 'view-box' }}>
        <Bubble x={520} y={110} w={110} h={52} text="HEY!!" size={34} tail="down-left" fill="#fff4f4" color="#e5484d" />
      </g>
      <g className="rc-notes" opacity="0" fill="#9a7ee6" fontSize="30" fontFamily="Plus Jakarta Sans Variable, sans-serif">
        <text x="196" y="160">♪</text>
        <text x="222" y="136">♫</text>
      </g>
    </svg>
  )
}
