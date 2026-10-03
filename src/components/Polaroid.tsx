import { useRef, type CSSProperties } from 'react'
import type { Photo } from '../data/photos'
import { useTilt } from '../hooks/useTilt'
import { cn } from '../lib/utils'
import { PhotoImg } from './PhotoImg'

interface PolaroidProps {
  photo: Photo
  caption?: string
  rotate?: number
  tape?: 'top' | 'corners' | 'none'
  tapeColor?: string
  className?: string
  photoClassName?: string
  style?: CSSProperties
  sizes?: string
  tilt?: boolean
  onOpen?: (photo: Photo) => void
}

export function Polaroid({
  photo,
  caption,
  rotate = 0,
  tape = 'top',
  tapeColor,
  className,
  photoClassName = 'aspect-[4/5]',
  style,
  sizes,
  tilt = true,
  onOpen,
}: PolaroidProps) {
  const ref = useRef<HTMLDivElement>(null)
  useTilt(ref, tilt)
  const Tag = onOpen ? 'button' : 'div'

  return (
    <div className={cn('relative', className)} style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      <div ref={ref} className="relative will-change-transform">
        {tape === 'top' && (
          <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" style={tapeColor ? { ['--tape' as string]: tapeColor } : undefined} />
        )}
        {tape === 'corners' && (
          <>
            <span className="tape -top-2 -left-6 w-16 -rotate-[38deg]" style={tapeColor ? { ['--tape' as string]: tapeColor } : undefined} />
            <span className="tape -right-6 -bottom-1 w-16 -rotate-[38deg]" style={tapeColor ? { ['--tape' as string]: tapeColor } : undefined} />
          </>
        )}
        <Tag
          type={onOpen ? 'button' : undefined}
          onClick={onOpen ? () => onOpen(photo) : undefined}
          data-cursor={onOpen ? 'photo' : undefined}
          data-cursor-label={onOpen ? 'view memory' : undefined}
          aria-label={onOpen ? `Open photo: ${caption ?? photo.caption}` : undefined}
          className="polaroid block w-full text-left"
        >
          <PhotoImg photo={photo} className={photoClassName} sizes={sizes} />
          {caption !== '' && (
            <span className="hand absolute right-3 bottom-2.5 left-3 truncate text-center text-[1.15rem] text-ink-soft sm:text-xl">
              {caption ?? photo.caption}
            </span>
          )}
        </Tag>
      </div>
    </div>
  )
}
