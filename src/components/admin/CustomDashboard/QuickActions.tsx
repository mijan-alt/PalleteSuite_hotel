import React from 'react'
import Link from 'next/link'
import { Calendar, AlertCircle, MessageSquare } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <Link
          href="/admin/collections/bookings/create"
          className="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium">New Booking</span>
        </Link>

        <Link
          href="/admin/collections/bookings?where[status][equals]=pending"
          className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="font-medium text-gray-900">Pending Bookings</span>
          </div>
          <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            7
          </div>
        </Link>

        <Link
          href="/admin/collections/inquiries"
          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Inquiries</span>
          </div>
          <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
            4
          </div>
        </Link>
      </div>
    </div>
  )
}