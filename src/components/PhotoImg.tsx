import { useState, type CSSProperties } from 'react'
import type { Photo } from '../data/photos'
import { cn } from '../lib/utils'

interface PhotoImgProps {
  photo: Photo
  className?: string
  imgClassName?: string
  sizes?: string
  eager?: boolean
  /** Use only the small file (thumbnails, the final heart). */
  thumb?: boolean
  fit?: 'cover' | 'contain'
  style?: CSSProperties
}

/**
 * Responsive, lazy, never-distorted photo. Shows the photo's average colour
 * while loading and a friendly fallback if the file is missing.
 */
export function PhotoImg({ photo, className, imgClassName, sizes = '(max-width: 768px) 70vw, 420px', eager, thumb, fit = 'cover', style }: PhotoImgProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <span className={cn('relative block overflow-hidden', className)} style={{ backgroundColor: photo.color, ...style }}>
      {failed ? (
        <span className="hand absolute inset-0 flex items-center justify-center p-3 text-center text-lg text-white/90">
          this photo ran away 🙈
        </span>
      ) : (
        <img
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0) setLoaded(true)
          }}
          src={thumb ? photo.srcSm : photo.src}
          srcSet={thumb ? undefined : `${photo.srcSm} 320w, ${photo.src} ${photo.w}w`}
          sizes={thumb ? undefined : sizes}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-700',
            fit === 'cover' ? 'object-cover' : 'object-contain',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
          style={{ objectPosition: photo.focus ?? '50% 30%' }}
        />
      )}
    </span>
  )
}
