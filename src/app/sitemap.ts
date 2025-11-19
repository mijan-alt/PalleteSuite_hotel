import { getPayload } from 'payload'
import config from '@payload-config'
import type { MetadataRoute } from 'next'

const normalizeUrl = (url: string) => url.replace(/\/+$/, '').replace(/^https?:\/\//, 'https://')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const SITE_URL = normalizeUrl(
    process.env.NEXT_PUBLIC_SERVER_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL 
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
        : 'https://webdesigngrid.com')
  )

  try {
    // Fetch pages
    const pages = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 1, // Increase depth to get breadcrumbs data
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
        breadcrumbs: true,
      },
    })

    // Fetch blog posts
    const blogs = await payload.find({
      collection: 'blogs',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    console.log(`Generating sitemap with ${pages.docs.length} pages and ${blogs.docs.length} blogs`)

    // Helper to construct full path from breadcrumbs
    const getFullPath = (page: any): string => {
      if (page.slug === 'home') return '/'
      
      // If breadcrumbs exist, use the last one's URL
      if (page.breadcrumbs && page.breadcrumbs.length > 0) {
        const lastBreadcrumb = page.breadcrumbs[page.breadcrumbs.length - 1]
        return lastBreadcrumb.url || `/${page.slug}`
      }
      
      return `/${page.slug}`
    }

    // Build page entries
    const pageEntries: MetadataRoute.Sitemap = pages.docs
      .filter(page => page?.slug)
      .map(page => {
        const pageUrl = getFullPath(page)

        return {
          url: `${SITE_URL}${pageUrl}`,
          lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: pageUrl === '/' ? 1.0 : 0.8,
        }
      })

    // Build blog entries
    const blogEntries: MetadataRoute.Sitemap = blogs.docs
      .filter(blog => blog?.slug)
      .map(blog => {
        return {
          url: `${SITE_URL}/blogs/${blog.slug}`,
          lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }
      })

    // Add static pages
    const staticEntries: MetadataRoute.Sitemap = [
      {
        url: `${SITE_URL}/search`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      },
      {
        url: `${SITE_URL}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
    ]

    const allEntries = [...pageEntries, ...blogEntries, ...staticEntries]
    console.log(`Generated ${allEntries.length} sitemap entries`)

    return allEntries
  } catch (error) {
    console.error('Sitemap generation error:', error)
    
    // Return minimal sitemap on error
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
    ]
  }
}

// Force static generation at build time
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour