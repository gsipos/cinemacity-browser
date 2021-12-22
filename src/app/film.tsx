import { Favorite, FavoriteBorder } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Typography,
} from '@mui/material'
import React from 'react'
import { Film } from './data/data'

export const FilmDisplay = ({ film, active, toggle }: { film: Film; active: boolean; toggle: () => void }) => (
  <Card elevation={active ? 24 : 2} onClick={toggle}>
    <CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="body1" component="h6">
          {film.name}
        </Typography>
      </CardContent>
      <CardMedia component="img" image={film.posterLink} />
      <CardActions>
        <Checkbox checked={active} icon={<FavoriteBorder />} checkedIcon={<Favorite color="primary" />} />
        <Button variant="text" size="small" color="primary" href={film.link}>
          Cinema city
        </Button>
        <Button variant="text" size="small" color="primary" href={film.videoLink}>
          Video
        </Button>
      </CardActions>
    </CardActionArea>
  </Card>
)
