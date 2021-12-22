import { Directions, OpenInNew } from '@mui/icons-material'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import React from 'react'
import { Cinema } from './data/data'

interface Props {
  cinema: string
  cinemas: Cinema[]
  selectCinema: (cinema: string) => void
}

export const CinemaSelect = (props: Props) => {
  return (
    <Paper>
      <List dense sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {props.cinemas.map((cinema) => (
          <ListItem key={cinema.id}>
            <ListItemButton onClick={() => props.selectCinema(cinema.id)}>
              <ListItemAvatar>
                <Avatar src={cinema.imageUrl} />
              </ListItemAvatar>
              <ListItemText primary={cinema.displayName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export const SelectedCinema = ({ cinema }: { cinema: Cinema | undefined }) => {
  if (!cinema) {
    return null
  }
  return (
    <Card>
      <CardHeader title={cinema.displayName} />
      <CardMedia component="img" image={cinema.imageUrl} />
      <CardContent>
        <Typography variant="body1" component="p">
          {cinema.address}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton href={cinema.link} target="_blank">
          <OpenInNew />
        </IconButton>
        <IconButton
          href={`https://www.google.com/maps/search/?api=1&query=${cinema.latitude},${cinema.longitude}`}
          target="_blank"
        >
          <Directions />
        </IconButton>
      </CardActions>
    </Card>
  )
}
