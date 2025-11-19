// blocks/EventAccordion.ts
import { Block } from 'payload'

const FaqAccordion: Block = {
  slug: 'faqAccordion',
  labels: {
    singular: 'FAQ Accordion with Image',
    plural: 'FAQ Accordions with Image',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Main Image (shown on the right)',
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      required: true,
      minRows: 3,
      maxRows: 12,
      admin: {
        description: 'Select the FAQ items to display.',
      },
    },
  ],
}

export default FaqAccordion