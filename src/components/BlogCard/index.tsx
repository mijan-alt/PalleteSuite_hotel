// src/components/BlogCard.tsx
'use client'

import Link from 'next/link'
import { Media } from '@/components/Media'
import { ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export const BlogCard = ({ post, isReversed = false }: { post: any; isReversed?: boolean }) => {
  const { title, meta, publishedAt, slug, categories } = post
  const { description, image } = meta || {}

  const category = categories?.[0]
  const categoryName = typeof category === 'object' ? category.title : undefined

  return (
    <article
      className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Image — Full bleed luxury */}
      <div className="overflow-hidden rounded-none group">
        <Link href={`/blogs/${slug}`}>
          <div className="aspect-[4/3] lg:aspect-[5/3] relative overflow-hidden">
            {image && typeof image !== 'string' ? (
              <Media resource={image} fill className="object-cover " alt={title} />
            ) : (
              <div className="bg-gray-100 w-full h-full" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>
      </div>

      {/* Content — Spacious & refined */}
      <div className="flex flex-col justify-center space-y-8 py-8">
        <div className="space-y-4">
          {categoryName && (
            <p className="text-sm tracking-widest uppercase text-red-700 font-medium">
              {categoryName}
            </p>
          )}
          <h3 className="text-4xl md:text-5xl font-light leading-tight text-gray-900">
            <Link
              href={`/blogs/${slug}`}
              className="hover:text-gray-700 transition-colors duration-300"
            >
              {title}
            </Link>
          </h3>
          {publishedAt && (
            <time className="text-gray-500 text-sm tracking-wide">
              {format(new Date(publishedAt), 'MMMM d, yyyy')}
            </time>
          )}
        </div>

        {description && (
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">{description}</p>
        )}

        <Link
          href={`/blogs/${slug}`}
          className="inline-flex items-center text-gray-900 hover:text-red-700 font-medium text-lg group"
        >
          Read the story
          <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </article>
  )
}
