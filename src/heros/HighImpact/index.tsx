// src/components/blocks/HeroWithMaskedImage.tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media' // Payload's built-in Media component
import { HeroProps } from '../heroType'
const maskSvg = `data:image/svg+xml,%3Csvg width='1528' height='700' viewBox='0 0 1528 700' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.589399 112.279C0.589402 82.1213 25.037 57.6738 55.1946 57.6738H335.688C350.06 57.6738 361.712 46.0226 361.712 31.6502C361.712 14.2835 375.79 0.205078 393.157 0.205078H949.833C983.496 0.205078 1010.78 27.4941 1010.78 61.1568C1010.78 89.0156 1033.37 111.6 1061.23 111.6H1472.74C1502.9 111.6 1527.35 136.047 1527.35 166.205V629.438C1527.35 659.596 1502.9 684.044 1472.74 684.044H639.176C619.635 684.044 603.794 668.203 603.794 648.662C603.794 629.122 587.954 613.281 568.413 613.281H55.1945C25.0369 613.281 0.589358 588.833 0.58936 558.676L0.589399 112.279Z' fill='%23D9D9D9'/%3E%3C/svg%3E`

export const HighImpactHero = (props: HeroProps) => {
  const { heading = 'Find Your Perfect Home in Your City', media, media1, media2 } = props

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="container relative">
        {/* Headline */}
        <div className="max-w-2xl mb-8 ">
          <h1
            className="font-playfair text-5xl lg:text-6xl tracking-tighter text-left leading-tight"
            dangerouslySetInnerHTML={{
              __html:
                // Safe fallback chain + replace newlines with responsive <br>
                (heading ?? 'Find Your Perfect Home in Your City').replace(
                  /\r?\n/g,
                  '<br class="hidden md:block" />',
                ),
            }}
          />
        </div>

        <div className="relative mt-10 lg:mt-0 lg:-translate-y-4">
          {/* Masked Main Image */}
          <div
            className="pointer-events-none relative mx-auto w-full max-w-7xl"
            style={{
              aspectRatio: '1528/700',
              maskImage: `url("${maskSvg}")`,
              WebkitMaskImage: `url("${maskSvg}")`,
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
            }}
          >
            <Media
              resource={media}
              fill
              className="object-cover"
              priority
              imgClassName="object-cover"
            />
          </div>

          {/* Floating Images – Desktop (hidden on <lg) */}

          {/* <div className="mt-8 flex gap-6  absolute -top-20 md:-top-20 right-0">
            <div className="relative h-44 w-full overflow-hidden rounded-3xl">
              <Media resource={media1} fill className="object-cover" />
            </div>
            <div className="relative h-44 w-full overflow-hidden rounded-3xl">
              <Media resource={media2} fill className="object-cover" />
            </div>
          </div> */}

          {/* Floating Images – Mobile */}
          <div className="mt-8 flex gap-6 lg:hidden">
            <div className="relative h-44 w-full overflow-hidden rounded-3xl">
              <Media resource={media1} fill className="object-cover" />
            </div>
            <div className="relative h-44 w-full overflow-hidden rounded-3xl">
              <Media resource={media2} fill className="object-cover" />
            </div>
          </div>

          {/* CTA Button */}
          <Button
            asChild
            size="lg"
            className="group absolute bottom-0 left-0 -mb-6 lg:-mb-0 lg:bottom-3 bg-primary hover:bg-secondary  text-white rounded-full px-8"
          >
            <Link href="/appointment">
              Book Appointment{' '}
              <ArrowRight className="ml-2 size-4 -rotate-45 transition-transform group-hover:rotate-0" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
