import { Directions, OpenInNew } from '@mui/icons-material'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { AppStoreContext } from '../context/app-context'

export const CinemaSelect = observer(() => {
  const store = useContext(AppStoreContext)
  return (
    <Paper>
      <List dense sx={{ maxHeight: '400px', overflow: 'auto' }} subheader={<ListSubheader>Cinemas</ListSubheader>}>
        {store.cinemas.map((cinema) => (
          <ListItem key={cinema.id}>
            <ListItemButton onClick={() => store.setCinema(cinema.id)}>
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
})

export const SelectedCinema = observer(() => {
  const store = useContext(AppStoreContext)
  const cinema = store.activeCinema
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
})
