// app/(payload)/api/rooms/availability/route.ts
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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch all room types with their room numbers
    const allRooms = await payload.find({
      collection: 'rooms',
      limit: 1000,
    })

    // Fetch all active bookings (confirmed, checked-in)
    const activeBookings = await payload.find({
      collection: 'bookings',
      limit: 1000,
      where: {
        and: [
          {
            status: {
              in: ['confirmed', 'checked-in'],
            },
          },
          {
            checkOut: {
              greater_than_equal: today.toISOString(),
            },
          },
        ],
      },
      depth: 1,
    })

    // Create a map of occupied/reserved room numbers
    const bookedRoomNumbers = new Set<string>()
    activeBookings.docs.forEach((booking) => {
      if (booking.assignedRoomNumber) {
        bookedRoomNumbers.add(booking.assignedRoomNumber)
      }
    })

    // Calculate availability for each room type
    const roomAvailability = allRooms.docs.map((room) => {
      const totalUnits = room.totalUnits || 1
      const roomNumbers = room.roomNumbers || []

      // Count how many rooms are occupied/reserved
      const occupiedRooms = roomNumbers.filter(
        (rn: any) => bookedRoomNumbers.has(rn.number) && 
        activeBookings.docs.some(
          (b) => b.assignedRoomNumber === rn.number && b.status === 'checked-in'
        )
      )

      const reservedRooms = roomNumbers.filter(
        (rn: any) => bookedRoomNumbers.has(rn.number) && 
        activeBookings.docs.some(
          (b) => b.assignedRoomNumber === rn.number && b.status === 'confirmed'
        )
      )

      const occupiedCount = occupiedRooms.length
      const reservedCount = reservedRooms.length
      const availableCount = totalUnits - bookedRoomNumbers.size

      return {
        roomId: room.id,
        roomName: room.name,
        roomType: room.type,
        totalUnits,
        occupied: occupiedCount,
        reserved: reservedCount,
        available: availableCount > 0 ? availableCount : 0,
        availableRoomNumbers: roomNumbers
          .filter((rn: any) => !bookedRoomNumbers.has(rn.number))
          .map((rn: any) => rn.number),
      }
    })

    // Calculate overall totals
    const summary = roomAvailability.reduce(
      (acc, room) => ({
        total: acc.total + room.totalUnits,
        occupied: acc.occupied + room.occupied,
        reserved: acc.reserved + room.reserved,
        available: acc.available + room.available,
      }),
      { total: 0, occupied: 0, reserved: 0, available: 0 },
    )

    // Get sample bookings with room numbers to display on dashboard
    const occupiedBookings = activeBookings.docs
      .filter((b) => b.status === 'checked-in' && b.assignedRoomNumber)
      .slice(0, 3)
      .map((booking) => ({
        roomNumber: booking.assignedRoomNumber || 'Unassigned',
        guestName: `${booking.firstName} ${booking.lastName}`,
        roomName: typeof booking.room === 'object' ? booking.room.name : 'Unknown',
        roomType: typeof booking.room === 'object' ? booking.room.type : 'Unknown',
        checkOut: booking.checkOut,
        status: 'occupied',
      }))

    const reservedBookings = activeBookings.docs
      .filter((b) => b.status === 'confirmed')
      .slice(0, 2)
      .map((booking) => ({
        roomNumber: booking.assignedRoomNumber || 'Not Assigned',
        guestName: `${booking.firstName} ${booking.lastName}`,
        roomName: typeof booking.room === 'object' ? booking.room.name : 'Unknown',
        roomType: typeof booking.room === 'object' ? booking.room.type : 'Unknown',
        checkIn: booking.checkIn,
        status: 'reserved',
      }))

    return NextResponse.json({
      summary: {
        total: summary.total,
        occupied: summary.occupied,
        reserved: summary.reserved,
        available: summary.available,
        cleaning: 0,
      },
      byRoomType: roomAvailability,
      sampleBookings: {
        occupied: occupiedBookings,
        reserved: reservedBookings,
      },
    })
  } catch (error) {
    console.error('Error fetching room availability:', error)
    return NextResponse.json({ error: 'Failed to fetch room availability' }, { status: 500 })
  }
}