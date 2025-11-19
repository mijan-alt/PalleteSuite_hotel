// components/blocks/AboutSectionBlock.tsx
import { AboutSectionProps } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export function AboutSectionBlock(props: AboutSectionProps) {
  const {
    heading = 'Our Story',
    tagline = '',
    heroImage,
    sectionSubtitle,
    highlightedStatement = '',
    mainContent,
  } = props

  return (
    <section className="">
      <div className="container mx-auto max-w-7xl px-6 space-y-16 lg:space-y-24">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12 items-center">
          <h1 className="col-span-2 text-5xl lg:text-7xl xl:text-8xl font-semibold tracking-tighter">
            {heading}
          </h1>
          <div className="col-span-4 flex items-center">
            <p className="text-lg text-slate-600 whitespace-pre-line">{tagline}</p>
          </div>
        </div>

        {/* Hero Image – Using Payload's Media component */}
        <div className="relative h-96 lg:h-[600px] rounded-xl overflow-hidden shadow-2xl">
          {heroImage && typeof heroImage === 'object' && (
            <Media
              resource={heroImage}
              size="full" // uses the original uploaded file
              imgClassName="object-cover w-full h-full"
              priority
            />
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {sectionSubtitle && (
            <p className="hidden lg:block text-zinc-600 italic text-lg">{sectionSubtitle}</p>
          )}

          <div className="col-span-1 lg:col-span-3">
            <h2 className="text-3xl lg:text-4xl font-medium leading-tight text-zinc-900">
              {highlightedStatement}
            </h2>
          </div>

          <div className="col-span-1 lg:col-span-2 lg:pl-12">
            <RichText data={mainContent} className="text-zinc-700 text-lg leading-relaxed" />
          </div>
        </div>
      </div>
    </section>
  )
}
