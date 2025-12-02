import React from 'react'
import { Gutter } from '@payloadcms/ui'
import { DashboardHeader } from './DashboardHeader'
import { MetricsGrid } from './MetricsGrid'
import { SuiteAvailability } from './SuiteAvailability'
import { RecentActivities } from './RecentActivities'
import { GuestRating } from './GuestRating'
import { TasksList } from './TaskList'
import { QuickActions } from './QuickActions'
import { cookies } from 'next/headers'

// Fetch data on the server
async function getDashboardData() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  try {
    const [metricsRes, availabilityRes, activitiesRes] = await Promise.all([
      fetch(`${baseUrl}/api/backend/bookings/metrics`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
      }),
      fetch(`${baseUrl}/api/backend/rooms/availability`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      }),
      fetch(`${baseUrl}/api/recent-activities`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      }),
    ])

    const [metrics, availability, activities] = await Promise.all([
      metricsRes.ok ? metricsRes.json() : null,
      availabilityRes.ok ? availabilityRes.json() : null,
      activitiesRes.ok ? activitiesRes.json() : null,
    ])

    return { metrics, availability, activities: activities?.activities || [] }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return { metrics: null, availability: null, activities: [] }
  }
}

export default async function CustomDashboard() {
  const data = await getDashboardData()

  return (
    <Gutter className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="space-y-8">
        <MetricsGrid metrics={data.metrics} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            <SuiteAvailability availability={data.availability} />
            <RecentActivities activities={data.activities} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* <GuestRating /> */}
            {/* <TasksList /> */}
            <QuickActions />
          </div>
        </div>
      </div>
    </Gutter>
  )
}
