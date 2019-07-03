import React from 'react';
import styled from 'styled-components';
import { Film } from './data/data';

export const FilmContainer = styled.div`
  display: grid;
  padding: 16px;
  width: 100%;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fit, 400px);
`;

const FilmRoot = styled.div`
  display: flex;
  flex-flow: row nowrap;
  border: 1px solid #e7e7e7;
  &.active {
    color: #fcfcfc;
    background-color: #131313;
  }
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const Poster = styled.img`
  width: 80px;
  height: auto;
  margin: 4px;
`;

const Info = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 8px;
`;

export const FilmDisplay = ({ film, active, toggle }: { film: Film; active: boolean; toggle: () => void }) => (
  <FilmRoot className={active ? 'active' : ''} onClick={toggle}>
    <Poster src={film.posterLink} />
    <Info>
      <h3>{film.name}</h3>
      <a href={film.link} target="_blank">
        Cinema city link
      </a>
      <a href={film.videoLink} target="_blank">
        Video link
      </a>
    </Info>
  </FilmRoot>
);
