// src/blocks/AboutUs.ts
import { Block } from 'payload'


export const AboutUs: Block = {
  slug: 'aboutUs',
  labels: {
    singular: 'About Us Section',
    plural: 'About Us Sections',
  },
  imageURL: '/images/blocks/about-us-preview.jpg', // optional preview in admin
  interfaceName: 'AboutUsBlockProp',

  fields: [
    // Hero Title & Subtitle
    {
      name: 'preTitle',
      type: 'text',
      defaultValue: 'About Us',
      admin: {
        description: 'Small uppercase text above the main title',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'An intimate sanctuary in the heart of Port Harcourt',
    },
    {
      name: 'subtitle',
      type: 'richText',
    },

    // First image (large, left-aligned on desktop)
    {
      name: 'imageMain',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main hero image (recommended 1200×800px)',
      },
    },

    // Second floating image (bottom-right on desktop)
    {
      name: 'imageFloating',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Smaller accent image (recommended 600×700px)',
      },
    },

    // Body text paragraphs
    {
      name: 'body',
      type: 'richText',
    },

    // Section 2: Our Philosophy
    {
      name: 'philosophyTitle',
      type: 'text',
      defaultValue: 'We believe true luxury is found in simplicity and authenticity.',
    },
    {
      name: 'philosophyText',
      type: 'richText',
    },

    // Gallery images (2 side-by-side)
    {
      name: 'gallery',
      type: 'array',
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      defaultValue: [
        { image: { relationTo: 'media', value: null } },
        { image: { relationTo: 'media', value: null } },
      ],
    },

    // Final paragraph + CTA
    {
      name: 'closingText',
      type: 'richText',
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Join Our Journey',
    },
    {
      name: 'ctaLink',
      type: 'text',
      defaultValue: '/careers',
    },
  ],
}
