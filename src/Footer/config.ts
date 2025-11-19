import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      label: 'Footer Description',
      required: true,
    },

    {
      name:'title',
      type:'text',
      label:'Company Name',
      required:true,
      defaultValue:'Sunlink Energies'
    },
    {
      name: 'quickLinks',
      type: 'array',
      label: 'Quick Links',
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Info',
      fields: [
        {
          name: 'email',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'address',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    {
      name:'copyright',
      label:'Copr right section',
      type:'textarea',
      defaultValue:'2025 Sunlink. All rights reserved'
    }

  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
