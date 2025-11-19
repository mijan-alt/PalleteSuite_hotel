'use client'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'

export type ServicesBlockProps = {
  blockType: 'servicesBlock'
  badge?: string
  heading: string
  description?: string
  services: {
    id: string
    icon?: any // Media type from Payload
    title: string
    description: string
    link?: {
      type?: 'reference' | 'custom'
      url?: string
      reference?: any
      label?: string
    }
  }[]
}

export const ServicesBlock: React.FC<ServicesBlockProps> = ({
  badge,
  heading,
  description,
  services = [],
}) => {
  return (
    <section className=" relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
      </div>

      {/* Header Content */}
      <div className="container relative flex flex-col items-center text-center">
        {badge && (
          <Badge className="bg-secondary text-black inline-flex items-center justify-center rounded-full border w-fit whitespace-nowrap shrink-0 gap-1 px-4 py-1.5 text-xs font-medium uppercase mb-4">
            {badge}
          </Badge>
        )}

        <h1 className="my-4 max-w-3xl text-pretty text-2xl font-bold sm:text-4xl md:my-6 lg:text-5xl">
          {heading}
        </h1>

        {description && (
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>

      {/* Services Grid */}
      <div className="container mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
        {services.map((service, index) => {
          const href = service.link?.url || '#'
          const linkLabel = service.link?.label || 'See more'

          return (
            <Link
              key={service.id}
              href={href}
              className={`bg-background/70 relative flex flex-col items-center rounded-xl border px-6 py-10 text-center backdrop-blur-sm lg:px-8 lg:py-12 transition-transform hover:scale-105 ${
                index === 1 ? 'md:translate-y-4' : ''
              }`}
            >
              {/* Icon */}
              <div className="mb-6 flex aspect-square w-16 items-center justify-center md:w-20 lg:mb-8">
                {service.icon ? (
                  <Media
                    resource={service.icon}
                    className="h-full w-full object-contain object-center"
                    imgClassName="h-full w-full object-contain object-center "
                  />
                ) : (
                  <div className="h-full w-full rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-lg font-semibold md:text-xl">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground mb-auto text-sm">
                {service.description}
              </p>

              {/* Link */}
              <div className="text-primary mt-8 flex items-center md:mt-10">
                <span className="font-medium">{linkLabel}</span>
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}