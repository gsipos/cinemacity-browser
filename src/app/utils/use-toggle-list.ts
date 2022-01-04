import { useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from './use-local-storage'

export interface ToggleList {
  list: string[]
  toggle: (item: string) => () => void
  has: (item: string) => boolean | null
  clear: () => void
}

export interface ToggleListGroup {
  [key: string]: ToggleList
}

export const useToggleList = (key: string, allowed: string[] = []) => {
  const [activeItems, setActiveItems] = useLocalStorage<string[]>(key, [])

  useEffect(() => {
    if (!allowed.length) {
      return
    }
    if (activeItems.some((i) => !allowed.includes(i))) {
      setActiveItems(activeItems.filter((i) => allowed.includes(i)))
    }
  }, [allowed])

  const activeSet = useMemo(() => new Set(activeItems), [activeItems])

  const toggle = (a: string) => () => {
    activeSet.has(a) ? activeSet.delete(a) : activeSet.add(a)
    setActiveItems([...activeSet])
  }

  const has = (a: string) => (activeSet.size !== 0 ? activeSet.has(a) : null)

  const clear = () => setActiveItems([])

  const toggleList: ToggleList = useMemo(
    () => ({
      list: activeItems.filter((item) => allowed.includes(item)),
      toggle,
      has,
      clear,
    }),
    [activeItems, allowed]
  )

  return toggleList
}
