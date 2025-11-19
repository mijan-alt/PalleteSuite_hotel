
import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { revalidateTag } from 'next/cache'

export const Rooms: CollectionConfig<'rooms'> = {
  slug: 'rooms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'pricePerNight', 'featured', 'slug'],
  },
  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Room Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Deluxe Room', value: 'deluxe' },
        { label: 'Standard Room', value: 'standard' },
        { label: 'Superior Room', value: 'superior' },
        { label: 'Presidential Suite', value: 'presidential' },
        { label: 'Pearl Harbor Suite', value: 'pearl-harbor' },
        { label: 'Grand Deluxe Suite', value: 'grand-deluxe' },
        { label: 'Federal Grand Suite', value: 'federal-grand' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Room',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'pricePerNight',
      type: 'number',
      required: true,
      min: 0,
      label: 'Price Per Night ($)',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Room Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      required:true
    },
    {
      name: 'features',
      type: 'group',
      label: 'Room Features',
      fields: [
        {
          name: 'squareFeet',
          type: 'number',
          label: 'Square Feet',
        },
        {
          name: 'beds',
          type: 'select',
          options: [
            { label: '1 Bed', value: '1' },
            { label: '2 Beds', value: '2' },
            { label: '3 Beds', value: '3' },
            { label: 'King Bed', value: 'king' },
            { label: 'Queen Bed', value: 'queen' },
          ],
        },
        {
          name: 'guests',
          type: 'number',
          label: 'Max Guests',
          defaultValue: 2,
        },
      ],
    },
    {
      name: 'amenities',
      type: 'array',
      label: 'Amenities',
      fields: [
        {
          name: 'amenity',
          type: 'relationship',
          relationTo: 'amenities',
        },
      ],
    },
    {
      name: 'availability',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Limited', value: 'limited' },
        { label: 'Sold Out', value: 'sold-out' },
      ],
      defaultValue: 'available',
      admin: {
        position: 'sidebar',
      },
    },
  ],

  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Only run on server (not in admin preview)
        if (typeof window !== 'undefined') return doc

        const slug = doc.slug as string

        try {
          // 1. Revalidate the individual room page
          revalidatePath(`/rooms/${slug}`, 'page')

          // 2. Revalidate any listing pages (e.g. /rooms, /accommodation, homepage if featured)
          revalidatePath('/rooms')
          revalidatePath('/')

          // 3. Revalidate using cache tags (recommended for dynamic routes)
          revalidateTag(`room-${slug}`)
        
      

          console.log(`Revalidated room: /rooms/${slug}`)
        } catch (error) {
          console.error('Revalidation failed:', error)
        }

        return doc
      },
    ],

    // Optional: Revalidate on delete
    afterDelete: [
      async ({ doc }) => {
        if (typeof window !== 'undefined') return

        const slug = doc.slug as string

        revalidatePath(`/rooms/${slug}`)
        revalidatePath('/rooms')
        revalidatePath('/')
        revalidateTag(`room-${slug}`)
        revalidateTag('rooms')

        console.log(`Room deleted & cache cleared: ${slug}`)
      },
    ],
  },
}