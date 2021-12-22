import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const axiosInstance = axios.create()

export const agendaUrl = (date: string, cinema: string) =>
  `https://www.cinemacity.hu/hu/data-api-service/v1/quickbook/10102/film-events/in-cinema/${cinema}/at-date/${date}?attr=&lang=hu_HU`

export const fetchAgenda = async (date: string, cinema: string) => {
  try {
    const response = await axiosInstance.get(agendaUrl(date, cinema))
    return response.data
  } catch (e) {
    console.error('Could not fetch agenda for ' + date, e)
    return { films: [], events: [] }
  }
}

export default async (request: VercelRequest, response: VercelResponse) => {
  const { date, cinema } = request.query
  const agenda = await fetchAgenda('' + date, '' + cinema)
  response
    .setHeader('Cache-Control', 's-maxage=10800, stale-while-revalidate')
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send(agenda)
}
