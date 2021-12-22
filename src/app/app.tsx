import { ThemeProvider } from '@emotion/react'
import { AppBar, Box, CssBaseline, Divider, Grid, Paper, Toolbar, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo, useState } from 'react'
import { AttributeFilter } from './attribute-filter'
import { CinemaSelect, SelectedCinema } from './cinema'
import { Agenda, Cinema, fetchAgenda, fetchCinemas, getUniqueAttributes, mergeAgenda } from './data/data'
import { Event } from './event'
import { FilmDisplay } from './film'
import { theme } from './shared/theme'

const useCinema = () => {
  const [cinema, setCinema] = useState('1132')

  const [cinemas, setCinemas] = useState<Cinema[]>([])

  useEffect(() => {
    fetchCinemas().then((res) => setCinemas(res.cinemas))
  }, [])

  const activeCinema = cinemas.find((c) => c.id === cinema)

  return [cinema, setCinema, cinemas, activeCinema] as const
}

const useAgenda = (dates: string[], cinema: string) => {
  const emptyAgenda: Agenda = { films: [], events: [] }
  const [agenda, setAgenda] = useState<Agenda>(emptyAgenda)

  useEffect(() => {
    setAgenda(emptyAgenda)
    Promise.all(dates.map((d) => fetchAgenda(d, cinema))).then((agendas) => setAgenda(agendas.reduce(mergeAgenda)))
  }, [cinema])

  return agenda
}

const toggleValueInArray = (value: string, arr: string[]) =>
  arr.includes(value) ? arr.filter((d) => d !== value) : [...arr, value]

const useToggleList = () => {
  const [activeItems, setActiveItems] = useState<string[]>([])
  const toggle = (a: string) => () => setActiveItems(toggleValueInArray(a, activeItems))
  return [activeItems, toggle] as const
}

export const App = () => {
  const dates = useMemo(() => {
    const workingDates = []
    for (let i = 0; i < 7; i++) {
      workingDates.push(DateTime.local().plus({ days: i }).toFormat('yyyy-MM-dd'))
    }
    return workingDates
  }, [])

  const [cinema, setCinema, cinemas, activeCinema] = useCinema()
  const agenda = useAgenda(dates, cinema)

  const [activeDates, toggleDate] = useToggleList()
  const [activeFilms, toggleFilm] = useToggleList()
  const [activeAttributes, toggleAttribute] = useToggleList()

  const activeEvents = useMemo(
    () =>
      agenda.events
        .filter((e) => (activeAttributes.length ? e.attributeIds.some((i) => activeAttributes.includes(i)) : true))
        .filter((e) => (activeFilms.length ? activeFilms.includes(e.filmId) : true))
        .filter((e) => (activeDates.length ? activeDates.includes(e.businessDay) : true)),
    [agenda, activeAttributes, activeFilms, activeDates]
  )

  const eventsOfDate = (date: string) => activeEvents.filter((e) => e.businessDay === date)

  const getFilm = (id: string) => agenda.films.find((f) => f.id === id)

  const uniqueAttributes = useMemo(() => getUniqueAttributes(agenda), [agenda])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            Cinema City Browser
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} sx={{ p: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <CinemaSelect cinemas={cinemas} cinema={cinema} selectCinema={setCinema} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SelectedCinema cinema={activeCinema} />
        </Grid>

        <Grid container spacing={1} item xs={12} sm={6} md={2}>
          {dates.map((d) => (
            <Grid item xs={6} md={12} key={d}>
              <AttributeFilter name={d} toggle={toggleDate(d)} active={activeDates.includes(d)} key={d} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1} sx={{ my: 2 }} xs={12} sm={6} md={5}>
          {uniqueAttributes.map((a) => (
            <Grid item key={a} xs={12} sm={6} md={4} lg={3}>
              <AttributeFilter name={a} toggle={toggleAttribute(a)} active={activeAttributes.includes(a)} key={a} />
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Divider textAlign="left">Films</Divider>
        </Grid>

        <Grid container spacing={4} sx={{ py: 4 }}>
          {agenda.films.map((film) => (
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <FilmDisplay
                film={film}
                key={film.id}
                active={activeFilms.includes(film.id)}
                toggle={toggleFilm(film.id)}
              />
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Divider textAlign="left">Events</Divider>
        </Grid>

        {(!!activeDates.length ? activeDates : dates).map((date, idx) => (
          <>
            <Paper
              elevation={2}
              sx={{
                position: 'sticky',
                top: '48px',
                zIndex: idx,
                width: '100%',
              }}
            >
              <Typography variant="h4" color="primary">
                {date}
              </Typography>
            </Paper>
            <Grid container spacing={2} sx={{ py: 4 }}>
              {eventsOfDate(date).map((event) => (
                <Grid item xs={6} sm={4} md={2} lg={1}>
                  <Event
                    event={event}
                    filmName={getFilm(event.filmId)!.name}
                    poster={getFilm(event.filmId)!.posterLink}
                    attributes={activeAttributes}
                    key={event.id}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ))}
      </Grid>
    </ThemeProvider>
  )
}
