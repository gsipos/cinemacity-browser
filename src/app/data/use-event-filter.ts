import { useEffect, useMemo } from 'react'
import { useDebounce } from '../shared/use-debounce'
import { useToggleList } from '../utils/use-toggle-list'
import { FilmEvent } from './data'

export const useEventFilter = (events: FilmEvent[], attributes: string[]) => {
  const included = useToggleList('filter.included')
  const possibleExcludes = attributes.filter((a) => !included.has(a))

  const excluded = useToggleList('filter.excluded', possibleExcludes)
  const possibleOptions = attributes.filter((a) => !excluded.has(a) && !included.has(a))

  const optionsA = useToggleList('filter.optionsA', possibleOptions)
  const optionsB = useToggleList('filter.optionsB', possibleOptions)
  const optionsC = useToggleList('filter.optionsC', possibleOptions)
  const options = [optionsA, optionsB, optionsC].filter((o) => o.list.length)

  const activeDates = useToggleList('filter.dates')
  const activeFilms = useToggleList('filter.films')

  const clear = () =>
    [included, excluded, optionsA, optionsB, optionsC, activeDates, activeFilms].forEach((o) => o.clear())

  const filteredEvents = useMemo(
    () =>
      events
        .filter((e) => activeFilms.has(e.filmId) ?? true)
        .filter((e) => activeDates.has(e.businessDay) ?? true)
        .filter((e) => included.list.every((i) => e.attributeIds.includes(i)))
        .filter((e) => e.attributeIds.every((i) => !excluded.has(i)))
        .filter((e) =>
          options.length ? options.some((option) => option.list.every((i) => e.attributeIds.includes(i))) : true
        ),
    [events, included, excluded, activeDates, activeFilms, optionsA, optionsB, optionsC]
  )

  const activeEvents = useDebounce(filteredEvents, 200)

  return {
    activeEvents,
    activeFilms,
    activeDates,
    included,
    excluded,
    optionsA,
    optionsB,
    optionsC,
    possibleExcludes,
    possibleOptions,
    clear,
  }
}
