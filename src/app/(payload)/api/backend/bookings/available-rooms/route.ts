// app/(payload)/api/bookings/available-rooms/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })

    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    const excludeBookingId = searchParams.get('excludeBookingId')

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    // Fetch the room type with its room numbers
    const room = await payload.findByID({
      collection: 'rooms',
      id: roomId,
    })

    if (!room || !room.roomNumbers || room.roomNumbers.length === 0) {
      return NextResponse.json({ roomNumbers: [] })
    }

    // If dates provided, check for overlapping bookings
    let unavailableRoomNumbers = new Set<string>()

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)

      const whereConditions: any = {
        and: [
          {
            room: {
              equals: roomId,
            },
          },
          {
            status: {
              in: ['confirmed', 'checked-in'],
            },
          },
          {
            assignedRoomNumber: {
              exists: true, // Only check bookings that have assigned room numbers
            },
          },
          {
            // Overlapping logic: booking overlaps if it starts before our checkout
            // AND ends after our checkin
            checkIn: {
              less_than: checkOutDate.toISOString(),
            },
          },
          {
            checkOut: {
              greater_than: checkInDate.toISOString(),
            },
          },
        ],
      }

      // Exclude current booking if editing
      if (excludeBookingId) {
        whereConditions.and.push({
          id: {
            not_equals: excludeBookingId,
          },
        })
      }

      const overlappingBookings = await payload.find({
        collection: 'bookings',
        where: whereConditions,
        limit: 1000,
      })

      unavailableRoomNumbers = new Set(
        overlappingBookings.docs
          .map((booking) => booking.assignedRoomNumber)
          .filter(Boolean) as string[],
      )
    } else {
      // If no dates provided, we can't determine availability
      // Mark all rooms as "unknown" by not marking any as unavailable
      // The UI will show a warning to set dates first
    }

    // Return room numbers with availability status
    const roomNumbers = room.roomNumbers.map((rn: any) => ({
      number: rn.number,
      floor: rn.floor,
      isAvailable: !unavailableRoomNumbers.has(rn.number),
    }))

    return NextResponse.json({ roomNumbers })
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    return NextResponse.json({ error: 'Failed to fetch available rooms' }, { status: 500 })
  }
}
