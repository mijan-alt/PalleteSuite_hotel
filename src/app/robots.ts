
// import type { MetadataRoute } from 'next'

// export default function robots(): MetadataRoute.Robots {
//   const SITE_URL =
//     process.env.NEXT_PUBLIC_SERVER_URL ||
//     process.env.VERCEL_PROJECT_PRODUCTION_URL ||
//     'https://webdesigngrid.com'

//   return {
//     rules: {
//       userAgent: '*',
//       allow: '/',
//       disallow: [
//         '/admin/',           // Block Payload admin
//       ],
//     },
//     sitemap: `${SITE_URL}/sitemap.xml`,
//   }
// }

// export const dynamic = 'force-static'



export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'http://localhost:3000/sitemap.xml'
  }
}