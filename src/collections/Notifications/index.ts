// src/collections/Notifications.ts
import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'read', 'createdAt'],
    hidden: true, // Hide from main sidebar, we'll show it in a custom component
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true, // Allow system to create
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: '📅 New Booking', value: 'booking' },
        { label: '✅ Check-in', value: 'checkin' },
        { label: '✔️ Check-out', value: 'checkout' },
        { label: '❌ Cancellation', value: 'cancellation' },
        { label: '❓ New Inquiry', value: 'inquiry' },
        { label: '⚠️ Alert', value: 'alert' },
      ],
    },
    {
      name: 'relatedBooking',
      type: 'relationship',
      relationTo: 'bookings',
      admin: {
        description: 'Link to the related booking',
      },
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Has this notification been read?',
      },
    },
    {
      name: 'userId',
      type: 'text',
      admin: {
        description: 'User who should see this notification',
      },
    },
  ],
  timestamps: true,
}