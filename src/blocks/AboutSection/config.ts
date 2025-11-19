// payload/blocks/AboutSection.ts

import { Block } from 'payload'

export const AboutSection: Block = {
  slug: 'aboutSection',
  interfaceName: 'AboutSectionProps',
  labels: {
    singular: 'About Section',
    plural: 'About Sections',
  },
  imageURL: '/images/payload/blocks/about-preview.jpg',
  imageAltText: 'Luxury hotel lobby at sunset',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Our Story',
      admin: { description: 'Main heading (left side on desktop)' },
    },
    {
      name: 'tagline',
      type: 'textarea',
      required: true,
      defaultValue:
        'What does true hospitality feel like in 2025? How do we create stays that guests never forget?\nWe answer with timeless elegance, genuine warmth, and meticulous care in every detail.',
      admin: { description: 'Paragraph next to the heading' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Full-width hero image (recommended ≥ 1600×900px)',
      },
    },
    {
      name: 'sectionSubtitle',
      type: 'text',
      defaultValue: 'A Legacy of Excellence Since 1928',
      admin: { description: 'Small italic text on the left (desktop only)' },
    },
    {
      name: 'highlightedStatement',
      type: 'textarea',
      required: true,
      defaultValue:
        'We don’t just provide rooms — we craft unforgettable experiences. For nearly a century, we’ve welcomed travelers into a world where heritage meets modern luxury, where every stay feels like coming home.',
    },
    {
      name: 'mainContent',
      type: 'richText',
      required: true,
    },
  ],
}
