import {
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from '@mui/material'
import React from 'react'
import { ToggleList } from './utils/use-toggle-list'
import FilterListIcon from '@mui/icons-material/FilterList'

interface AttributeListFilterProps {
  icon?: React.ReactNode
  title: string
  attributes: string[]
  active: ToggleList
}

export const AttributeListFilter = (props: AttributeListFilterProps) => {
  const { title, attributes, active, icon } = props

  return (
    <Paper>
      <List
        dense
        subheader={
          <ListSubheader>
            {icon ?? <FilterListIcon />}
            <Typography component="span" sx={{ pl: 4 }}>
              {title}({active.list.length}/{attributes.length})
            </Typography>
          </ListSubheader>
        }
        sx={{ maxHeight: '300px', overflow: 'auto' }}
      >
        {attributes.map((attribute) => (
          <ListItemButton key={attribute} onClick={active.toggle(attribute)}>
            <ListItemIcon>
              <Checkbox edge="start" checked={active.has(attribute) ?? false} disableRipple />
            </ListItemIcon>
            <ListItemText primary={attribute} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  )
}
