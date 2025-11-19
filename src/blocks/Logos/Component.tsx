'use client'
import React from 'react'
import { Media } from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

export type LogoShowcaseBlockProps = {
  blockType: 'logoShowcase'
  heading: {
    text: string
    highlightedText?: string
    remainingText?: string
  }
  badge?: {
    text: string
  }
  logos: {
    id: string
    image: any
    alt: string
  }[]
}

export const LogoShowcaseBlock: React.FC<LogoShowcaseBlockProps> = ({
  heading,
  badge,
  logos = [],
}) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  return (
    <section className="py-32">
      <div className="container">
        {/* Heading */}
        <h1 className="text-foreground my-6 max-w-4xl text-4xl font-medium tracking-tighter md:text-6xl">
          {heading.text}
          {heading.highlightedText && (
            <>
              {' '}
              <span className="text-muted-foreground/40">
                {heading.highlightedText}
              </span>
            </>
          )}
          {heading.remainingText && ` ${heading.remainingText}`}
        </h1>

        {/* Badge */}
        {badge && (
          <div className="bg-muted flex w-fit items-center justify-center gap-4 rounded-full px-4 py-2 tracking-tight transition-all ease-in-out hover:gap-6">
            <span className="bg-foreground inline-block size-3 rounded-full"></span>
            <p className="text-foreground">{badge.text}</p>
          </div>
        )}

        {/* Logo Carousel */}
        <div className="relative mx-auto flex items-center justify-center pt-8">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[plugin.current]}
            className="relative w-full"
          >
            <CarouselContent className="ml-0">
              {logos.map((logo, index) => (
                <CarouselItem
                  key={logo.id}
                  className="h-35 border-border relative flex basis-1/2 justify-center border border-r-0 pl-0 sm:basis-1/4 md:basis-1/3 lg:basis-1/6"
                >
                  <div className="flex flex-col items-center justify-center lg:mx-10">
                    <p className="absolute left-2 top-2 text-xs tracking-tighter">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    {logo.image ? (
                      <Media
                        resource={logo.image}
                        className="h-7 w-auto dark:invert"
                        imgClassName="h-7 w-auto dark:invert object-contain"
                      />
                    ) : (
                      <div className="h-7 w-20 bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Logo {index + 1}</span>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Gradient Overlays */}
            <div className="bg-gradient-to-r from-background absolute inset-y-0 left-0 w-32 to-transparent pointer-events-none"></div>
            <div className="bg-gradient-to-l from-background absolute inset-y-0 right-0 w-32 to-transparent pointer-events-none"></div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}