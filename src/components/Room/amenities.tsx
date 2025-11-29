// src/components/RoomAmenities.tsx
'use client'

import {
  Wifi,
  Wind,
  Coffee,
  Bath,
  Tv,
  Shield,
  Utensils,
  Sun,
  Waves,
  Bed,
  Zap,
} from 'lucide-react'

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-10 h-10 text-red-700" />,
  ac: <Wind className="w-10 h-10 text-red-700" />,
  minibar: <Coffee className="w-10 h-10 text-red-700" />,
  'room-service': <Utensils className="w-10 h-10 text-red-700" />,
  balcony: <Sun className="w-10 h-10 text-red-700" />,
  'ocean-view': <Waves className="w-10 h-10 text-red-700" />,
  'king-bed': <Bed className="w-10 h-10 text-red-700" />,
  bathtub: <Bath className="w-10 h-10 text-red-700" />,
  safe: <Shield className="w-10 h-10 text-red-700" />,
  coffee: <Coffee className="w-10 h-10 text-red-700" />,
  tv: <Tv className="w-10 h-10 text-red-700" />,
  desk: <Zap className="w-10 h-10 text-red-700" />,
}

const amenityLabels: Record<string, string> = {
  wifi: 'Wi-Fi',
  ac: 'Air Conditioning',
  minibar: 'Mini Bar',
  'room-service': 'Room Service',
  balcony: 'Balcony',
  'ocean-view': 'Ocean View',
  'king-bed': 'King Bed',
  bathtub: 'Bathtub',
  safe: 'Safe',
  coffee: 'Coffee Maker',
  tv: 'TV',
  desk: 'Work Desk',
}

interface RoomAmenitiesProps {
  amenities: string[]
  className?: string
}

export function RoomAmenities({ amenities, className = '' }: RoomAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return (
      <p className="text-muted-foreground italic">No amenities listed for this room.</p>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${className}`}>
      {amenities.map((amenity) => {
        const icon = amenityIcons[amenity]
        const label = amenityLabels[amenity] || amenity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

        return (
          <div
            key={amenity}
            className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:shadow-lg group-hover:bg-white transition-all">
              {icon || <div className="w-10 h-10 bg-gray-300 rounded-full" />}
            </div>
            <span className="text-sm font-medium text-gray-700 leading-tight">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}