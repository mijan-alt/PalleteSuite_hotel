// app/api/bookings/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  const payload = await getPayload({ config: configPromise })
  const body = await req.json()
  const booking = await payload.create({ collection: 'inquiries', data: body })
  return Response.json(booking)
}