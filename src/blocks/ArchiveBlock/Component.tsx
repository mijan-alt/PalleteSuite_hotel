// src/blocks/ArchiveBlock/Component.tsx
import { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { BlogArchive } from '@/components/BlogsArchive'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const ArchiveBlock: React.FC<ArchiveBlockProps & { id?: string }> = async (props) => {
  const { id, categories, limit: limitFromProps = 3, populateBy, selectedDocs } = props

  let posts: any[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })
    const flattenedCategories = categories?.map((c) => (typeof c === 'object' ? c.id : c))

    const fetched = await payload.find({
      collection: 'blogs',
      depth: 2,

      where: flattenedCategories?.length ? { categories: { in: flattenedCategories } } : {},
    })
    posts = fetched.docs
  } else {
    posts = selectedDocs?.filter(Boolean) || []
  }

  if (posts.length === 0) return null

  return (
    <section className="py-24 lg:py-32 overflow-hidden" id={id ? `block-${id}` : undefined}>
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Elegant Header */}
        <div className="text-center mb-20">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">Journal</p>
          <h2 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900">
            Stories from Palette Suite
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Moments, musings, and behind-the-scenes from our sanctuary.
          </p>
        </div>

        <BlogArchive posts={posts} />

        {/* Subtle CTA */}
        <div className="text-center mt-20">
          <Link
            href="/blogs"
            className="inline-flex items-center text-gray-700 hover:text-primary transition-colors duration-300 text-lg font-medium"
          >
            Explore the Journal
            <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
