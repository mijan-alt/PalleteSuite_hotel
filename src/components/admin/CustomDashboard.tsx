'use client'
import React, { useEffect, useState } from 'react'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { useAuth } from '@payloadcms/ui'
import { CircleArrowOutDownRight, CircleArrowOutUpRight, Box } from 'lucide-react'

interface BookingMetrics {
  newBookings: number
  newBookingsChange: number
  checkIns: number
  checkInsChange: number
  checkOuts: number
  checkOutsChange: number
  totalRevenue: number
  totalRevenueChange: number
}

interface RoomAvailability {
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
}

const CustomDashboard = () => {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<BookingMetrics>({
    newBookings: 0,
    newBookingsChange: 0,
    checkIns: 0,
    checkInsChange: 0,
    checkOuts: 0,
    checkOutsChange: 0,
    totalRevenue: 0,
    totalRevenueChange: 0,
  })
  const [availability, setAvailability] = useState<RoomAvailability | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch booking metrics
        const metricsResponse = await fetch('/api/bookings/metrics', {
          credentials: 'include',
        })
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json()
          setMetrics(metricsData)
        }

        // Fetch room availability
        const availabilityResponse = await fetch('/api/rooms/availability', {
          credentials: 'include',
        })
        if (availabilityResponse.ok) {
          const availabilityData = await availabilityResponse.json()
          setAvailability(availabilityData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const abs = Math.abs(value)
    const sign = value >= 0 ? '↗' : '↘'
    const color = value >= 0 ? 'text-green-600' : 'text-red-600'
    return (
      <span className={`${color} font-semibold`}>
        {sign} {abs.toFixed(2)}%
      </span>
    )
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

  return (
    <Gutter className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.name?.split(' ')[0] || 'Administrator'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* New Bookings */}
          <div className="rounded-2xl p-6 border bg-white">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2">
                <Box />
              </div>
            </div>
            <div className="mb-1">
              <p className="text-sm text-gray-600 mb-1">New Bookings</p>
              <p className="text-4xl font-bold text-gray-900">
                {loading ? '...' : metrics.newBookings}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {loading ? (
                <span className="text-gray-500">Loading...</span>
              ) : (
                <>
                  {formatPercentage(metrics.newBookingsChange)}
                  <span className="text-gray-500">from last week</span>
                </>
              )}
            </div>
          </div>

          {/* Check-In */}
          <div className="rounded-2xl p-6 border bg-white border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2">
                <CircleArrowOutDownRight />
              </div>
            </div>
            <div className="mb-1">
              <p className="text-sm text-gray-600 mb-1">Check-In</p>
              <p className="text-4xl font-bold text-gray-900">
                {loading ? '...' : metrics.checkIns}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {loading ? (
                <span className="text-gray-500">Loading...</span>
              ) : (
                <>
                  {formatPercentage(metrics.checkInsChange)}
                  <span className="text-gray-500">from last week</span>
                </>
              )}
            </div>
          </div>

          {/* Check-Out */}
          <div className="rounded-2xl p-6 border border-border bg-white">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2">
                <CircleArrowOutUpRight />
              </div>
            </div>
            <div className="mb-1">
              <p className="text-sm text-gray-600 mb-1">Check-Out</p>
              <p className="text-4xl font-bold text-gray-900">
                {loading ? '...' : metrics.checkOuts}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {loading ? (
                <span className="text-gray-500">Loading...</span>
              ) : (
                <>
                  {formatPercentage(metrics.checkOutsChange)}
                  <span className="text-gray-500">from last week</span>
                </>
              )}
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white rounded-lg">
                <span className="text-xl">₦</span>
              </div>
            </div>
            <div className="mb-1">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-4xl font-bold text-gray-900">
                {loading ? '...' : formatCurrency(metrics.totalRevenue)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {loading ? (
                <span className="text-gray-500">Loading...</span>
              ) : (
                <>
                  {formatPercentage(metrics.totalRevenueChange)}
                  <span className="text-gray-500">from last week</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Suite Availability */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Suite Availability</h2>
                <Link
                  href="/admin/collections/bookings"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">⋯</span>
                </Link>
              </div>

              {loading || !availability ? (
                <div className="text-center py-8 text-gray-500">Loading availability...</div>
              ) : (
                <>
                  {/* Visual availability bar */}
                  <div className="mb-6">
                    <div className="flex h-16 rounded-xl overflow-hidden">
                      {availability.summary.occupied > 0 && (
                        <div
                          className="bg-red-400"
                          style={{
                            flex: availability.summary.occupied,
                          }}
                        ></div>
                      )}
                      {availability.summary.reserved > 0 && (
                        <div
                          className="bg-green-300"
                          style={{
                            flex: availability.summary.reserved,
                          }}
                        ></div>
                      )}
                      {availability.summary.available > 0 && (
                        <div
                          className="bg-gray-200"
                          style={{
                            flex: availability.summary.available,
                          }}
                        ></div>
                      )}
                      {availability.summary.cleaning > 0 && (
                        <div
                          className="bg-yellow-300"
                          style={{
                            flex: availability.summary.cleaning,
                          }}
                        ></div>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-red-400 rounded"></div>
                        <span className="text-xs text-gray-500">Occupied</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {availability.summary.occupied}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-green-300 rounded"></div>
                        <span className="text-xs text-gray-500">Reserved</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {availability.summary.reserved}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-gray-200 rounded"></div>
                        <span className="text-xs text-gray-500">Available</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {availability.summary.available}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                        <span className="text-xs text-gray-500">Cleaning</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {availability.summary.cleaning}
                      </p>
                    </div>
                  </div>

                  {/* Sample Bookings Display */}
                  <div className="space-y-3">
                    {/* Occupied Rooms */}
                    {availability.sampleBookings.occupied.map((booking, index) => (
                      <div
                        key={`occupied-${index}`}
                        className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-semibold text-xs">
                            {booking.roomNumber}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {booking.guestName}
                            </div>
                            <div className="text-xs text-gray-500">{booking.roomName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            Occupied
                          </div>
                          <div className="text-xs text-red-600 mt-1">
                            Departs: {formatDate(booking.checkOut)}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Reserved Rooms */}
                    {availability.sampleBookings.reserved.map((booking, index) => (
                      <div
                        key={`reserved-${index}`}
                        className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-semibold text-xs">
                            {booking.roomNumber}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {booking.guestName}
                            </div>
                            <div className="text-xs text-gray-500">{booking.roomName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            Reserved
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            Arrives: {formatDate(booking.checkIn)}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Show available count if no bookings to display */}
                    {availability.sampleBookings.occupied.length === 0 &&
                      availability.sampleBookings.reserved.length === 0 &&
                      availability.summary.available > 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-lg font-semibold mb-1">
                            {availability.summary.available} rooms available
                          </p>
                          <p className="text-sm">No current bookings to display</p>
                        </div>
                      )}
                  </div>

                  {/* Room Type Breakdown */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Availability by Room Type
                    </h3>
                    <div className="space-y-2">
                      {availability.byRoomType.map((room, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{room.roomName}</span>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-red-600">{room.occupied} occupied</span>
                            <span className="text-green-600">{room.reserved} reserved</span>
                            <span className="text-gray-600 font-semibold">
                              {room.available} available
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
                <Link
                  href="/admin/activity-log"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-1">
                {[
                  {
                    time: '08:45 AM',
                    description: 'Guest Check-Out',
                    detail: 'Sarah Johnson completed check-out process and payment verified.',
                    icon: '✓',
                    bgColor: 'bg-green-50',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                  },
                  {
                    time: '08:12 AM',
                    description: 'New inquiry from Mrs. Okafor',
                    detail: 'Events Team set up Conference Room B for 10 AM Meeting.',
                    icon: '💬',
                    bgColor: 'bg-blue-50',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                  },
                  {
                    time: '07:30 AM',
                    description: 'Suite 7 housekeeping completed',
                    detail: 'Housekeeping Staff cleaned and inspected 12 rooms.',
                    icon: '🧹',
                    bgColor: 'bg-purple-50',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-600',
                  },
                  {
                    time: '07:15 AM',
                    description: 'New booking: Suite 105 for Dec 1-5',
                    detail: 'Front Desk processed early check-in request.',
                    icon: '📅',
                    bgColor: 'bg-yellow-50',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 ${activity.iconBg} rounded-lg flex items-center justify-center ${activity.iconColor}`}
                    >
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.description}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{activity.detail}</p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-400 font-medium">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Overall Rating Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Overall Rating</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="text-xl">⋯</span>
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-1">
                  4.6<span className="text-2xl text-gray-400">/5</span>
                </div>
                <p className="text-sm text-gray-500">Impressive</p>
                <p className="text-xs text-gray-400">from 254 reviews</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Facilities', value: 4.4 },
                  { label: 'Cleanliness', value: 4.7 },
                  { label: 'Services', value: 4.6 },
                  { label: 'Comfort', value: 4.8 },
                  { label: 'Location', value: 4.5 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-300 rounded-full"
                        style={{ width: `${(item.value / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Tasks</h2>
                <button className="w-7 h-7 bg-yellow-300 hover:bg-yellow-400 rounded-lg flex items-center justify-center text-gray-900 font-bold text-lg">
                  +
                </button>
              </div>
              <div className="space-y-2">
                {[
                  {
                    date: 'June 17, 2028',
                    title: 'Set Up Conference Room B for 10 AM Meeting',
                    color: 'bg-blue-100',
                  },
                  {
                    date: 'June 17, 2028',
                    title: 'Restock Housekeeping Supplies on 3rd Floor',
                    color: 'bg-green-100',
                  },
                  {
                    date: 'June 20, 2028',
                    title: 'Inspect and Clean the Pool Area',
                    color: 'bg-teal-100',
                  },
                  {
                    date: 'June 20, 2028',
                    title: 'Check-In Assistance During Peak Hours (4 PM - 6 PM)',
                    color: 'bg-blue-100',
                  },
                ].map((task, index) => (
                  <div
                    key={index}
                    className={`${task.color} rounded-xl p-3 relative group cursor-pointer hover:scale-[1.02] transition-transform`}
                  >
                    <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700">
                      <span className="text-sm">⋯</span>
                    </button>
                    <div className="text-xs text-gray-600 mb-1">{task.date}</div>
                    <div className="text-sm font-medium text-gray-900 pr-6">{task.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/collections/bookings/create"
                  className="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <span className="text-lg">📅</span>
                  <span className="text-sm font-medium">New Booking</span>
                </Link>

                <Link
                  href="/admin/collections/bookings?where[status][equals]=pending"
                  className="flex items-center justify-between p-3 bg-yellow-100 hover:bg-yellow-200 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚠️</span>
                    <span className="text-sm font-medium text-gray-900">Pending Bookings</span>
                  </div>
                  <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                    7
                  </div>
                </Link>

                <Link
                  href="/admin/collections/inquiries"
                  className="flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💬</span>
                    <span className="text-sm font-medium text-gray-900">Inquiries</span>
                  </div>
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                    4
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Gutter>
  )
}

export default CustomDashboard