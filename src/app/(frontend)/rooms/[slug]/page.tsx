// app/rooms/[slug]/page.tsx
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { PayloadRedirects } from '@/components/PayloadRedirects'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import config from '@payload-config'
import { getPayload } from 'payload'
import { RoomClientPage } from './client-page'
import { LivePreviewListener } from '@/components/LivePreviewListener'

type Room = {
  id: string
  name: string
  slug: string
  description: string
  pricePerNight: number
  gallery: { image: any }[]
  features?: { guests?: number; beds?: string; squareFeet?: number }
  availability: string
  meta?: {
    title?: string
    description?: string
    image?: any
  }
}

// Cached fetch functions
const fetchRoom = async (slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'rooms',
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
  })
  return result.docs[0] 
}

const fetchAllRooms = async () => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'rooms',
    pagination: false,
  })
  return result.docs 
}

// Cached versions
const getCachedRoom = (slug: string, draft: boolean) =>
  draft
    ? fetchRoom(slug)
    : unstable_cache(fetchRoom, [`room-${slug}`], { revalidate: 60 })(slug)

const getCachedRooms = () =>
  unstable_cache(fetchAllRooms, ['rooms-static-params'], { revalidate: 600 })()

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()

  const room = await getCachedRoom(slug, draft)

  if (!room) {
    return <PayloadRedirects url={`/rooms/${slug}`} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={`/rooms/${slug}`} />
      {draft && <LivePreviewListener />}
      <RoomClientPage room={room} />
    </>
  )
}

// Generate static params at build time
export async function generateStaticParams() {
  const rooms = await getCachedRooms()
  return rooms.map((room) => ({
    slug: room.slug,
  }))
}

// Dynamic metadata (SEO)
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }): Promise<Metadata> {
//   const { slug } = await params
//   const { isEnabled: draft } = await draftMode()
//   const room = await getCachedRoom(slug, draft)

//   if (!room) return { title: 'Room Not Found' }

//   const ogImage =
//     room.meta?.image &&
//     typeof room.meta.image === 'object' &&
//     'url' in room.meta.image
//       ? `${process.env.NEXT_PUBLIC_SERVER_URL}${room.meta.image.url}`
//       : room.gallery?.[0]?.image &&
//         typeof room.gallery[0].image === 'object' &&
//         'url' in room.gallery[0].image
//       ? `${process.env.NEXT_PUBLIC_SERVER_URL}${room.gallery[0].image.url}`
//       : undefined

//   return {
//     title: room.meta?.title || room.name,
//     description: room.meta?.description || room.description?.slice(0, 160),
//     openGraph: mergeOpenGraph({
//       title: room.meta?.title || room.name,
//       description: room.meta?.description || room.description?.slice(0, 160),
//       url: `/rooms/${slug}`,
//       images: ogImage ? [{ url: ogImage }] : undefined,
//     }),
//   }
// }