// src/components/blocks/AmenitiesCarousel.server.tsx
import { AmenitiesCarouselClient } from './amenities.client'

export function AmenitiesCarousel({
  title,
  subtitle,
  hotelAmenities,
}: {
  title?: string
  subtitle?: string
  hotelAmenities?: any
}) {
  const amenities = hotelAmenities?.amenities

  if (!amenities || amenities.length === 0) {
    return null
  }

  return (
    <AmenitiesCarouselClient
      title={title || 'Experiences That Stay With You'}
      subtitle={subtitle || 'Eight signatures of Palette Suite'}
      amenities={amenities}
    />
  )
}