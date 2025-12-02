// src/endpoints/rooms/[id].ts (Next.js App Router)
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Using Next.js 15+ App Router - params is now a Promise
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })

    // Await params to get the actual values
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    // Fetch the room
    const room = await payload.findByID({
      collection: 'rooms',
      id: id,
      depth: 0, // No nested relationships
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Return the room data with price
    return NextResponse.json({
      success: true,
      data: {
        id: room.id,
        name: room.name,
        type: room.type,
        pricePerNight: room.pricePerNight,
        totalUnits: room.totalUnits,
        availability: room.availability,
        roomNumbers: room.roomNumbers || [],
        description: room.description,
        features: room.features || {},
        amenities: room.amenities || [],
      },
    })
  } catch (error: any) {
    console.error('Error fetching room:', error)

    // Handle specific errors
    if (error.status === 404) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch room details',
        message: error.message,
      },
      { status: 500 },
    )
  }
}
