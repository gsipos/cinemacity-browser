import { DateTime } from 'luxon'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AttributeFilter, AttributeFilterContainer } from './attribute-filter'
import { Agenda, fetchAgenda, getUniqueAttributes, mergeAgenda } from './data/data'
import { Event, EventContainer } from './event'
import { FilmContainer, FilmDisplay } from './film'

const AppRoot = styled.div`
  padding: 32px;
  color: #131313;
  background-color: #fcfcfc;

  & div {
    box-sizing: border-box;
  }
`

const toggleValueInArray = (value: string, arr: string[]) =>
  arr.includes(value) ? arr.filter((d) => d !== value) : [...arr, value]

export const App = () => {
  const dates = useMemo(() => {
    const workingDates = []
    for (let i = 0; i < 7; i++) {
      workingDates.push(DateTime.local().plus({ days: i }).toFormat('yyyy-MM-dd'))
    }
    return workingDates
  }, [])

  const [agenda, setAgenda] = useState<Agenda>({ films: [], events: [] })

  const [activeDates, setActiveDates] = useState<string[]>([])
  const toggleDate = (a: string) => () => setActiveDates(toggleValueInArray(a, activeDates))

  const [activeAttributes, setActiveAttributes] = useState<string[]>([])
  const toggleAttribute = (a: string) => () => setActiveAttributes(toggleValueInArray(a, activeAttributes))

  const [activeFilms, setActiveFilms] = useState<string[]>([])
  const toggleFilm = (id: string) => () => setActiveFilms(toggleValueInArray(id, activeFilms))

  useEffect(() => {
    Promise.all(dates.map((d) => fetchAgenda(d))).then((agendas) => setAgenda(agendas.reduce(mergeAgenda)))
  }, [])

  const activeEvents = useMemo(
    () =>
      agenda.events
        .filter((e) => (activeAttributes.length ? e.attributeIds.some((i) => activeAttributes.includes(i)) : true))
        .filter((e) => (activeFilms.length ? activeFilms.includes(e.filmId) : true))
        .filter((e) => (activeDates.length ? activeDates.includes(e.businessDay) : true)),
    [agenda, activeAttributes, activeFilms, activeDates]
  )

  const getFilm = (id: string) => agenda.films.find((f) => f.id === id)!.name

  const uniqueAttributes = useMemo(() => getUniqueAttributes(agenda), [agenda])
  return (
    <AppRoot>
      <h1>Cinema City Browser</h1>

      <AttributeFilterContainer>
        {dates.map((d) => (
          <AttributeFilter name={d} toggle={toggleDate(d)} active={activeDates.includes(d)} key={d} />
        ))}
      </AttributeFilterContainer>

      <AttributeFilterContainer>
        {uniqueAttributes.map((a) => (
          <AttributeFilter name={a} toggle={toggleAttribute(a)} active={activeAttributes.includes(a)} key={a} />
        ))}
      </AttributeFilterContainer>

      <FilmContainer>
        {agenda.films.map((film) => (
          <FilmDisplay film={film} key={film.id} active={activeFilms.includes(film.id)} toggle={toggleFilm(film.id)} />
        ))}
      </FilmContainer>

      <EventContainer>
        {activeEvents.map((event) => (
          <Event event={event} filmName={getFilm(event.filmId)} key={event.id} />
        ))}
      </EventContainer>
    </AppRoot>
  )
}
