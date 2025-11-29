// src/components/blocks/AmenitiesCarousel.client.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { HotelAmenity } from '@/payload-types'
import { CarouselPrevious, CarouselNext } from '@/components/ui/carousel'

// Exact shape Payload returns from global.amenities[]

export function AmenitiesCarouselClient({ title, subtitle, amenities }: any) {
  const plugin = React.useRef(
    Autoplay({
      delay: 8500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  )

  return (
    <section className="relative w-full py-24 overflow-hidden">
      {(title || subtitle) && (
        <div className="text-center mb-16">
          {title && <h2 className="text-5xl md:text-6xl font-light tracking-tight">{title}</h2>}
          {subtitle && <p className="mt-4 text-xl opacity-80">{subtitle}</p>}
        </div>
      )}

      <Carousel
        plugins={[plugin.current]}
        opts={{ align: 'center', loop: true }}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.reset()}
      >
        <CarouselPrevious className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white transition-all" />
        <CarouselNext className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white transition-all" />
        <CarouselContent className="-ml-4 md:-ml-8">
          {amenities?.map((amenity: any) => (
            <CarouselItem
              key={amenity.id}
              className="pl-4 md:pl-8 basis-[88%] md:basis-[70%] lg:basis-[60%]"
            >
              <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-3xl">
                {amenity.image && (
                  <>
                    <Media
                      resource={amenity.image}
                      fill
                      imgClassName="object-cover brightness-75 transition-transform duration-1000 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white">
                    {amenity.title}
                  </h3>
                  {amenity.description && (
                    <p className="mt-4 text-lg md:text-xl font-light opacity-90 max-w-lg">
                      {amenity.description}
                    </p>
                  )}
                  {amenity.link && (
                    <Button
                      asChild
                      size="lg"
                      className="mt-8 w-fit rounded-full bg-white text-black hover:bg-gray-100"
                    >
                      <Link href={amenity.link}>
                        Discover
                        <ArrowRight className="ml-3 size-5 -rotate-45 transition-all group-hover:rotate-0 group-hover:ml-5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {amenities?.map((_: any, i: any) => (
          <button key={i}>
            <span className="block h-2 w-2 rounded-full bg-white/50 transition-all data-[active]:bg-white data-[active]:w-12" />
          </button>
        ))}
      </div>
    </section>
  )
}
