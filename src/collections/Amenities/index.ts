// src/collections/Amenities.ts
import type { CollectionConfig } from 'payload'

export const Amenities: CollectionConfig<'amenities'>  = {
  slug: 'amenities',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Amenity Name',
    },
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'WiFi', value: 'wifi' },
        { label: 'TV', value: 'tv' },
        { label: 'Air Conditioning', value: 'ac' },
        { label: 'Mini Bar', value: 'minibar' },
        { label: 'Safe', value: 'safe' },
        { label: 'Balcony', value: 'balcony' },
        { label: 'Ocean View', value: 'ocean-view' },
        { label: 'Pool Access', value: 'pool' },
        { label: 'Spa', value: 'spa' },
        { label: 'Gym', value: 'gym' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Room Service', value: 'room-service' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}