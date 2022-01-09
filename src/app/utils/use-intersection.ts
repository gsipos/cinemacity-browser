import { RefObject, useEffect, useLayoutEffect, useState } from 'react'

export const useIntersection = (ref: RefObject<HTMLElement>, options: IntersectionObserverInit): boolean => {
  const [intersecting, setIntersectionObserverEntry] = useState<boolean>(false)

  useLayoutEffect(() => {
    if (ref.current && typeof IntersectionObserver === 'function') {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setIntersectionObserverEntry(entries[0]?.isIntersecting ?? true)
      }

      const observer = new IntersectionObserver(handler, options)
      observer.observe(ref.current)

      return () => {
        setIntersectionObserverEntry(true)
        observer.disconnect()
      }
    }
    return () => {}
  }, [ref.current, options.threshold, options.root, options.rootMargin])

  return intersecting
}
