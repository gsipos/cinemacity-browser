import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AppStoreContext } from '../context/app-context'
import { FilmEvent } from '../data/data'
import { useIntersection } from '../utils/use-intersection'

export const Event = ({
  event,
  filmName,
  poster,
  attributes,
}: {
  event: FilmEvent
  filmName: string
  poster: string
  attributes: string[]
}) => (
  <Card sx={{ width: '320px' }}>
    <CardHeader title={event.eventDateTime.split('T')[1]} subheader={event.eventDateTime.split('T')[0]} />
    <CardMedia component="img" image={poster} sx={{ height: '120px' }} />
    <CardContent>
      <Typography gutterBottom variant="body2" color="text.secondary">
        {filmName}
      </Typography>
      <Typography variant="body1">
        {event.attributeIds.map((a) => (
          <Typography key={a} variant="body1">
            {a}
          </Typography>
        ))}
      </Typography>
    </CardContent>
    <CardActions>
      <Button variant="text" color="primary" href={event.bookingLink} target="_blank">
        BOOK TICKET
      </Button>
    </CardActions>
  </Card>
)

export const EventList = observer(() => {
  const store = useContext(AppStoreContext)
  const dates = !!store.activeDates.list.length ? store.activeDates.list : store.dates
  const getFilm = (id: string) => store.agenda.films.find((f) => f.id === id)
  return (
    <>
      <Grid item xs={12}>
        <Divider textAlign="left">Events</Divider>
      </Grid>

      {dates.map((date, idx) => (
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
          <Grid item container xs={12} spacing={2} sx={{ py: 4 }}>
            {store.eventsOfDate[date].map((event) => (
              <Grid key={event.id} item xs={12} sm={6} md={4} lg={3}>
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
    </>
  )
})

const EventTableRow = observer(({ event }: { event: FilmEvent }) => {
  const store = useContext(AppStoreContext)
  const film = useMemo(() => store.agenda.films.find((f) => f.id === event.filmId), [event])

  const ref = useRef<HTMLElement>()
  const intersecting = useIntersection(ref as any, {
    rootMargin: '1000px',
    threshold: 0,
  })
  const isActive = store.filteredEventSet.has(event)

  return (
    <TableRow ref={ref as any} sx={{ display: isActive ? 'table-row' : 'none' }}>
      {intersecting ? (
        <>
          <TableCell>
            <CardHeader title={event.eventDateTime.split('T')[1]} subheader={event.eventDateTime.split('T')[0]} />
          </TableCell>
          <TableCell>
            <Box
              component="img"
              src={film?.posterLink}
              sx={{ width: 'auto', height: '64px', contentVisibility: 'auto' }}
            />
          </TableCell>
          <TableCell>{film?.name}</TableCell>
          <TableCell>
            <Grid container spacing={1} columns={{ xs: 1, md: 2, lg: 3 }} sx={{ contentVisibility: 'auto' }}>
              {event.attributeIds.map((a) => (
                <Grid item component="span" key={a} xs={1}>
                  {a}
                </Grid>
              ))}
            </Grid>
          </TableCell>
          <TableCell>
            <Button variant="text" color="primary" href={event.bookingLink} target="_blank">
              BOOK TICKET
            </Button>
          </TableCell>
        </>
      ) : (
        <TableCell>Loading...</TableCell>
      )}
    </TableRow>
  )
})

export const EventTable = observer(() => {
  const store = useContext(AppStoreContext)
  return (
    <>
      <Grid item xs={12}>
        <Divider textAlign="left">Events</Divider>
      </Grid>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time / Date</TableCell>
              <TableCell>Poster</TableCell>
              <TableCell>Film</TableCell>
              <TableCell>Attributes</TableCell>
              <TableCell>Booking Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {store.events.map((event) => (
              <EventTableRow key={event.id} event={event} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
})
