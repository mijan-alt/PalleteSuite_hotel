import React from 'react'
import Link from 'next/link'
import { LogOut, LogIn, Calendar, MessageSquare } from 'lucide-react'

interface Activity {
  id: string
  time: string
  description: string
  detail: string
  iconType: 'check-out' | 'check-in' | 'new-booking' | 'inquiry'
}

interface RecentActivitiesProps {
  activities: Activity[]
}

const getActivityIcon = (iconType: Activity['iconType']) => {
  const iconProps = { size: 18, strokeWidth: 2 }
  switch (iconType) {
    case 'check-out':
      return <LogOut {...iconProps} className="text-red-600" />
    case 'check-in':
      return <LogIn {...iconProps} className="text-green-600" />
    case 'new-booking':
      return <Calendar {...iconProps} className="text-blue-600" />
    case 'inquiry':
      return <MessageSquare {...iconProps} className="text-amber-600" />
    default:
      return <Calendar {...iconProps} className="text-blue-600" />
  }
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
        <Link
          href="/admin/collections/bookings"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No recent activities</div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                {getActivityIcon(activity.iconType)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-600">{activity.detail}</p>
              </div>
              <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
