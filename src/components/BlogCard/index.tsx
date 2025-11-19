'use client'

import { Blog } from '@/payload-types'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Media } from '@/components/Media'

export type CardPostData = Pick<Blog, 'slug' | 'categories' | 'meta' | 'title' | 'createdAt'>

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const BlogCard: React.FC<{
  doc?: CardPostData
  relationTo?: 'blogs'
  showCategories?: boolean
}> = ({ doc, relationTo = 'blogs', showCategories }) => {
  if (!doc) return null

  const { slug, categories, meta, title, createdAt } = doc
  const { description, image: metaImage } = meta || {}

  const categoryTitle =
    showCategories && categories && categories.length > 0 && typeof categories[0] === 'object'
      ? categories[0].title || 'Uncategorized'
      : undefined

  const href = `/${relationTo}/${slug}`

  return (
    <article className="flex flex-col gap-6 sm:flex-row" aria-labelledby={`blog-title-${slug}`}>
      {/* Image */}
      <div className="shrink-0">
        <Link
          href={href}
          className="block hover:opacity-90 focus:opacity-90 transition-opacity duration-200 focus:outline-2 focus:outline-primary focus:outline-offset-2 underline decoration-transparent hover:decoration-primary focus:decoration-primary"
          aria-label={`Read full article: ${title}`}
        >
          {metaImage && typeof metaImage !== 'string' ? (
            <Media
              resource={metaImage}
              className="aspect-video w-full rounded-lg object-cover sm:w-[260px]"
              alt={`Featured image for ${title}`}
            />
          ) : (
            <div
              className="aspect-video w-full sm:w-[260px] rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground"
              role="img"
              aria-label={`No featured image available for ${title}`}
            >
              No image
            </div>
          )}
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {categoryTitle && (
            <Badge className='bg-accent' variant="secondary" aria-label={`Category: ${categoryTitle}`}>
              {categoryTitle}
            </Badge>
          )}
          <time
            dateTime={createdAt || ''}
            aria-label={`Published on ${formatDate(createdAt || '')}`}
          >
            {formatDate(createdAt || '')}
          </time>
        </div>

        <h3 id={`blog-title-${slug}`} className="text-xl font-bold leading-tight lg:text-2xl">
          <p
            className="text-foreground hover:text-foreground/80 focus:text-foreground/80  transition-all focus:outline-2 "
            aria-label={`Read full article: ${title}`}
          >
            {title}
          </p>
        </h3>

        {description && (
          <p className="text-base text-muted-foreground" aria-describedby={`blog-title-${slug}`}>
            {description}
          </p>
        )}

        <Link
          href={href}
          className="inline-flex items-center text-secondary underline decoration-1 underline-offset-4 hover:text-primary/80 focus:text-primary/80 hover:decoration-primary/80 focus:decoration-primary/80 transition-all focus:outline-2 focus:outline-primary focus:outline-offset-2"
        >
          Read more
          <span className="sr-only"> about {title}</span>
          <ArrowRight className="ml-2 size-4 text-current" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
