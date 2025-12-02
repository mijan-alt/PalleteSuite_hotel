import React from 'react'
import Link from 'next/link'
import { Clock, Bed } from 'lucide-react'

interface SuiteAvailabilityProps {
  availability: {
    summary: {
      total: number
      occupied: number
      reserved: number
      available: number
      cleaning: number
    }
    byRoomType: Array<{
      roomName: string
      roomType: string
      totalUnits: number
      occupied: number
      reserved: number
      available: number
    }>
    sampleBookings: {
      occupied: Array<{ roomNumber: string; guestName: string; roomName: string; checkOut: string }>
      reserved: Array<{ roomNumber: string; guestName: string; roomName: string; checkIn: string }>
    }
  } | null
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function SuiteAvailability({ availability }: SuiteAvailabilityProps) {
  if (!availability) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="py-10 text-center text-gray-500">
          <Clock className="w-5 h-5 inline-block animate-spin mr-2" />
          Loading availability...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Suite Availability</h2>
        <Link
          href="/admin/collections/bookings"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          All bookings →
        </Link>
      </div>

      {/* Visual Bar */}
      <div className="mb-6">
        <div className="h-16 rounded-xl overflow-hidden border border-gray-200 flex">
          {availability.summary.occupied > 0 && (
            <div className="bg-red-400" style={{ flex: availability.summary.occupied }} />
          )}
          {availability.summary.reserved > 0 && (
            <div className="bg-green-400" style={{ flex: availability.summary.reserved }} />
          )}
          {availability.summary.available > 0 && (
            <div className="bg-gray-300" style={{ flex: availability.summary.available }} />
          )}
          {availability.summary.cleaning > 0 && (
            <div className="bg-amber-400" style={{ flex: availability.summary.cleaning }} />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Occupied', value: availability.summary.occupied, color: 'bg-red-400' },
          { label: 'Reserved', value: availability.summary.reserved, color: 'bg-green-400' },
          { label: 'Available', value: availability.summary.available, color: 'bg-gray-300' },
          { label: 'Cleaning', value: availability.summary.cleaning, color: 'bg-amber-400' },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
              <span className="text-xs text-gray-600">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sample Bookings */}
      <div className="space-y-3">
        {availability.sampleBookings.occupied.map((b, i) => (
          <div
            key={`occ-${i}`}
            className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-semibold text-sm border border-gray-200">
                {b.roomNumber}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{b.guestName}</p>
                <p className="text-xs text-gray-600">{b.roomName}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Occupied
              </span>
              <p className="text-xs text-red-600 mt-1">Departs: {formatDate(b.checkOut)}</p>
            </div>
          </div>
        ))}

        {availability.sampleBookings.reserved.map((b, i) => (
          <div
            key={`res-${i}`}
            className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-semibold text-sm border border-gray-200">
                {b.roomNumber}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{b.guestName}</p>
                <p className="text-xs text-gray-600">{b.roomName}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Reserved
              </span>
              <p className="text-xs text-green-600 mt-1">Arrives: {formatDate(b.checkIn)}</p>
            </div>
          </div>
        ))}

        {availability.sampleBookings.occupied.length === 0 &&
          availability.sampleBookings.reserved.length === 0 &&
          availability.summary.available > 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
              <Bed className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-700">
                {availability.summary.available} rooms available
              </p>
              <p className="text-sm text-gray-500">No current bookings</p>
            </div>
          )}
      </div>

      {/* Room Type Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">By Room Type</h3>
        <div className="space-y-2">
          {availability.byRoomType.map((room, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">{room.roomName}</span>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-red-600">{room.occupied} occ.</span>
                <span className="text-green-600">{room.reserved} res.</span>
                <span className="text-gray-700 font-semibold">{room.available} avail.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}