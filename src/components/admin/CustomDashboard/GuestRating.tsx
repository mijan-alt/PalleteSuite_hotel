import React from 'react'
import { Star, MoreVertical } from 'lucide-react'

export function GuestRating() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Guest Rating</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-900">
          4.6<span className="text-2xl text-gray-400">/5</span>
        </div>
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">from 254 reviews</p>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Cleanliness', value: 4.7 },
          { label: 'Comfort', value: 4.8 },
          { label: 'Service', value: 4.6 },
          { label: 'Location', value: 4.5 },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${(item.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}