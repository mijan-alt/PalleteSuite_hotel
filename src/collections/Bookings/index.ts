// collections/Bookings.ts
import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig<'bookings'> = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'room',
    defaultColumns: ['room', 'checkIn', 'checkOut', 'totalPrice', 'status'],
  },
  access: { create: () => true, read: () => true },
  fields: [
    { name: 'room', type: 'relationship', relationTo: 'rooms', required: true },
    { name: 'checkIn', type: 'date', required: true },
    { name: 'checkOut', type: 'date', required: true },
    { name: 'guests', type: 'number', required: true, defaultValue: 2 },
    { name: 'totalNights', type: 'number', required: true },
    { name: 'pricePerNight', type: 'number', required: true },
    { name: 'totalPrice', type: 'number', required: true },
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'status', type: 'select', options: ['pending', 'confirmed', 'cancelled'], defaultValue: 'pending' },
  ],
}