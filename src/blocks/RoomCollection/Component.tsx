// src/components/blocks/RoomsCollectionBlock.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Maximize2, Bed, Users } from 'lucide-react'
import { Room } from '@/payload-types'
import { Media } from '@/components/Media'


interface RoomsCollectionBlockProps {
  eyebrow?: string
  heading: string
  selectedRooms: Room[]
  layout?: 'grid-3' | 'grid-4' | 'carousel'
}

export function RoomsCollectionBlock({
  eyebrow,
  heading,
  selectedRooms,
  layout = 'grid-3',
}: RoomsCollectionBlockProps) {
  const gridCols = layout === 'grid-4' ? 'md:grid-cols-4' : 'md:grid-cols-3'

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {eyebrow && (
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl font-bold">{heading}</h2>
        </div>

        {/* Rooms Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8`}>
          {selectedRooms.map((room) => (
            <div
              key={room.id}
              className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden rounded-xl">

                <Media
                  resource={room.gallery[0].image}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* <Image
                  src={room.gallery[0]?.image?.url || '/placeholder.jpg'}
                  alt={room.gallery[0]?.image.alt || room.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                /> */}
              </div>

              <div className="p-6">
                {/* Room Name */}
                <h3 className="text-xl font-semibold mb-2">{room.name}</h3>

                {/* Features */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {room?.features?.squareFeet && (
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
                      <span>{room.features.guests} Guests</span>
                    </div>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold ">
                      ${room.pricePerNight}
                    </span>
                    <span className="text-sm text-muted-foreground">/night</span>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/rooms/${room.slug}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}