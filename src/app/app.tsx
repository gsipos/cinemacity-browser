import { ThemeProvider } from '@emotion/react'
import { CssBaseline, Grid } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { AppHeader } from './components/app-header'
import { CinemaSelect, SelectedCinema } from './components/cinema'
import { EventTable } from './components/event'
import { EventFilter } from './components/event-filter'
import { FilmList } from './components/film'
import { appStore, AppStoreContext } from './context/app-context'
import { theme } from './shared/theme'

export const App = observer(() => {
  return (
    <ThemeProvider theme={theme}>
      <AppStoreContext.Provider value={appStore}>
        <CssBaseline />
        <AppHeader />

        <Grid container spacing={3} sx={{ p: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <CinemaSelect />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SelectedCinema />
          </Grid>

          <Grid item container spacing={1} xs={12} md={7}>
            <EventFilter />
          </Grid>

          <FilmList />
          <Grid item xs />
          <Grid item xs={12} lg={8}>
            <EventTable />
          </Grid>
          <Grid item xs />
        </Grid>
      </AppStoreContext.Provider>
    </ThemeProvider>
  )
})
