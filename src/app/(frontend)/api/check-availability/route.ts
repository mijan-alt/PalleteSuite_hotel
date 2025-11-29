// app/api/check-availability/route.ts
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  const { roomId, checkIn, checkOut } = await req.json()

  const payload = await getPayload({ config })

  // 1. Get the room + its totalUnits
  const room = await payload.findByID({
    collection: 'rooms',
    id: roomId,
    depth: 0,
  })

  if (!room) return Response.json({ available: false, reason: 'Room not found' })

  // 2. Count how many CONFIRMED bookings overlap with the requested dates
  const overlappingBookings = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { room: { equals: roomId } },
        { status: { equals: 'confirmed' } },
        { checkIn: { less_than: checkOut } },
        { checkOut: { greater_than: checkIn } },
      ],
    },
    pagination: false,
  })

  const bookedUnits = overlappingBookings.docs.length
  const availableUnits = room.totalUnits - bookedUnits

  const isAvailable = availableUnits > 0

  return Response.json({
    available: isAvailable,
    availableUnits,
    totalUnits: room.totalUnits,
    bookedUnits,
  })
}