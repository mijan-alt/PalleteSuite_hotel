import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Maximize2, Bed, Users } from 'lucide-react'
import { Media } from '@/components/Media'
import { Room } from '@/payload-types'

// ---------------------- FETCH FEATURED ROOMS ----------------------

const fetchFeaturedRooms = async () => {
  console.log('fetching featured rooms..')
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'rooms',
    where: {
      featured: { equals: true },
    },
    limit: 6,
    depth: 2,
  })
}

const getFeaturedRooms = unstable_cache(fetchFeaturedRooms, ['featured-rooms'], { tags: ['rooms'] })

// ---------------------- UNIFIED COMPONENT ----------------------

export const FeaturedRooms: React.FC = async () => {
  const featuredRooms = await getFeaturedRooms()

  if (!featuredRooms || featuredRooms.docs.length === 0) {
    return null
  }

  const rooms = featuredRooms.docs as Room[]

  return (
    <section className="py-20 bg-accent/30 my-16">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Rooms</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience luxury and comfort in our handpicked selection of premium accommodations
          </p>
        </div>

        {/* Rooms Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8`}>
          {rooms.map((room) => {
            const firstImage = room.gallery?.[0]?.image

            return (
              <div
                key={room.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100 rounded-xl">
                  {firstImage && typeof firstImage !== 'number' ? (
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110">
                      <Media resource={firstImage} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-semibold">{room.name}</h3>
                    <span className="text-sm text-muted-foreground capitalize">
                      {room.type.replace(/-/g, ' ')}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                    {room.features?.squareFeet && (
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="h-4 w-4" />
                        <span>{room.features.squareFeet} ft²</span>
                      </div>
                    )}

                    {room.features?.beds && (
                      <div className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4" />
                        <span>{room.features.beds}</span>
                      </div>
                    )}

                    {room.features?.guests && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>
                          {room.features.guests} Guest
                          {room.features.guests > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-primary">${room.pricePerNight}</span>
                      <span className="text-muted-foreground ml-1">/night</span>
                    </div>
                    <Button asChild>
                      <Link href={`/rooms/${room.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
