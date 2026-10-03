import { useRef } from 'react'
import { useExperience } from '../context/Experience'
import { KidBack } from './Kid'
import { useSceneLoop } from './parts'

const STARS = [
  [60, 50], [140, 120], [220, 40], [300, 90], [380, 30], [470, 110], [540, 50], [620, 130], [700, 60], [760, 140],
  [100, 190], [260, 170], [420, 180], [580, 200], [730, 220],
]

/** Two friends from behind, sitting on a terrace under the moon, just talking. */
export function TalkScene({ className }: { className?: string }) {
  const { reduced } = useExperience()
  const ref = useRef<SVGSVGElement>(null)

  useSceneLoop(
    ref,
    (tl, q) => {
      const thoughts = q('.ts-thought')
      thoughts.forEach((t, i) => {
        tl.fromTo(t, { y: 0, autoAlpha: 0, scale: 0.6 }, { y: -70, autoAlpha: 1, scale: 1, duration: 1.6, ease: 'sine.out' }, i * 1.3)
        tl.to(t, { y: -110, autoAlpha: 0, duration: 1, ease: 'sine.in' }, i * 1.3 + 1.6)
      })
      tl.fromTo(q('.ts-shoot'), { x: 0, y: 0, autoAlpha: 0 }, { x: -260, y: 120, autoAlpha: 1, duration: 0.9, ease: 'power1.in' }, 2.2)
      tl.to(q('.ts-shoot'), { autoAlpha: 0, duration: 0.3 }, 3)
    },
    !reduced,
  )

  return (
    <svg ref={ref} viewBox="0 0 800 420" className={className} role="img" aria-label="Illustration: Yash and Khushboo seen from behind, sitting side by side on a terrace at night under the moon, talking">
      <defs>
        <radialGradient id="ts-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="1" stopColor="#ffe9a8" />
        </radialGradient>
        <radialGradient id="ts-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff4c2" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff4c2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="420" fill="#251a35" />
      {STARS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 ? 1.6 : 2.4}
          fill="#fff"
          className="loop"
          style={{ animation: `twinkle ${2.4 + (i % 4) * 0.7}s ease-in-out ${i * 0.3}s infinite`, transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}
      <circle cx="640" cy="100" r="120" fill="url(#ts-glow)" />
      <circle cx="640" cy="100" r="46" fill="url(#ts-moon)" />
      <circle cx="626" cy="90" r="8" fill="#f6e2a0" opacity=".6" />
      <circle cx="654" cy="112" r="5" fill="#f6e2a0" opacity=".6" />

      <g className="ts-shoot" opacity="0">
        <path d="M560 40 L620 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".9" />
        <circle cx="560" cy="40" r="3" fill="#fff" />
      </g>

      {/* city silhouette */}
      <path d="M0 300 V250 H60 V220 H110 V260 H160 V200 H230 V270 H300 V235 H360 V280 H430 V210 H500 V260 H560 V230 H640 V275 H700 V240 H800 V300 Z" fill="#1a1226" />
      {[[80, 236], [190, 220], [470, 230], [600, 250], [720, 256]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="8" height="8" fill="#ffd36e" opacity=".55" />
      ))}

      {/* terrace ledge */}
      <rect y="330" width="800" height="90" fill="#3a2b4d" />
      <rect y="322" width="800" height="14" fill="#4a3862" />

      {/* the two of them */}
      <g transform="translate(270 178)">
        <KidBack who="khushboo" />
      </g>
      <g transform="translate(392 180)">
        <KidBack who="yash" />
      </g>

      {/* thoughts drifting up */}
      <g fontFamily="Caveat Variable, cursive" fontSize="30" fill="#fff" textAnchor="middle">
        <text className="ts-thought" x="350" y="170" opacity="0">…</text>
        <text className="ts-thought" x="440" y="168" opacity="0" fill="#ffb3c9">♡</text>
        <text className="ts-thought" x="380" y="172" opacity="0">“same.”</text>
        <text className="ts-thought" x="460" y="170" opacity="0" fill="#9dd0f6">☆</text>
      </g>
    </svg>
  )
}
