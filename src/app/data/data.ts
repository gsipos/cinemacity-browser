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
  latitude: number
  longitude: number
}

export interface Cinemas {
  cinemas: Cinema[]
}

export const fetchAgenda = async (date: string, cinema: string) => {
  try {
    const url = new URL('api/agenda', window.location.href)
    url.searchParams.set('date', date)
    url.searchParams.set('cinema', cinema)
    const response = await fetch(url.toString())
    const content = await response.text()
    return JSON.parse(content).body as Agenda
  } catch (e) {
    console.error('Could not fetch agenda for ' + date, e)
    return { films: [], events: [] }
  }
}

export const fetchCinemas = async () => {
  try {
    const url = new URL('api/cinema', window.location.href)
    const response = await fetch(url.toString())
    const content = await response.json()
    return content.body as Cinemas
  } catch (e) {
    console.error('Could not fetch cinemas', e)
    return { cinemas: [] }
  }
}

export const getUniqueAttributes = (agenda: Agenda) => {
  return [...new Set([...agenda.films, ...agenda.events].map((d) => d.attributeIds).flat())].sort()
}

export const mergeAgenda = (a: Agenda, b: Agenda) => ({
  films: [...a.films, ...b.films.filter((f) => a.films.every((af) => af.id !== f.id))],
  events: [...a.events, ...b.events],
})
