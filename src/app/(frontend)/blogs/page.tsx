import type { Metadata } from 'next/types'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { BlogArchive } from '@/components/BlogsArchive'
import { SectionHero } from '@/components/sections/SectionHero'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'blogs',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      createdAt: true,
    },
  })

  console.log('docs', posts.docs)

  return (
    <>
      <SectionHero backgroundImage="/assets/donate.png" title="Opinions" slug="blogs" />
      <div className="pt-24 pb-24">
        <div className="container mb-8">
          {/* <PageRange
        
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        /> */}
        </div>

        <div className=" mx-auto px-4 max-w-7xl">
          <BlogArchive posts={posts.docs} />
        </div>

        <div className="container">
          {posts.totalPages > 1 && posts.page && (
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </div>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Latest Web Design & SEO Articles`,
  }
}
