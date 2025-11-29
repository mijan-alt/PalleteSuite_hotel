// src/app/(frontend)/rooms/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Maximize2, Bed, Users } from 'lucide-react'
import { Media } from '@/components/Media'

const getAllRooms = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const rooms = await payload.find({
      collection: 'rooms',
      limit: 100,
      depth: 2,
    })
    return rooms.docs
  },
  ['all-rooms'],
  {
    tags: ['rooms'],
    revalidate: 600, // optional: revalidate every 10 minutes
  },
)

export default async function RoomsPage() {
  const rooms = await getAllRooms()

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">ACCOMMODATION</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Rooms & Suites</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of luxurious rooms and suites, each designed for your ultimate
            comfort and relaxation.
          </p>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden rounded-xl">
                  {room.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}

                  {room.gallery && <Media resource={room.gallery[0].image} />}
                </div>

                <CardContent className="p-6">
                  {/* Room Type */}
                  <p className="text-xs uppercase tracking-wider text-primary mb-2">{room.type}</p>

                  {/* Room Name */}
                  <h3 className="text-xl font-semibold mb-3">{room.name}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b">
                    {room.features?.squareFeet && (
                      <div className="flex items-center gap-1">
                        <Maximize2 className="h-4 w-4" />
                        <span>{room.features.squareFeet} ft²</span>
                      </div>
                    )}
                    {room.features?.beds && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{room.features.beds}</span>
                      </div>
                    )}
                    {room.features?.guests && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{room.features.guests}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">${room.pricePerNight}</span>
                      <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/rooms/${room.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rooms available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// SEO
export const metadata = {
  title: 'Rooms & Suites | Luxury Hotel',
  description: 'Explore our collection of luxurious rooms and suites',
}
