// app/(payload)/api/bookings/recent-activities/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

interface Activity {
  id: string
  time: string
  description: string
  detail: string
  iconType: 'check-out' | 'check-in' | 'new-booking' | 'inquiry'
  bgColor: string
  iconBg: string
  iconColor: string
  type: 'check-out' | 'check-in' | 'new-booking' | 'inquiry'
  timestamp: Date
}

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })

    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const last24Hours = new Date(now)
    last24Hours.setHours(last24Hours.getHours() - 24)

    const activities: Activity[] = []

    // Fetch recent check-outs (last 24 hours)
    const recentCheckOuts = await payload.find({
      collection: 'bookings',
      limit: 10,
      where: {
        and: [
          {
            status: {
              equals: 'checked-out',
            },
          },
          {
            actualCheckOutTime: {
              greater_than_equal: last24Hours.toISOString(),
            },
          },
        ],
      },
      sort: '-actualCheckOutTime',
      depth: 1,
    })

    recentCheckOuts.docs.forEach((booking) => {
      if (!booking.actualCheckOutTime) return
      
      const checkOutTime = new Date(booking.actualCheckOutTime)
      activities.push({
        id: `checkout-${booking.id}`,
        time: formatTime(checkOutTime),
        description: 'Guest Check-Out',
        detail: `${booking.firstName} ${booking.lastName} completed check-out.`,
        iconType: 'check-out',
        bgColor: 'bg-green-50',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        type: 'check-out',
        timestamp: checkOutTime,
      })
    })

    // Fetch recent check-ins (last 24 hours)
    const recentCheckIns = await payload.find({
      collection: 'bookings',
      limit: 10,
      where: {
        and: [
          {
            status: {
              in: ['checked-in'],
            },
          },
          {
            actualCheckInTime: {
              greater_than_equal: last24Hours.toISOString(),
            },
          },
        ],
      },
      sort: '-actualCheckInTime',
      depth: 1,
    })

    recentCheckIns.docs.forEach((booking) => {
      if (!booking.actualCheckInTime) return
      
      const checkInTime = new Date(booking.actualCheckInTime)
      const roomInfo = typeof booking.room === 'object' ? booking.room.name : 'Unknown Room'
      activities.push({
        id: `checkin-${booking.id}`,
        time: formatTime(checkInTime),
        description: 'Guest Check-In',
        detail: `${booking.firstName} ${booking.lastName} checked into ${roomInfo}${booking.assignedRoomNumber ? ` (${booking.assignedRoomNumber})` : ''}.`,
        iconType: 'check-in',
        bgColor: 'bg-blue-50',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        type: 'check-in',
        timestamp: checkInTime,
      })
    })

    // Fetch recent new bookings (last 24 hours)
    const recentBookings = await payload.find({
      collection: 'bookings',
      limit: 10,
      where: {
        and: [
          {
            createdAt: {
              greater_than_equal: last24Hours.toISOString(),
            },
          },
          {
            status: {
              in: ['pending', 'confirmed'],
            },
          },
        ],
      },
      sort: '-createdAt',
      depth: 1,
    })

    recentBookings.docs.forEach((booking) => {
      const createdTime = new Date(booking.createdAt)
      const roomInfo = typeof booking.room === 'object' ? booking.room.name : 'Unknown Room'
      const checkInDate = new Date(booking.checkIn)
      const checkOutDate = new Date(booking.checkOut)
      
      activities.push({
        id: `booking-${booking.id}`,
        time: formatTime(createdTime),
        description: `New booking: ${roomInfo}${booking.assignedRoomNumber ? ` ${booking.assignedRoomNumber}` : ''}`,
        detail: `${booking.firstName} ${booking.lastName} booked for ${formatDateRange(checkInDate, checkOutDate)}.`,
        iconType: 'new-booking',
        bgColor: 'bg-yellow-50',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        type: 'new-booking',
        timestamp: createdTime,
      })
    })

    // Fetch recent inquiries if you have an inquiries collection
    try {
      const recentInquiries = await payload.find({
        collection: 'inquiries',
        limit: 5,
        where: {
          createdAt: {
            greater_than_equal: last24Hours.toISOString(),
          },
        },
        sort: '-createdAt',
      })

      recentInquiries.docs.forEach((inquiry: any) => {
        const inquiryTime = new Date(inquiry.createdAt)
        activities.push({
          id: `inquiry-${inquiry.id}`,
          time: formatTime(inquiryTime),
          description: `New inquiry from ${inquiry.name || 'Guest'}`,
          detail: inquiry.subject || inquiry.message?.substring(0, 80) || 'Inquiry received',
          iconType: 'inquiry',
          bgColor: 'bg-purple-50',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          type: 'inquiry',
          timestamp: inquiryTime,
        })
      })
    } catch (error) {
      // Inquiries collection might not exist, skip silently
      console.log('Inquiries collection not available')
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Return top 10 most recent activities
    const recentActivities = activities.slice(0, 10).map(({ timestamp, ...activity }) => activity)

    return NextResponse.json({
      activities: recentActivities,
      count: recentActivities.length,
    })
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    return NextResponse.json({ error: 'Failed to fetch recent activities' }, { status: 500 })
  }
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// Helper function to format date range
function formatDateRange(checkIn: Date, checkOut: Date): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return `${formatDate(checkIn)} - ${formatDate(checkOut)}`
}