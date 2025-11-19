'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Media } from '@/components/Media'

export type Cta3BlockProps = {
  blockType: 'cta3'
  image?: any // Media type from Payload
  heading: string
  description?: string
  button: {
    label: string
    link?: {
      type?: 'reference' | 'custom'
      url?: string
      reference?: any
      newTab?: boolean
    }
  }
  imagePosition?: 'left' | 'right'
}

export const Cta3Block: React.FC<Cta3BlockProps> = ({
  image,
  heading,
  description,
  button,
  imagePosition = 'left',
}) => {

  const getHref = () => {
    if (!button.link) return '#'
    
    if (button.link.type === 'custom' && button.link.url) {
      return button.link.url
    }
    
    if (button.link.type === 'reference' && button.link.reference) {
      const ref = button.link.reference
      if (typeof ref.value === 'string') {
        return ref.value
      }
      if (typeof ref.value === 'object' && ref.value?.slug) {
        return `/${ref.value.slug}`
      }
    }
    
    return '#'
  }

  const buttonHref = getHref()
  const buttonLabel = button?.label || 'Get Started'
  const openInNewTab = button?.link?.newTab

  return (
    <section className="">
      <div className="container">
        <div className="bg-muted flex w-full flex-col overflow-hidden rounded-lg md:rounded-xl lg:flex-row lg:items-center">
          {/* Image Section */}
          <div
            className={`w-full shrink-0 self-stretch lg:w-1/2 ${
              imagePosition === 'right' ? 'lg:order-2' : ''
            }`}
          >
            {image ? (
              <Media
                resource={image}
                className="aspect-3/2 w-full object-cover"
                imgClassName="aspect-3/2 w-full object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg"
              />
            ) : (
              <div className="aspect-3/2 w-full rounded-t-lg bg-muted-foreground/10 flex items-center justify-center md:rounded-t-none md:rounded-l-lg">
                <span className="text-muted-foreground text-sm">Image placeholder</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div
            className={`w-full shrink-0 px-4 py-6 md:p-8 lg:w-1/2 lg:px-16 ${
              imagePosition === 'right' ? 'lg:order-1' : ''
            }`}
          >
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">{heading}</h3>

            {description && <p className="text-muted-foreground mb-8 lg:text-lg">{description}</p>}

            {button && (
              <Button asChild>
                <Link
                  href={buttonHref}
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {buttonLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
