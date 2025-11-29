// app/rooms/[slug]/page.tsx
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import config from '@payload-config'
import { getPayload } from 'payload'
import { RoomClientPage } from './client-page'
import { LivePreviewListener } from '@/components/LivePreviewListener'

const getRoomBySlug = (slug: string) =>
  unstable_cache(
    async (slug: string) => {
      const payload = await getPayload({ config })

      const { docs } = await payload.find({
        collection: 'rooms',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
        depth: 6,
      })

      return docs[0] ?? null
    },
    [`room-${slug}`],
    {
      tags: ['rooms'],
    },
  )(slug)

const getAllRooms = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'rooms',
      pagination: false,
      select: { slug: true },
    })
    return result.docs
  },
  ['all-rooms'],
  { tags: ['rooms'] },
)

const getBusinessLocation = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return await payload.findGlobal({
      slug: 'businessLocation',
    })
  },
  ['business-location'],
  { tags: ['businessLocation'] },
)

// Optimized function to fetch both room and location in parallel
const getRoomAndLocation = async (slug: string) => {
  const [room, businessLocation] = await Promise.all([
    getRoomBySlug(slug),
    getBusinessLocation(),
  ])

  return { room, businessLocation }
}
  
type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function RoomPage({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  console.log('Draft mode:', draft)

  const { room, businessLocation } = await getRoomAndLocation(slug)

  if (!room) {
    return <PayloadRedirects url={`/rooms/${slug}`} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={`/rooms/${slug}`} />
      {draft && <LivePreviewListener />}
      <RoomClientPage room={room} businessLocation={businessLocation} />
    </>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const room = await getRoomBySlug(slug)

  if (!room) return { title: 'Room Not Found' }

  return {
    title: `${room.name} | Your Hotel`,
    description: room.description,
    openGraph: mergeOpenGraph({
      title: room.name,
      url: `/rooms/${slug}`,
    }),
  }
}

export async function generateStaticParams() {
  const rooms = await getAllRooms()
  return rooms.map((room) => ({
    slug: room.slug,
  }))
}