import React from 'react';
import styled from 'styled-components';
import { FilmEvent } from './data/data';

export const EventContainer = styled.div`
  display: grid;
  padding: 16px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, 240px);
  justify-items: center;
  grid-gap: 8px;
`;

const EventRoot = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border: 1px solid #131313;
  padding: 8px;
  align-items: center;
`;

export const Event = ({ event, filmName }: { event: FilmEvent; filmName: string }) => (
  <EventRoot>
    <div>{event.eventDateTime.split('T')[0]}</div>
    <h2>{event.eventDateTime.split('T')[1]}</h2>
    <h3>{filmName}</h3>
    <div>{event.attributeIds.join(', ')}</div>
    <hr />
    <a href={event.bookingLink}>Book ticket</a>
  </EventRoot>
);
