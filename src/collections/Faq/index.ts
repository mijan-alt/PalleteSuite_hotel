// collections/Faqs.ts
import { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig<"faqs"> = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText', // or 'textarea' if you prefer simple text
      required: true,
    },
  ],
}