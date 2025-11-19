import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'
import { unstable_cache } from 'next/cache'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { AnyMxRecord } from 'node:dns'
import { Pages } from '@/collections/Pages'


const fetchPageBySlug = async (slugSegment: string, draft: boolean) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slugSegment,
      },
    },
    draft,
    limit: 1,
    overrideAccess: draft,
    depth: 2,
  })

  return result.docs[0] ?? null
}

// Fetch function for all pages (for generateStaticParams)
const fetchAllPages = async () => {
  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    select: {
      slug: true,
      breadcrumbs: true,
    },
  })

  return pages.docs
}

const fetchContactInfo = async () => {
  const payload = await getPayload({ config: configPromise })

  const contactInfo = await payload.findGlobal({
    slug: 'contact-info',
  })

  return contactInfo
}


// ✅ NEW: Cached getter for contact info
const getContactInfo = async () =>
  unstable_cache(
    fetchContactInfo,
    ['contact-info'],
    {
      tags: ['contact-info'],
    },
  )()

// Cached getter - only caches in production (non-draft mode)
const getPage = async (slugSegment: string, draft?: boolean) =>
  draft
    ? fetchPageBySlug(slugSegment, draft)
    : unstable_cache(
        async () => fetchPageBySlug(slugSegment, false),
        [`page-${slugSegment}`],
        {
          tags: [`page-${slugSegment}`, 'pages'],
        },
      )()

export async function generateStaticParams() {
let pages:any = []
  try {
    const getPages = unstable_cache(fetchAllPages, ['pages'], {
      tags: ['pages'],
    })
    pages = await getPages()
  } catch (error) {
    console.error('Failed to fetch pages for static generation:', error)
    return [] // Return empty to avoid build crash
  }


  console.log("all pages", Pages)

  return pages
    .map((page:any) => {
      const breadcrumbUrl = page.breadcrumbs?.[page.breadcrumbs.length - 1]?.url
      if (breadcrumbUrl) {
        const segments = breadcrumbUrl.split('/').filter(Boolean)
        return { slug: segments }
      }

      if (page.slug && page.slug !== 'home') {
        return { slug: [page.slug] }
      }

      if (page.slug === 'home') {
        return { slug: [] } // Home page should be empty array for root
      }

      return null
    })
    .filter(Boolean)
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}



export default async function Page({ params: paramsPromise }: Args) {
  const { slug = [] } = await paramsPromise
  const { isEnabled: draft } = await draftMode()

  // Extract the LAST segment
  const lastSegment = slug[slug.length - 1] || 'home'
  const url = `/${slug.join('/')}`

  const [page, contactInfo] = await Promise.all([
    getPage(lastSegment, draft),
    getContactInfo(), 
  ])

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout, breadcrumbs, title } = page
  

  return (
    <article>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} breadcrumbs={breadcrumbs} currentPage={title} />
      {layout && Array.isArray(layout) && <RenderBlocks blocks={layout} contactInfo={contactInfo}/>}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = [] } = await paramsPromise
  const { isEnabled: draft } = await draftMode()

  const lastSegment = slug[slug.length - 1] || 'home'

  const page = await getPage(lastSegment, draft)

  return generateMeta({ doc: page })
}