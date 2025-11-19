// src/blocks/StatsBlock.ts
import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'statsBlock',
  labels: {
    singular: 'Statistics Section',
    plural: 'Statistics Sections',
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 3,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Statistic Value',
          admin: {
            description: 'e.g., "98%", "15", "25K+"',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Statistic Label',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
  ],
}