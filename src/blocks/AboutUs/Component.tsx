// components/blocks/AboutUsBlock.tsx
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { AboutUsBlockProp } from '@/payload-types'

export const AboutUsBlock: React.FC<AboutUsBlockProp> = (prop) => {
  const {
    preTitle,
    title,
    subtitle,
    imageMain,
    imageFloating,
    body,
    philosophyTitle,
    philosophyText,
    gallery,
    closingText,
    ctaText,
    ctaLink,
  } = prop

  return (
    <section className="">
      <div className="container">
        {/* Header */}
        <div className="max-w-xl lg:translate-x-32">
          <p className="text-2xl font-semibold text-muted-foreground mb-4">{preTitle}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
            {title}
          </h1>
        </div>

        {/* Images */}
        <div className="relative mt-12 flex gap-8">
          <div className="max-lg:-translate-x-20">
            <Media resource={imageMain} className="rounded-xl shadow-2xl" />
          </div>
          <div className="aspect-[1.5/1.4] w-[max(30vw,220px)] translate-y-20 max-lg:absolute max-lg:right-0 max-lg:border-[16px] max-lg:border-white/20 lg:-translate-y-20">
            <Media
              resource={imageFloating}
              className="h-full w-full rounded-xl object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* Body */}
        {body && (
          <div className="mt-28 max-w-xl lg:mt-10 lg:translate-x-32">
            <RichText data={body} className="text-lg" />
          </div>
        )}

        {/* Philosophy */}
        <div className="mt-16 space-y-8 lg:space-y-10">
          <h2 className="max-w-xl text-2xl md:text-3xl font-semibold lg:translate-x-32">
            {philosophyTitle}
          </h2>
          {philosophyText && (
            <div className="max-w-xl lg:translate-x-32">
              <RichText data={philosophyText} className="text-lg" />
            </div>
          )}

          {/* Gallery */}
          <div className="grid gap-6 py-10 md:grid-cols-2">
            {gallery?.map((item: any, i: number) => (
              <Media key={i} resource={item.image} className="rounded-xl shadow-xl" />
            ))}
          </div>

          {/* Closing */}
          <div className="ml-auto max-w-xl space-y-6 lg:-translate-x-32">
            {closingText && <RichText data={closingText} className="text-lg" />}
            <Link
              href={ctaLink || '#'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
            >
              {ctaText}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
