export interface Film {
  id: string;
  name: string;
  length: number;
  posterLink: string;
  videoLink: string;
  link: string;
  weight: number;
  releaseYear: string;
  attributeIds: string[];
}

export interface FilmEvent {
  id: string;
  filmId: string;
  businessDay: string;
  eventDateTime: string;
  attributeIds: string[];
  bookingLink: string;
  soldOut: boolean;
}

export interface Agenda {
  films: Film[];
  events: FilmEvent[];
}

export const agendaUrl = (date: string) =>
  `https://cors-anywhere.herokuapp.com/https://www.cinemacity.hu/hu/data-api-service/v1/quickbook/10102/film-events/in-cinema/1132/at-date/${date}?attr=&lang=hu_HU`;

export const fetchAgenda = async (date: string) => {
  try {
    const response = await fetch(agendaUrl(date), { mode: 'cors' });
    const content = await response.text();
    return JSON.parse(content).body as Agenda;
  } catch (e) {
    console.error('Could not fetch agenda for ' + date, e);
    return { films: [], events: [] };
  }
};

export const getUniqueAttributes = (agenda: Agenda) => {
  return [
    ...new Set([...agenda.films, ...agenda.events].map(d => d.attributeIds).reduce((a, b) => a.concat(b), []))
  ].sort();
};

export const mergeAgenda = (a: Agenda, b: Agenda) => ({
  films: [...a.films, ...b.films.filter(f => a.films.every(af => af.id !== f.id))],
  events: [...a.events, ...b.events]
});
