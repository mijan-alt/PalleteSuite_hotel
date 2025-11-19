// scripts/migrate-payload-media.ts
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { put } from '@vercel/blob'


async function migratePayloadMedia() {
  const payload = await getPayloadHMR({ config: configPromise })

  console.log('🚀 Starting Payload media migration...')

  try {
    // Get all media documents
    const media = await payload.find({
      collection: 'media',
      limit: 1000,
      depth: 0,
    })

    console.log(`📦 Found ${media.docs.length} media files`)

    for (const doc of media.docs) {
      try {
        if (!doc.url) continue

        console.log(`📄 Migrating: ${doc.filename}`)

        // Download from old blob
        const response = await fetch(doc.url)
        const buffer = await response.arrayBuffer()
        const file = new File([buffer], doc.filename!, {
          type: doc.mimeType || 'application/octet-stream',
        })

        // Upload to new blob (client's account)
        const newBlob = await put(doc.filename!, file, {
          access: 'public',
          token: process.env.DEST_BLOB_TOKEN!,
        })

        // Update Payload document with new URL
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {
            url: newBlob.url,
          },
        })

        console.log(`✅ Migrated: ${doc.filename}`)
      } catch (error) {
        console.error(`❌ Failed to migrate ${doc.filename}:`, error)
      }
    }

    console.log('\n🎉 Migration complete!')
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

migratePayloadMedia()