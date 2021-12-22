import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { DateTime } from 'luxon'

const axiosInstance = axios.create()

export default async (request: VercelRequest, response: VercelResponse) => {
  const date = DateTime.local().toFormat('yyyy-MM-dd')
  const url = `https://www.cinemacity.hu/hu/data-api-service/v1/quickbook/10102/cinemas/with-event/until/${date}?attr=&lang=hu_HU`
  let res
  try {
    res = (await axiosInstance.get(url)).data
  } catch (e) {
    console.error('Could not fetch cinemas ', e)
  }
  response
    .setHeader('Cache-Control', 's-maxage=10800, stale-while-revalidate')
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send(res ?? { body: { cinemas: [] } })
}
