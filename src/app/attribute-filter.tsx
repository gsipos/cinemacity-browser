import { Chip } from '@mui/material'
import React from 'react'

interface Props {
  name: string
  toggle: () => void
  active: boolean
}

export const AttributeFilter = (props: Props) => (
  <Chip
    label={props.name}
    variant={props.active ? 'filled' : 'outlined'}
    color="primary"
    onClick={props.toggle}
    sx={{
      minWidth: '100px',
    }}
  />
)
