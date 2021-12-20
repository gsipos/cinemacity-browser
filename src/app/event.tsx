import React from 'react'
import styled from 'styled-components'
import { FilmEvent } from './data/data'

export const EventContainer = styled.div`
  display: grid;
  padding: 16px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, 240px);
  justify-items: center;
  grid-gap: 32px;
`

const EventRoot = styled.div<{ poster: string }>`
  display: flex;
  flex-flow: column nowrap;
  padding: 8px;
  align-items: center;
  background: RGBA(255, 255, 255, 0.65) url(${(p) => p.poster});
  background-blend-mode: lighten;
  color: #131313;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  & div,
  h3,
  h2,
  a {
    background-color: #ffffff88;
  }
  & a {
    color: #131313;
    text-transform: uppercase;
  }
`

export const Event = ({
  event,
  filmName,
  poster,
  attributes,
}: {
  event: FilmEvent
  filmName: string
  poster: string
  attributes: string[]
}) => (
  <EventRoot poster={poster}>
    <div>{event.eventDateTime.split('T')[0]}</div>
    <h2>{event.eventDateTime.split('T')[1]}</h2>
    <h3>{filmName}</h3>
    <div>{event.attributeIds.map((a) => (attributes.includes(a) ? <strong>{a} </strong> : <span>{a} </span>))}</div>
    <hr />
    <a href={event.bookingLink} target="_blank">
      Book ticket
    </a>
  </EventRoot>
)
