import { ThemeProvider } from '@emotion/react'
import { Event as EventIcon, Filter1, Filter2, Filter3, PlaylistAdd, PlaylistRemove } from '@mui/icons-material'
import { AppBar, Button, CssBaseline, Divider, Grid, Paper, Toolbar, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo, useState } from 'react'
import { AttributeListFilter } from './attribute-filter'
import { CinemaSelect, SelectedCinema } from './cinema'
import { Agenda, Cinema, fetchAgenda, fetchCinemas, getUniqueAttributes, mergeAgenda } from './data/data'
import { useEventFilter } from './data/use-event-filter'
import { Event } from './event'
import { FilmList } from './film'
import { LinearProgressWithLabel } from './shared/linear-progress-with-label'
import { theme } from './shared/theme'
import { useLocalStorage } from './utils/use-local-storage'

const useCinema = () => {
  const [cinema, setCinema] = useLocalStorage('cinema.id', '1132')

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

  const uniqueAttributes = useMemo(() => getUniqueAttributes(agenda), [agenda])

  const {
    activeEvents,
    activeDates,
    activeFilms,
    included,
    excluded,
    optionsA,
    optionsB,
    optionsC,
    possibleExcludes,
    possibleOptions,
    clear,
  } = useEventFilter(agenda.events, uniqueAttributes)

  const eventsOfDate = (date: string) => activeEvents.filter((e) => e.businessDay === date)

  const getFilm = (id: string) => agenda.films.find((f) => f.id === id)

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

        <Grid item container spacing={1} xs={12} md={7}>
          <Grid item xs={12}>
            <Divider textAlign="left">Filter</Divider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AttributeListFilter attributes={dates} icon={<EventIcon />} title="Dates" active={activeDates} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AttributeListFilter
              attributes={uniqueAttributes}
              icon={<PlaylistAdd />}
              title="Include"
              active={included}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AttributeListFilter
              attributes={possibleExcludes}
              icon={<PlaylistRemove />}
              title="Exclude"
              active={excluded}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AttributeListFilter attributes={possibleOptions} icon={<Filter1 />} title="Filter A" active={optionsA} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AttributeListFilter attributes={possibleOptions} icon={<Filter2 />} title="Filter B" active={optionsB} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AttributeListFilter attributes={possibleOptions} icon={<Filter3 />} title="Filter C" active={optionsC} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LinearProgressWithLabel
              value={(activeEvents.length / agenda.events.length) * 100}
              label={`${activeEvents.length}/${agenda.events.length} Events apply`}
            />
          </Grid>
          <Grid item xs={1}>
            <Button variant="text" color="primary" onClick={clear}>
              Clear
            </Button>
          </Grid>
        </Grid>

        <FilmList films={agenda.films} activeFilms={activeFilms} />

        <Grid item xs={12}>
          <Divider textAlign="left">Events</Divider>
        </Grid>

        {(!!activeDates.list.length ? activeDates.list : dates).map((date, idx) => (
          <React.Fragment key={date}>
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
                <Grid key={event.id} item xs={6} sm={4} md={2} lg={1}>
                  <Event
                    event={event}
                    filmName={getFilm(event.filmId)?.name ?? ''}
                    poster={getFilm(event.filmId)?.posterLink ?? ''}
                    attributes={[]}
                    key={event.id}
                  />
                </Grid>
              ))}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </ThemeProvider>
  )
}
