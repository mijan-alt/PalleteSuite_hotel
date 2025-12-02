import { GlobalConfig } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'

export const HotelAmenities: GlobalConfig = {
  slug: 'hotelAmenities',
  label: 'Hotel Amenities & Facilities',
  access: { read: () => true },
  admin: {
    group: 'Site Configuration',
  },
  fields: [
    {
      name: 'amenities',
      type: 'array',
      minRows: 2,
      maxRows: 20,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Image of the amenity' },
          required: true,
        },
        { name: 'link', type: 'text', label: 'Internal link (optional)' },
      ],
    },
  ],

  hooks: {
    afterChange: [
      // Correct Payload 3 signature (no `operation`)
      async ({ doc, req }) => {
        // Only revalidate when publishing (not on draft saves)

        if (!req.context?.disableRevalidate) {
          revalidateTag('hotel_amenities')
          revalidatePath('/') // Revalidate homepage
        }

        return doc
      },
    ],
  },
}
