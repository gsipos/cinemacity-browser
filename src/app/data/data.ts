export interface Film {
  id: string
  name: string
  length: number
  posterLink: string
  videoLink: string
  link: string
  weight: number
  releaseYear: string
  attributeIds: string[]
}

export interface FilmEvent {
  id: string
  filmId: string
  businessDay: string
  eventDateTime: string
  attributeIds: string[]
  bookingLink: string
  soldOut: boolean
}

export interface Agenda {
  films: Film[]
  events: FilmEvent[]
}

export interface Cinema {
  id: string
  displayName: string
  imageUrl: string
  link: string
  address: string
}

export interface Cinemas {
  cinemas: Cinema[]
}

export const fetchAgenda = async (date: string) => {
  try {
    const url = new URL('api/agenda', window.location.href)
    url.searchParams.set('date', date)
    const response = await fetch(url.toString())
    const content = await response.text()
    return JSON.parse(content).body as Agenda
  } catch (e) {
    console.error('Could not fetch agenda for ' + date, e)
    return { films: [], events: [] }
  }
}

export const getUniqueAttributes = (agenda: Agenda) => {
  return [
    ...new Set([...agenda.films, ...agenda.events].map((d) => d.attributeIds).reduce((a, b) => a.concat(b), [])),
  ].sort()
}

export const mergeAgenda = (a: Agenda, b: Agenda) => ({
  films: [...a.films, ...b.films.filter((f) => a.films.every((af) => af.id !== f.id))],
  events: [...a.events, ...b.events],
})
