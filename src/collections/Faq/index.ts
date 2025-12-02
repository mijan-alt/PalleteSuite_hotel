// collections/Faqs.ts
import { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig<'faqs'> = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Content',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
  ],
}
