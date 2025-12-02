import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  iconBg: string
}

export function MetricCard({ title, value, change, icon, iconBg }: MetricCardProps) {
  const isPositive = change >= 0
  const absChange = Math.abs(change)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 ${iconBg} rounded-lg`}>{icon}</div>
      </div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      <div className="flex items-center gap-1 mt-2 text-xs">
        <div className="flex items-center gap-1 text-sm font-medium">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {absChange.toFixed(1)}%
          </span>
        </div>
        <span className="text-gray-500">vs last week</span>
      </div>
    </div>
  )
}