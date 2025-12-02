import React from 'react'
import { MetricCard } from './MetricCard'
import { Box, CircleArrowOutDownRight, CircleArrowOutUpRight } from 'lucide-react'

interface MetricsGridProps {
  metrics: {
    newBookings: number
    newBookingsChange: number
    checkIns: number
    checkInsChange: number
    checkOuts: number
    checkOutsChange: number
    totalRevenue: number
    totalRevenueChange: number
  } | null
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="New Bookings"
        value={metrics.newBookings}
        change={metrics.newBookingsChange}
        icon={<Box className="w-5 h-5 text-blue-600" />}
        iconBg="bg-blue-100"
      />
      <MetricCard
        title="Check-Ins"
        value={metrics.checkIns}
        change={metrics.checkInsChange}
        icon={<CircleArrowOutDownRight className="w-5 h-5 text-green-600" />}
        iconBg="bg-green-100"
      />
      <MetricCard
        title="Check-Outs"
        value={metrics.checkOuts}
        change={metrics.checkOutsChange}
        icon={<CircleArrowOutUpRight className="w-5 h-5 text-red-600" />}
        iconBg="bg-red-100"
      />
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(metrics.totalRevenue)}
        change={metrics.totalRevenueChange}
        icon={<span className="text-xl font-bold text-purple-600">₦</span>}
        iconBg="bg-purple-100"
      />
    </div>
  )
}