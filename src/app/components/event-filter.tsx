import { Event, Filter1, Filter2, Filter3, PlaylistAdd, PlaylistRemove } from '@mui/icons-material'
import { Button, Divider, Grid } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { AttributeListFilter } from './attribute-filter'
import { AppStoreContext } from '../context/app-context'
import { LinearProgressWithLabel } from '../shared/linear-progress-with-label'

export const EventFilter = observer(() => {
  const store = useContext(AppStoreContext)
  const activeEvents = store.filteredEvents
  const eventCount = store.agenda.events.length
  return (
    <>
      <Grid item xs={12}>
        <Divider textAlign="left">Filter</Divider>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AttributeListFilter attributes={store.dates} icon={<Event />} title="Dates" active={store.activeDates} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AttributeListFilter
          attributes={store.uniqueAttributes}
          icon={<PlaylistAdd />}
          title="Include"
          active={store.included}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AttributeListFilter
          attributes={store.possibleExcluded}
          icon={<PlaylistRemove />}
          title="Exclude"
          active={store.excluded}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AttributeListFilter
          attributes={store.possibleOptions}
          icon={<Filter1 />}
          title="Filter A"
          active={store.optionA}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AttributeListFilter
          attributes={store.possibleOptions}
          icon={<Filter2 />}
          title="Filter B"
          active={store.optionB}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AttributeListFilter
          attributes={store.possibleOptions}
          icon={<Filter3 />}
          title="Filter C"
          active={store.optionC}
        />
      </Grid>
      <Grid item xs={11}>
        <LinearProgressWithLabel
          value={(activeEvents.length / eventCount) * 100}
          label={`${activeEvents.length}/${eventCount} Events apply`}
        />
      </Grid>
      <Grid item xs={1}>
        <Button variant="text" color="primary" onClick={() => store.clear()}>
          Clear
        </Button>
      </Grid>
    </>
  )
})
