// src/blocks/RoomsCollectionBlock.ts
import type { Block } from 'payload'

export const RoomsCollectionBlock: Block = {
  slug: 'roomsCollectionBlock',
  interfaceName:"RoomsCollectionProps",
  labels: {
    singular: 'Rooms Collection',
    plural: 'Rooms Collections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Section Eyebrow',
      defaultValue: 'POPULAR SUITES',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Our Exquisite Rooms Collections',
    },
    {
      name: 'displayType',
      type: 'select',
      options: [
        { label: 'Featured Rooms', value: 'featured' },
        { label: 'Selected Rooms', value: 'selected' },
        { label: 'All Rooms', value: 'all' },
      ],
      defaultValue: 'featured',
    },
    {
      name: 'selectedRooms',
      type: 'relationship',
      relationTo: 'rooms',
      hasMany: true,
      admin: {
        condition: (data, siblingData) => siblingData?.displayType === 'selected',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: {
        description: 'Number of rooms to display',
      },
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Grid (3 columns)', value: 'grid-3' },
        { label: 'Grid (4 columns)', value: 'grid-4' },
        { label: 'Carousel', value: 'carousel' },
      ],
      defaultValue: 'grid-3',
    },
  ],
}