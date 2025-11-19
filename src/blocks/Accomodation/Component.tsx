// src/components/blocks/AccommodationsBlock.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Accommodation {
  room: {
    id: string
    name: string
    slug: string
    pricePerNight: number
    gallery: Array<{
      image: {
        url: string
        alt?: string
      }
    }>
  }
  customImage?: {
    url: string
    alt?: string
  }
}

interface AccommodationsBlockProps {
  eyebrow?: string
  heading: string
  description?: string
  accommodations: Accommodation[]
  cta?: {
    text: string
    link: string
  }
}

export function AccommodationsBlock({
  eyebrow,
  heading,
  description,
  accommodations,
  cta,
}: AccommodationsBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === accommodations.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? accommodations.length - 1 : prev - 1))
  }

  const currentAccommodation = accommodations[currentIndex]
  const imageUrl =
    currentAccommodation.customImage?.url || currentAccommodation.room.gallery[0]?.image.url

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          {eyebrow && (
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">{eyebrow}</p>
          )}
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{heading}</h2>
          {description && <p className="text-lg text-muted-foreground">{description}</p>}
        </div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Image */}
          <div className="relative h-[500px] rounded-lg overflow-hidden mb-6">
            <Image
              src={imageUrl || '/placeholder.jpg'}
              alt={currentAccommodation.room.name}
              fill
              className="object-cover"
            />

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </button>

            {/* Room Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                {currentAccommodation.room.name}
              </h3>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-2xl font-bold">
                  ${currentAccommodation.room.pricePerNight}
                </span>
                <span className="text-sm">/night</span>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {accommodations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        {cta && (
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-secondary"
            >
              <Link href={cta.link}>{cta.text}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
