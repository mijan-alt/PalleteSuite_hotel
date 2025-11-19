// src/components/blocks/WelcomeBlock.tsx
import { Check, Star, Heart } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface WelcomeBlockProps {
  eyebrow?: string
  heading: string
  description: any // Rich text
  features?: Array<{
    icon: 'check' | 'star' | 'heart'
    text: string
  }>
}

const icons = {
  check: Check,
  star: Star,
  heart: Heart,
}

export function WelcomeBlock({
  eyebrow,
  heading,
  description,
  features,
}: WelcomeBlockProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4 text-center">
              {eyebrow}
            </p>
          )}

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
            {heading}
          </h2>

          {/* Description */}
          <div className="prose prose-lg mx-auto text-center mb-8 text-muted-foreground">
            {typeof description === 'string' ? (
              <p>{description}</p>
            ) : (
              // Render rich text content
              <div dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </div>

          {/* Features */}
          {features && features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              {features.map((feature, index) => {
                const Icon = icons[feature.icon] || Check
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-accent/50"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-sm">{feature.text}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}