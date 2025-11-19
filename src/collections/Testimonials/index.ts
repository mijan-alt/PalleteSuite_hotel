// src/collections/Testimonials.ts
import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'guestName',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'guestName',
      type: 'text',
      required: true,
      label: 'Guest Name',
    },
    {
      name: 'guestPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Guest Photo',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'review',
      type: 'textarea',
      required: true,
    },
    {
      name: 'stayDate',
      type: 'date',
      label: 'Stay Date',
    },
    {
      name: 'roomType',
      type: 'relationship',
      relationTo: 'rooms',
      label: 'Room Stayed In',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}