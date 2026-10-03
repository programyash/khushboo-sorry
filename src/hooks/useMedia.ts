import { useEffect, useState } from 'react'

export function useMedia(query: string, fallback = false) {
  const [match, setMatch] = useState(() =>
    typeof window === 'undefined' ? fallback : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const on = () => setMatch(mql.matches)
    on()
    mql.addEventListener('change', on)
    return () => mql.removeEventListener('change', on)
  }, [query])
  return match
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)')
export const useIsDesktop = () => useMedia('(min-width: 900px)')
