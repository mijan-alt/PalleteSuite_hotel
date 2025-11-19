// src/components/blocks/RoomsGridBlock.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Maximize2, Bed, Users } from 'lucide-react'
import { Media } from '@/components/Media'
import { Room } from '@/payload-types'

interface RoomsGridBlockProps {
  heading?: string | null
  description?: string | null
  selectedRooms?: Room[] // Explicitly type as Room array, not number | Room
  columns?: '2' | '3' | '4'
}

export function RoomsGridBlock({
  heading,
  description,
  selectedRooms,
  columns = '2',
}: RoomsGridBlockProps) {
  const gridCols = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-4',
  }[columns]

  console.log("selected rooms", selectedRooms)

  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Rooms Grid */}
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {selectedRooms?.map((room) => {

            // Get the first gallery image
            console.log("gallery" , room.gallery)
            const firstImage = room.gallery?.[0]?.image

            console.log("first image", firstImage)
            
            return (
              // <Link
              //   key={room.id}
              //   href={`/rooms/${room.slug}`}
              //   className="group block"
              // >
              //   <div className="relative h-80 rounded-lg overflow-hidden mb-4">
              //     {firstImage && (
              //       <Media
              //         resource={firstImage}
              //         className="object-cover group-hover:scale-110 transition-transform duration-500"
              //       />
              //     )}

              //     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              //     {/* Overlay Content */}
              //     <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              //       <h3 className="text-2xl font-bold mb-2">{room.name}</h3>

              //       {/* Features */}
              //       <div className="flex items-center gap-4 text-sm mb-3">
              //         {room.features?.squareFeet && (
              //           <div className="flex items-center gap-1">
              //             <Maximize2 className="h-4 w-4" />
              //             <span>{room.features.squareFeet} ft²</span>
              //           </div>
              //         )}
              //         {room.features?.beds && (
              //           <div className="flex items-center gap-1">
              //             <Bed className="h-4 w-4" />
              //             <span>{room.features.beds}</span>
              //           </div>
              //         )}
              //         {room.features?.guests && (
              //           <div className="flex items-center gap-1">
              //             <Users className="h-4 w-4" />
              //             <span>{room.features.guests}</span>
              //           </div>
              //         )}
              //       </div>

              //       {/* Price */}
              //       <div className="flex items-baseline gap-1">
              //         <span className="text-3xl font-bold">
              //           ${room.pricePerNight}
              //         </span>
              //         <span className="text-sm">/night</span>
              //       </div>
              //     </div>
              //   </div>
              // </Link>

               <div
              key={room.id}
              className="overflow-hidden group  transition-shadow duration-300 bg-white"
            >
              {/* Image */}
              <div className="relative h-96 overflow-hidden rounded-xl">

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
            )
          })}
        </div>
      </div>
    </section>
  )
}