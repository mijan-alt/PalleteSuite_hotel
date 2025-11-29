import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { sendFormNotificationEmail } from '@/hooks/sendFormNotificationEmail'
import { Page, Blog } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Blog | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Pallete Suite` : 'Pallete Suite hotels'
}

const generateURL: GenerateURL<any> = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  // If no document, return base URL
  if (!doc) return url

  // Handle blogs collection specifically
  if (collectionSlug === 'blogs') {
    return doc.slug ? `${url}/blogs/${doc.slug}` : url
  }

  // Use breadcrumbs to construct the complete path for any nesting level (pages)
  if (doc?.breadcrumbs && Array.isArray(doc.breadcrumbs) && doc.breadcrumbs.length > 0) {
    // The breadcrumbs array contains the complete hierarchy from root to current page
    // For example: [{url: '/services'}, {url: '/services/web'}, {url: '/services/web/design'}]

    // Get the last breadcrumb which has the complete URL path
    const lastBreadcrumb = doc.breadcrumbs[doc.breadcrumbs.length - 1]

    if (lastBreadcrumb?.url) {
      // The last breadcrumb's URL is already the complete path including all parents
      return `${url}${lastBreadcrumb.url}`
    }
  }

  // Fallback for documents without breadcrumbs
  return doc.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'blogs'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),

  nestedDocsPlugin({
    collections: ['pages'],
    generateLabel: (_, doc) => doc.title as string,
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug as string}`, ''),
  }),

  seoPlugin({
    generateTitle,
    generateURL,
  }),

  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    // ✅ THIS IS THE IMPORTANT PART - Sends email to YOU when someone submits
    formSubmissionOverrides: {
      hooks: {
        afterChange: [sendFormNotificationEmail],
      },
    },
  }),

  searchPlugin({
    collections: ['blogs', 'bookings', 'rooms'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),

  payloadCloudPlugin(),
]
