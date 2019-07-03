import React from 'react';
import styled from 'styled-components';
import { FilmEvent } from './data/data';

export const EventContainer = styled.div`
  display: grid;
  padding: 16px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, 240px);
  justify-items: center;
  grid-gap: 16px;
`;

const EventRoot = styled.div<{ poster: string }>`
  display: flex;
  flex-flow: column nowrap;
  border: 1px solid #131313;
  padding: 8px;
  align-items: center;

  background: RGBA(0,0,0,0.65) url(${p => p.poster});
  background-blend-mode: darken;
  color: #fcfcfc;

  & a {
    color: #fcfcfc;
    text-transform: uppercase;
  }
`;

export const Event = ({ event, filmName, poster }: { event: FilmEvent; filmName: string; poster: string }) => (
  <EventRoot poster={poster}>
    <div>{event.eventDateTime.split('T')[0]}</div>
    <h2>{event.eventDateTime.split('T')[1]}</h2>
    <h3>{filmName}</h3>
    <div>{event.attributeIds.join(', ')}</div>
    <hr />
    <a href={event.bookingLink}>Book ticket</a>
  </EventRoot>
);
