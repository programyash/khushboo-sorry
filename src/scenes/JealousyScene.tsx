import type { KidMood } from './Kid'
import { Kid } from './Kid'
import { Bubble } from './parts'

/**
 * Stage for the jealousy bit. Khushboo chats with a random person; Yash
 * creeps out from behind a pillar. Animated by the Chaos section.
 */
export function JealousyScene({ yMood, className }: { yMood: KidMood; className?: string }) {
  return (
    <svg viewBox="0 0 800 460" className={className} role="img" aria-label="Illustration: Khushboo laughing with someone else while Yash slowly peeks out from behind a pillar with an extremely jealous face">
      <defs>
        <linearGradient id="jl-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf1f6" />
          <stop offset="1" stopColor="#f6e6ef" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#jl-wall)" />
      <rect y="380" width="800" height="80" fill="#efdccb" />
      {[160, 330, 500, 670].map((x) => (
        <rect key={x} x={x} y="70" width="90" height="120" rx="8" fill="#fff" opacity=".7" />
      ))}

      {/* the conversation */}
      <g transform="translate(330 184)">
        <Kid who="khushboo" mood="laugh" arms="down" />
      </g>
      <g transform="translate(560 184)">
        <Kid who="stranger" mood="happy" arms="down" flip />
      </g>
      <g className="jl-chat">
        <Bubble x={290} y={96} w={130} h={48} text="hahaha" size={26} tail="down-right" />
        <Bubble x={540} y={96} w={140} h={48} text="omg same" size={26} tail="down-left" />
      </g>
      <text x="630" y="176" textAnchor="middle" fontFamily="Plus Jakarta Sans Variable, sans-serif" fontSize="13" fontWeight="700" fill="#8b7a8f" letterSpacing="2">
        RANDOM PERSON
      </text>

      {/* Yash, creeping */}
      <g className="jl-yash" transform="translate(60 184)">
        <Kid who="yash" mood={yMood} look={1} arms={yMood === 'forced' ? 'hips' : 'down'} />
      </g>
      {/* the pillar he hides behind */}
      <g className="jl-pillar">
        <rect x="0" y="40" width="150" height="350" fill="#e7d3e3" />
        <rect x="0" y="40" width="150" height="20" fill="#dcc3d7" />
        <rect x="0" y="372" width="150" height="20" fill="#dcc3d7" />
        <path d="M30 70 V360 M70 70 V360 M110 70 V360" stroke="#dcc3d7" strokeWidth="6" />
      </g>

      <g className="jl-eyes" opacity="0">
        <text x="150" y="168" fontSize="40" textAnchor="middle">
          👀
        </text>
      </g>
      <g className="jl-fine" opacity="0">
        <Bubble x={60} y={96} w={230} h={54} text="I’m completely fine." size={27} tail="down-right" />
      </g>
    </svg>
  )
}
