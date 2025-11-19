// src/blocks/RoomsGridBlock.ts
import type { Block } from 'payload'

export const RoomsGridBlock: Block = {
  slug: 'roomsGridBlock',
  interfaceName: "RoomsGridProps",
  labels: {
    singular: 'Rooms Grid',
    plural: 'Rooms Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Explore Rooms and Suites',
    
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'displayType',
      type: 'select',
      options: [
        { label: 'All Rooms', value: 'all' },
        { label: 'By Category', value: 'category' },
        { label: 'Selected Rooms', value: 'selected' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'roomCategory',
      type: 'select',
      options: [
        { label: 'Deluxe', value: 'deluxe' },
        { label: 'Standard', value: 'standard' },
        { label: 'Superior', value: 'superior' },
        { label: 'Suite', value: 'suite' },
      ],
      admin: {
        condition: (data, siblingData) => siblingData?.displayType === 'category',
      },
      required:true
    },
    {
      name: 'selectedRooms',
      type: 'relationship',
      relationTo: 'rooms',
      hasMany: true,
      admin: {
        condition: (data, siblingData) => siblingData?.displayType === 'selected',
      },
      required:true,
     
    },
    {
      name: 'columns',
      type: 'select',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      defaultValue: '2',
      required:true
    },
  ],
}