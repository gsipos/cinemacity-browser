import type { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch'

export const agendaUrl = (date: string) =>
  `https://www.cinemacity.hu/hu/data-api-service/v1/quickbook/10102/film-events/in-cinema/1132/at-date/${date}?attr=&lang=hu_HU`

export const fetchAgenda = async (date: string) => {
  try {
    const response = await fetch(agendaUrl(date))
    const content = await response.text()
    return JSON.parse(content).body
  } catch (e) {
    console.error('Could not fetch agenda for ' + date, e)
    return { films: [], events: [] }
  }
}

export default async (request: VercelRequest, response: VercelResponse) => {
  const { date } = request.query
  const agenda = await fetchAgenda('' + date)
  response
    .setHeader('Cache-Control', 's-maxage=10800, stale-while-revalidate')
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send(agenda)
}
