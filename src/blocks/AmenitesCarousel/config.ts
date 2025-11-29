// src/payload/blocks/AmenitiesCarousel.ts
import { Block } from 'payload'

export const AmenitiesCarousel: Block = {
  slug: 'amenitiesCarousel',
  interfaceName: 'AmenitiesCarouselBlock',
  labels: {
    singular: 'Amenities Carousel (Auto)',
    plural: 'Amenities Carousels (Auto)',
  },
  imageURL: '/images/blocks/amenities-carousel-preview.jpg',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Experiences That Stay With You',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Eight signatures of Palette Suite',
    },
  ],
}

export default AmenitiesCarousel