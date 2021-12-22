import { ThemeProvider } from '@emotion/react'
import { AppBar, Box, CssBaseline, Grid, Paper, Toolbar, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo, useState } from 'react'
import { AttributeFilter } from './attribute-filter'
import { Agenda, fetchAgenda, getUniqueAttributes, mergeAgenda } from './data/data'
import { Event } from './event'
import { FilmDisplay } from './film'
import { theme } from './shared/theme'

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
      <Box sx={{ p: 4 }}>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {dates.map((d) => (
            <Grid item xs={1} key={d}>
              <AttributeFilter name={d} toggle={toggleDate(d)} active={activeDates.includes(d)} key={d} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={1} sx={{ my: 2 }}>
          {uniqueAttributes.map((a) => (
            <Grid item xs={1} key={a}>
              <AttributeFilter name={a} toggle={toggleAttribute(a)} active={activeAttributes.includes(a)} key={a} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ py: 4 }}>
          {agenda.films.map((film) => (
            <Grid item xs={2}>
              <FilmDisplay
                film={film}
                key={film.id}
                active={activeFilms.includes(film.id)}
                toggle={toggleFilm(film.id)}
              />
            </Grid>
          ))}
        </Grid>

        {(!!activeDates.length ? activeDates : dates).map((date, idx) => (
          <>
            <Paper
              elevation={2}
              sx={{
                position: 'sticky',
                top: '48px',
                zIndex: idx,
              }}
            >
              <Typography variant="h4" color="primary">
                {date}
              </Typography>
            </Paper>
            <Grid container spacing={2} sx={{ py: 4 }}>
              {eventsOfDate(date).map((event) => (
                <Grid item xs={1}>
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
      </Box>
    </ThemeProvider>
  )
}
