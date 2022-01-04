import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'

export const AppHeader = () => (
  <AppBar position="sticky">
    <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
      <Typography variant="h6" color="inherit" component="div">
        Cinema City Browser
      </Typography>
      <Typography variant="caption" color="text.secondary" component="div">
        Made with ❤ by{' '}
        <Typography
          variant="caption"
          color="text.secondary"
          component="a"
          href="https://github.com/gsipos/cinemacity-browser"
        >
          gsipos
        </Typography>
      </Typography>
    </Toolbar>
  </AppBar>
)
