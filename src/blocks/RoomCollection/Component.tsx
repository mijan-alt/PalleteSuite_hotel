// src/components/blocks/RoomsCollectionBlock.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Maximize2, Bed, Users } from 'lucide-react'
import { Media } from '@/components/Media'
import { Room } from '@/payload-types'

interface RoomsCollectionBlockProps {
  eyebrow?: string | null
  heading: string
  description?: string | null

  // From your block config
  displayType: 'featured' | 'selected' | 'latest'
  selectedRooms?: Room[]
  limit?: number

  // Passed from parent page (all published rooms)
  rooms?: Room[]

  // Layout
  layout?: 'grid' | 'horizontal' | 'carousel'
  ctaText?: string
  ctaLink?: string
}

export function RoomsCollectionBlock({
  eyebrow,
  heading,
  description,
  displayType = 'featured',
  selectedRooms = [],
  limit = 3,
  rooms = [], // ← All published rooms from parent page
  layout = 'grid',
  ctaText = 'Explore All Rooms',
  ctaLink = '/rooms',
}: RoomsCollectionBlockProps) {
  // Determine which rooms to show
  let roomsToDisplay: Room[] = []

  if (displayType === 'selected' && selectedRooms.length > 0) {
    roomsToDisplay = selectedRooms.slice(0, limit)
  } else if (displayType === 'featured') {
    roomsToDisplay = rooms
      .filter((room) => room.featured === true)
      .slice(0, limit)
  } else if (displayType === 'latest') {
    roomsToDisplay = [...rooms]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  // Fallback if no rooms
  if (roomsToDisplay.length === 0) {
    return null // or return a subtle placeholder
  }

  const isCarousel = layout === 'carousel'
  const isHorizontal = layout === 'horizontal'

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          {eyebrow && (
            <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        {/* Layout: Grid */}
        {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roomsToDisplay.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        {/* Layout: Horizontal Cards */}
        {isHorizontal && (
          <div className="space-y-6">
            {roomsToDisplay.map((room, index) => (
              <div
                key={room.id}
                className={`flex flex-col md:flex-row gap-6 items-center bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="w-full md:w-5/12 h-64 relative overflow-hidden">
                  <Media
                    resource={room.gallery?.[0]?.image}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full md:w-7/12 p-8">
                  <h3 className="text-2xl font-semibold mb-3">{room.name}</h3>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    {room.features?.squareFeet && (
                      <span className="flex items-center gap-2">
                        <Maximize2 className="h-4 w-4" />
                        {room.features.squareFeet} ft²
                      </span>
                    )}
                    {room.features?.guests && (
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {room.features.guests} Guests
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold">${room.pricePerNight}</span>
                      <span className="text-muted-foreground ml-2">/night</span>
                    </div>
                    <Button asChild>
                      <Link href={`/rooms/${room.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Layout: Carousel (Simple version — add Swiper later if needed) */}
        {isCarousel && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roomsToDisplay.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        {/* Optional CTA */}
        {(displayType === 'featured' || displayType === 'latest') && (
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

// Reusable card component
function RoomCard({ room }: { room: Room }) {
  const firstImage = room.gallery?.[0]?.image

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="relative h-72 overflow-hidden">
        {firstImage && typeof firstImage !== 'number' ? (
          <Media
            resource={firstImage}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
        )}
        {room.featured && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-3">{room.name}</h3>

        <div className="flex items-center gap-5 text-sm text-muted-foreground mb-5">
          {room.features?.squareFeet && (
            <span className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4" />
              {room.features.squareFeet} ft²
            </span>
          )}
          {room.features?.guests && (
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {room.features.guests} Guest{room.features.guests > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-primary">
              ${room.pricePerNight}
            </span>
            <span className="text-muted-foreground ml-2">/night</span>
          </div>
          <Button asChild>
            <Link href={`/rooms/${room.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}