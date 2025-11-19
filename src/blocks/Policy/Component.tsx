'use client'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type PolicyBlockProps = {
  blockType: 'policy'
  header: {
    badge?: string
    heading: string
  }
  features: {
    id: string
    icon: string
    title: string
    description: string
  }[]
  cta?: {
    text: string
    url: string
  }
}

// Icon mapper for lucide icons
const IconMapper: React.FC<{ iconName: string }> = ({ iconName }) => {
  const icons: { [key: string]: React.ReactNode } = {
    'shield-check': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 md:size-6" aria-hidden="true">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    ),
    'heartbeat': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 md:size-6" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path>
      </svg>
    ),
    'megaphone': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 md:size-6" aria-hidden="true">
        <path d="m3 11 18-5v12L3 14v-3z"></path>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
      </svg>
    ),
    'scale': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 md:size-6" aria-hidden="true">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
        <path d="M7 21h10"></path>
        <path d="M12 3v18"></path>
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
      </svg>
    ),
    'handshake': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 md:size-6" aria-hidden="true">
        <path d="m11 17 2 2a1 1 0 1 0 3-3"></path>
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path>
        <path d="m21 3 1 11h-2"></path>
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path>
        <path d="M3 4h8"></path>
      </svg>
    ),
    'file-text': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 md:size-6" aria-hidden="true">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <path d="M10 9H8"></path>
        <path d="M16 13H8"></path>
        <path d="M16 17H8"></path>
      </svg>
    ),
  }

  return <>{icons[iconName] || icons['shield-check']}</>
}

export const PolicyBlock: React.FC<PolicyBlockProps> = ({
  header,
  features = [],
  cta,
}) => {
  return (
    <section className="">
      <div className="container">
        {/* Header Section */}
        <div className="mb-12 flex max-w-3xl flex-col gap-4">
          {header.badge && (
            <Badge className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 border-transparent bg-secondary text-secondary-foreground">
              {header.badge}
            </Badge>
          )}
          <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl">
            {header.heading}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid gap-12 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.id} className="flex gap-6 space-y-4 rounded-lg md:block">
              <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full md:size-12">
                <IconMapper iconName={feature.icon} />
              </span>
              <div>
                <h3 className="font-medium md:mb-2 md:text-xl">{feature.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {cta && (
          <div className="mt-16 flex justify-center">
            <Button asChild className="h-10 rounded-md px-6">
              <a href={cta.url}>{cta.text}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}