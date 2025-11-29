// src/collections/Rooms.ts
import type { CollectionConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'

const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const amenityOptions = [
  { label: 'Wi-Fi', value: 'wifi' },
  { label: 'Air Conditioning', value: 'ac' },
  { label: 'Mini Bar', value: 'minibar' },
  { label: 'Room Service', value: 'room-service' },
  { label: 'Balcony', value: 'balcony' },
  { label: 'Ocean View', value: 'ocean-view' },
  { label: 'King Bed', value: 'king-bed' },
  { label: 'Bathtub', value: 'bathtub' },
  { label: 'Safe', value: 'safe' },
  { label: 'Coffee Maker', value: 'coffee' },
  { label: 'TV', value: 'tv' },
  { label: 'Work Desk', value: 'desk' },
]

export const Rooms: CollectionConfig = {
  slug: 'rooms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'totalUnits', 'pricePerNight', 'featured'],
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
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated from name',
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

    // Option 1: Auto-generate range
    {
      name: 'roomNumberRange',
      type: 'group',
      fields: [
        {
          name: 'startNumber',
          type: 'number',
          label: 'Starting Room Number',
          min: 100,
        },
        {
          name: 'endNumber',
          type: 'number',
          label: 'Ending Room Number',
          min: 100,
        },
        {
          name: 'prefix',
          type: 'text',
          label: 'Room Number Prefix (optional)',
          admin: {
            placeholder: 'e.g., A, B, Pearl-',
          },
        },
      ],
      admin: {
        description:
          'Generate sequential room numbers (e.g., 101-112). Leave blank to manually add room numbers below.',
      },
    },

    // Option 2: Manually add room numbers
    {
      name: 'roomNumbers',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          label: 'Room Number',
          admin: {
            placeholder: 'e.g., 101, 201A, Pearl Suite',
          },
        },
    
      ],
      admin: {
        description:
          'Individual room numbers. Generated automatically if you use the range above, or add manually.',
      },
    },

    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },

    {
      name: 'totalUnits',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: 1,
      admin: {
        description: 'Total rooms of this type (auto-calculated from room numbers)',
        position: 'sidebar',
        readOnly: true,
      },
    },

    {
      name: 'pricePerNight',
      type: 'number',
      required: true,
      min: 0,
      admin: { step: 100 },
    },
    {
      name: 'gallery',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'features',
      type: 'group',
      fields: [
        { name: 'squareFeet', type: 'number', label: 'Size (sq ft)' },
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
      type: 'select',
      label: 'Amenities',
      hasMany: true,
      options: amenityOptions,
      admin: {
        description: 'Select all that apply to this room',
        isClearable: true,
      },
    },

    {
      name: 'availability',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Limited', value: 'limited' },
        { label: 'Sold Out', value: 'sold-out' },
      ],
      admin: { position: 'sidebar' },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate slug from name
        if (data?.name && !data?.slug) {
          data.slug = formatSlug(data.name)
        }

        // Generate room numbers from range if provided
        if (
          data?.roomNumberRange?.startNumber &&
          data?.roomNumberRange?.endNumber &&
          data.roomNumberRange.startNumber <= data.roomNumberRange.endNumber
        ) {
          const roomNumbers: Array<{ number: string; floor?: number; status?: string }> = []
          const prefix = data.roomNumberRange.prefix || ''
          const start = data.roomNumberRange.startNumber
          const end = data.roomNumberRange.endNumber

          for (let i = start; i <= end; i++) {
            const roomNumber = prefix + i.toString()
            // Calculate floor from room number (e.g., 101 = floor 1, 201 = floor 2)
            const floor = Math.floor(i / 100)
            
            roomNumbers.push({
              number: roomNumber,
              floor: floor > 0 ? floor : undefined,
            })
          }

          data.roomNumbers = roomNumbers
          console.log(`Generated ${roomNumbers.length} room numbers`)
        }

        // Calculate totalUnits from roomNumbers
        if (data?.roomNumbers && Array.isArray(data.roomNumbers)) {
          data.totalUnits = data.roomNumbers.length
          console.log(`Total units set to: ${data.totalUnits}`)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        if (typeof window !== 'undefined') return doc
        revalidateTag('rooms')
        revalidateTag(`room-${doc.slug}`)
        revalidatePath(`/rooms/${doc.slug}`)
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        revalidateTag('rooms')
        revalidateTag(`room-${doc.slug}`)
        revalidatePath(`/rooms/${doc.slug}`)
      },
    ],
  },
}