'use client'
import React from 'react'
import { Media } from '@/components/Media'

export type AboutMissionBlockProps = {
  blockType: 'aboutMission'
  heroSection: {
    heading: string
    description: string
  }
  missionSection: {
    image?: any
    label: string
    description: string
  }
  valuesSection: {
    heading: string
    description: string
    values: {
      id: string
      icon: string // We'll use lucide icon names as strings
      title: string
      description: string
    }[]
  }
  ctaSection: {
    label: string
    heading: string
    image?: any
    description: string
  }
}

// Icon mapper for lucide icons
const IconMapper: React.FC<{ iconName: string }> = ({ iconName }) => {
  const icons: { [key: string]: React.ReactNode } = {
    files: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
        <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"></path>
        <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"></path>
      </svg>
    ),
    'circle-arrow-right': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 12h8"></path>
        <path d="m12 16 4-4-4-4"></path>
      </svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
    target: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    shield: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
      </svg>
    ),
  }

  return <>{icons[iconName] || icons.settings}</>
}

export const AboutMissionBlock: React.FC<AboutMissionBlockProps> = ({
  heroSection,
  missionSection,
  valuesSection,
  ctaSection,
}) => {
  return (
    <section className="py-32">
      <div className="container flex flex-col gap-28">
        {/* Hero Section */}
        <div className="flex flex-col gap-7">
          <h1 className="text-4xl font-semibold lg:text-7xl">
            {heroSection.heading}
          </h1>
          <p className="max-w-xl text-lg">{heroSection.description}</p>
        </div>

        {/* Mission Section - Image + Card */}
        <div className="grid gap-6 md:grid-cols-2">
          {missionSection.image ? (
            <Media
              resource={missionSection.image}
              className="size-full max-h-96 rounded-2xl object-cover"
              imgClassName="size-full max-h-96 rounded-2xl object-cover"
            />
          ) : (
            <div className="size-full max-h-96 rounded-2xl bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Mission Image</span>
            </div>
          )}
          
          <div className="bg-muted flex flex-col justify-between gap-10 rounded-2xl p-10">
            <p className="text-muted-foreground text-sm">{missionSection.label}</p>
            <p className="text-lg font-medium">{missionSection.description}</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="flex flex-col gap-6 md:gap-20">
          <div className="max-w-xl">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              {valuesSection.heading}
            </h2>
            <p className="text-muted-foreground">{valuesSection.description}</p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {valuesSection.values.map((value) => (
              <div key={value.id} className="flex flex-col">
                <div className="bg-accent mb-5 flex size-12 items-center justify-center rounded-2xl">
                  <IconMapper iconName={value.icon} />
                </div>
                <h3 className="mb-3 mt-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground mb-10 text-sm font-medium">
              {ctaSection.label}
            </p>
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              {ctaSection.heading}
            </h2>
          </div>
          <div>
            {ctaSection.image ? (
              <Media
                resource={ctaSection.image}
                className="mb-6 max-h-36 w-full rounded-xl object-cover"
                imgClassName="mb-6 max-h-36 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mb-6 max-h-36 w-full rounded-xl bg-muted flex items-center justify-center h-36">
                <span className="text-muted-foreground text-sm">CTA Image</span>
              </div>
            )}
            <p className="text-muted-foreground">{ctaSection.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}