// collections/Inquiries.ts
import { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig<'inquiries'> = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['room', 'email', 'createdAt'],
  },
  access: { create: () => true, read: () => true },
  fields: [
    { name: 'room', type: 'relationship', relationTo: 'rooms', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea' },
  ],
}