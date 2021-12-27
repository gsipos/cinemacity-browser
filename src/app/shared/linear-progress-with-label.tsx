import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material'
import React from 'react'

export const LinearProgressWithLabel = (props: LinearProgressProps & { value: number; label: string }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="primary" variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 144 }}>
        <Typography variant="body2" color="text.secondary">
          {props.label}
        </Typography>
      </Box>
    </Box>
  )
}
