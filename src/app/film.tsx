import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Checkbox, Typography } from '@mui/material'
import React from 'react'
import { Film } from './data/data'

export const FilmDisplay = ({ film, active, toggle }: { film: Film; active: boolean; toggle: () => void }) => (
  <Card elevation={active ? 12 : 2} onClick={toggle}>
    <CardActionArea>
      <CardMedia component="img" image={film.posterLink} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h5">
          {film.name}
        </Typography>
      </CardContent>
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
