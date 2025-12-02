// src/globals/BusinessLocation.ts
import { GlobalConfig } from 'payload'

export const BusinessLocation: GlobalConfig = {
  slug: 'businessLocation',
  label: 'Business Location',
  admin: {
    group: 'Site Configuration',
  },
  access: {
    read: () => true, 
    update: ({ req: { user } }) => !!user, // Only authenticated users can update
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'longitude',
          type: 'number',
          required: true,
          defaultValue: 7.02663,
          admin: {
            description: 'Business longitude coordinate',
          },
        },
        {
          name: 'latitude',
          type: 'number',
          required: true,
          defaultValue: 4.83125,
          admin: {
            description: 'Business latitude coordinate',
          },
        },
      ],
    },
    {
      name: 'businessName',
      type: 'text',
      required: true,
      defaultValue: 'Websitevantage',
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
      defaultValue: 'Port Harcourt, Rivers State',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      defaultValue: '+234 708 264 2998',
      admin: {
        description: 'Format: +234 XXX XXX XXXX',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Business email address',
      },
    },
    {
      name: 'hours',
      type: 'text',
      required: true,
      defaultValue: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
      admin: {
        description: 'Business operating hours',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Best web developer in Nigeria',
      admin: {
        description: 'Short business description for the map',
      },
    },
    {
      name: 'isOpen',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is the business currently open?',
      },
    },
    {
      name: 'serviceRadiusKm',
      type: 'number',
      defaultValue: 5,
      admin: {
        description: 'Service area radius in kilometers (for map visualization)',
      },
    },
    {
      name: 'mapboxAccessToken',
      type: 'text',
      required: true,
      defaultValue:
        'pk.eyJ1IjoibWlqYW45NiIsImEiOiJjbTNoaXlrZTAwZ3R1MmtxemJxMXl5dTg1In0.LGFILubxj0el0Cb5udh77w',
      admin: {
        description: 'Your Mapbox API access token',
      },
    },
    {
      type: 'collapsible',
      label: 'Map Display Settings',
      fields: [
        {
          name: 'defaultZoom',
          type: 'number',
          defaultValue: 14,
          min: 1,
          max: 20,
          admin: {
            description: 'Default map zoom level (1-20)',
          },
        },
        {
          name: 'showServiceArea',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show service area circle on map',
          },
        },
        {
          name: 'showBusinessInfo',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show business info card by default',
          },
        },
      ],
    },
  ],
}
