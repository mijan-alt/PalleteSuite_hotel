// app/(payload)/api/bookings/metrics/route.ts
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

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const twoWeeksAgo = new Date(lastWeek)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7)

    // Fetch bookings from this week (for new bookings and revenue)
    const thisWeekBookings = await payload.find({
      collection: 'bookings',
      limit: 1000,
      where: {
        createdAt: {
          greater_than_equal: lastWeek.toISOString(),
        },
      },
    })

    // Fetch bookings from previous week
    const prevWeekBookings = await payload.find({
      collection: 'bookings',
      limit: 1000,
      where: {
        and: [
          {
            createdAt: {
              greater_than_equal: twoWeeksAgo.toISOString(),
            },
          },
          {
            createdAt: {
              less_than: lastWeek.toISOString(),
            },
          },
        ],
      },
    })

    // Calculate new bookings
    const newBookingsThisWeek = thisWeekBookings.totalDocs
    const newBookingsPrevWeek = prevWeekBookings.totalDocs
    const newBookingsChange =
      newBookingsPrevWeek > 0
        ? ((newBookingsThisWeek - newBookingsPrevWeek) / newBookingsPrevWeek) * 100
        : 0

    // ========== FETCH ACTUAL CHECK-INS (Status-Based) ==========
    // Get bookings that transitioned to 'checked-in' status this week
    const actualCheckInsThisWeek = await payload.find({
      collection: 'bookings',
      limit: 1000,
      where: {
        and: [
          {
            status: {
              in: ['checked-in', 'checked-out'], // Include checked-out since they were checked in
            },
          },
          {
            actualCheckInTime: {
              greater_than_equal: lastWeek.toISOString(),
            },
          },
          {
            actualCheckInTime: {
              less_than_equal: now.toISOString(),
            },
          },
        ],
      },
    })

    const actualCheckInsPrevWeek = await payload.find({
      collection: 'bookings',
      limit: 1000,
      where: {
        and: [
          {
            status: {
              in: ['checked-in', 'checked-out'],
            },
          },
          {
            actualCheckInTime: {
              greater_than_equal: twoWeeksAgo.toISOString(),
            },
          },
          {
            actualCheckInTime: {
              less_than: lastWeek.toISOString(),
            },
          },
        ],
      },
    })

    const checkInsThisWeek = actualCheckInsThisWeek.totalDocs
    const checkInsPrevWeek = actualCheckInsPrevWeek.totalDocs
    const checkInsChange =
      checkInsPrevWeek > 0 ? ((checkInsThisWeek - checkInsPrevWeek) / checkInsPrevWeek) * 100 : 0

    // ========== FETCH ACTUAL CHECK-OUTS (Status-Based) ==========
    const actualCheckOutsThisWeek = await payload.find({
      collection: 'bookings',
      limit: 1000,
      where: {
        and: [
          {
            status: {
              equals: 'checked-out',
            },
          },
          {
            actualCheckOutTime: {
              greater_than_equal: lastWeek.toISOString(),
            },
          },
          {
            actualCheckOutTime: {
              less_than_equal: now.toISOString(),
            },
          },
        ],
      },
    })

    const actualCheckOutsPrevWeek = await payload.find({
      collection: 'bookings',
      limit: 1000,
      where: {
        and: [
          {
            status: {
              equals: 'checked-out',
            },
          },
          {
            actualCheckOutTime: {
              greater_than_equal: twoWeeksAgo.toISOString(),
            },
          },
          {
            actualCheckOutTime: {
              less_than: lastWeek.toISOString(),
            },
          },
        ],
      },
    })

    const checkOutsThisWeek = actualCheckOutsThisWeek.totalDocs
    const checkOutsPrevWeek = actualCheckOutsPrevWeek.totalDocs
    const checkOutsChange =
      checkOutsPrevWeek > 0
        ? ((checkOutsThisWeek - checkOutsPrevWeek) / checkOutsPrevWeek) * 100
        : 0

   
    // Revenue from guests who actually checked IN this week
    const revenueThisWeek = actualCheckInsThisWeek.docs.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0,
    )
    const revenuePrevWeek = actualCheckInsPrevWeek.docs.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0,
    )
    const revenueChange =
      revenuePrevWeek > 0 ? ((revenueThisWeek - revenuePrevWeek) / revenuePrevWeek) * 100 : 0

    return NextResponse.json({
      newBookings: newBookingsThisWeek,
      newBookingsChange,
      checkIns: checkInsThisWeek,
      checkInsChange,
      checkOuts: checkOutsThisWeek,
      checkOutsChange,
      totalRevenue: revenueThisWeek,
      totalRevenueChange: revenueChange,
    })
  } catch (error) {
    console.error('Error fetching booking metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch booking metrics' }, { status: 500 })
  }
}
