// src/blocks/AccommodationsBlock.ts
import type { Block } from 'payload'

export const AccommodationsBlock: Block = {
  slug: 'accommodationsBlock',
  labels: {
    singular: 'Accommodations Section',
    plural: 'Accommodations Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Discover Your Next Stay',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Our Accommodations',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'accommodations',
      type: 'array',
      label: 'Accommodation Items',
      fields: [
        {
          name: 'room',
          type: 'relationship',
          relationTo: 'rooms',
          required: true,
        },
        {
          name: 'customImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Custom Image (optional)',
          admin: {
            description: 'Override default room image',
          },
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Explore All Accommodations',
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/rooms',
        },
      ],
    },
  ],
}