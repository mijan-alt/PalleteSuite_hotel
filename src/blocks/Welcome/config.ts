// src/blocks/WelcomeBlock.ts
import type { Block } from 'payload'

export const WelcomeBlock: Block = {
  slug: 'welcomeBlock',
  labels: {
    singular: 'Welcome Section',
    plural: 'Welcome Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
      defaultValue: 'WELCOME TO',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'The ultimate luxury experience',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Key Features',
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Check', value: 'check' },
            { label: 'Star', value: 'star' },
            { label: 'Heart', value: 'heart' },
          ],
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}