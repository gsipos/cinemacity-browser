import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material'
import React from 'react'
import { FilmEvent } from './data/data'

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
  <Card>
    <CardHeader title={event.eventDateTime.split('T')[1]} subheader={event.eventDateTime.split('T')[0]} />
    <CardMedia component="img" image={poster} />
    <CardContent>
      <Typography gutterBottom variant="body2" color="text.secondary">
        {filmName}
      </Typography>
      <Typography variant="body1">
        {event.attributeIds.sort().map((a) => (
          <Typography key={a} variant="body1" color={attributes.includes(a) ? 'primary' : 'text.primary'}>
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
