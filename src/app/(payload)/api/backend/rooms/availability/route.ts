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

    // Calculate availability for each room type
    const roomAvailability = allRooms.docs.map((room) => {
      const totalUnits = room.totalUnits || 1
      const roomNumbers = room.roomNumbers || []

      // Get all bookings for this specific room type
      const roomBookings = activeBookings.docs.filter((booking) => {
        const bookingRoomId = typeof booking.room === 'object' ? booking.room.id : booking.room
        return bookingRoomId === room.id
      })

      // Count occupied rooms (checked-in with assigned room number)
      const occupiedRooms = roomBookings.filter(
        (b) => b.status === 'checked-in' && b.assignedRoomNumber,
      )
      const occupiedCount = occupiedRooms.length

      // Count reserved rooms (confirmed with assigned room number)
      const reservedRooms = roomBookings.filter(
        (b) => b.status === 'confirmed' && b.assignedRoomNumber,
      )
      const reservedCount = reservedRooms.length

      // Get list of booked room numbers for this room type
      const bookedRoomNumbers = new Set<string>(
        [...occupiedRooms, ...reservedRooms]
          .map((b) => b.assignedRoomNumber)
          .filter((num): num is string => !!num),
      )

      // Calculate available count
      const availableCount = totalUnits - bookedRoomNumbers.size

      // Get available room numbers
      const availableRoomNumbers = roomNumbers
        .filter((rn: any) => !bookedRoomNumbers.has(rn.number))
        .map((rn: any) => rn.number)

      return {
        roomId: room.id,
        roomName: room.name,
        roomType: room.type,
        totalUnits,
        occupied: occupiedCount,
        reserved: reservedCount,
        available: availableCount > 0 ? availableCount : 0,
        availableRoomNumbers,
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
      .map((booking) => {
        const room = typeof booking.room === 'object' ? booking.room : null
        return {
          roomNumber: booking.assignedRoomNumber || 'Unassigned',
          guestName: `${booking.firstName} ${booking.lastName}`,
          roomName: room?.name || 'Unknown',
          roomType: room?.type || 'Unknown',
          checkOut: booking.checkOut,
          status: 'occupied' as const,
        }
      })

    const reservedBookings = activeBookings.docs
      .filter((b) => b.status === 'confirmed' && b.assignedRoomNumber)
      .slice(0, 2)
      .map((booking) => {
        const room = typeof booking.room === 'object' ? booking.room : null
        return {
          roomNumber: booking.assignedRoomNumber || 'Not Assigned',
          guestName: `${booking.firstName} ${booking.lastName}`,
          roomName: room?.name || 'Unknown',
          roomType: room?.type || 'Unknown',
          checkIn: booking.checkIn,
          status: 'reserved' as const,
        }
      })

    return NextResponse.json({
      summary: {
        total: summary.total,
        occupied: summary.occupied,
        reserved: summary.reserved,
        available: summary.available,
        cleaning: 0, // You can add this logic later if needed
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
