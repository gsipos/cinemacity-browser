import { Favorite, FavoriteBorder, HideImage, Photo } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  CardMedia,
  Checkbox,
  Divider,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import React from 'react'
import { Film } from './data/data'
import { useLocalStorage } from './utils/use-local-storage'
import { ToggleList } from './utils/use-toggle-list'

export const FilmDisplay = ({
  film,
  active,
  toggle,
  displayPoster,
}: {
  film: Film
  active: boolean
  toggle: () => void
  displayPoster: boolean
}) => (
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
      {displayPoster ? <CardMedia component="img" image={film.posterLink} /> : null}
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

interface FilmListProps {
  films: Film[]
  activeFilms: ToggleList
}

export const FilmList = (props: FilmListProps) => {
  const { films, activeFilms } = props
  const [displayPoster, setDisplayPoster] = useLocalStorage('film.displayPoster', true)
  const togglePoster = () => setDisplayPoster(!displayPoster)
  return (
    <>
      <Grid item xs={12}>
        <Divider textAlign="left">Films</Divider>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup exclusive value={displayPoster} onChange={togglePoster}>
          <ToggleButton value={true}>
            <Photo color="primary" />
          </ToggleButton>
          <ToggleButton value={false}>
            <HideImage color="primary" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid container spacing={4} sx={{ py: 4 }}>
        {films.map((film) => (
          <Grid item xs={12} sm={4} md={3} lg={2} key={film.id}>
            <FilmDisplay
              film={film}
              key={film.id}
              active={activeFilms.has(film.id) ?? false}
              toggle={activeFilms.toggle(film.id)}
              displayPoster={displayPoster}
            />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
