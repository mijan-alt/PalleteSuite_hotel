'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { Cta1 } from '@/payload-types'
import Link from 'next/link'

interface CtaProps {
  heading: string
  description: string
  primaryButton: {
    text: string
    link: string
  }
  secondaryButton: {
    text: string
    link: string
  }
}

export const Cta1Section: React.FC<Cta1> = (props) => {
  const { heading, description, primaryButton, secondaryButton } = props

  return (
    <section className="px-4 sm:px-6  sm:py-16">
      <div className="container overflow-hidden">
        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-6 overflow-hidden rounded-xl border bg-muted/50 md:flex-row">
          {/* Text Content */}
          <div className="max-w-xl self-center p-6 md:p-12">
            <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">{heading}</h2>
            <p className="mt-3 text-muted-foreground md:mt-4 md:text-lg">{description}</p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href={primaryButton.link}>
                <Button className="w-full sm:w-auto">{primaryButton.text}</Button>
              </Link>
              <Link href={primaryButton.link}>
                <Button variant="outline" className="w-full sm:w-auto">
                  <span className="flex items-center">
                    {secondaryButton.text}
                    <Play className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative ml-4 max-h-80 md:ml-6 md:mt-8 md:max-h-96">
            {/* <Image
              src="/assets/abstractpattern.avif"
              alt="Decorative element"
              width={387}
              height={580}
              className="absolute -bottom-12 left-4 h-36 -translate-x-1/2 -rotate-[120deg] "
            /> */}
            <Image
              src="/assets/abstractpattern.avif"
              alt="Platform screenshot"
              width={387}
              height={580}
              className="z-10  rounded-tl-xl h-full w-full border-t border-l object-cover pt-3 pl-3 backdrop-blur-sm md:pt-3.5 md:pl-3.5"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
