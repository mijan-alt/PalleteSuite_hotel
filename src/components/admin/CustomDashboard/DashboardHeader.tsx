'use client'
import React from 'react'
import { useAuth } from '@payloadcms/ui'

export function DashboardHeader() {
  const { user } = useAuth()

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back,{' '}
            <span className="font-medium">{user?.name?.split(' ')[0] || 'Administrator'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-700">All systems operational</span>
        </div>
      </div>
    </div>
  )
}
