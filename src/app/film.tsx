import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Button, Card, CardActionArea, CardActions, CardHeader, CardMedia, Checkbox, Typography } from '@mui/material'
import React from 'react'
import { Film } from './data/data'

export const FilmDisplay = ({ film, active, toggle }: { film: Film; active: boolean; toggle: () => void }) => (
  <Card elevation={active ? 24 : 2} onClick={toggle}>
    <CardActionArea>
      <CardHeader
        title={
          <Typography gutterBottom variant="body1" component="h6">
            {film.name}
          </Typography>
        }
        action={<Checkbox checked={active} icon={<FavoriteBorder />} checkedIcon={<Favorite color="primary" />} />}
      ></CardHeader>
      <CardMedia component="img" image={film.posterLink} />
      <CardActions>
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
