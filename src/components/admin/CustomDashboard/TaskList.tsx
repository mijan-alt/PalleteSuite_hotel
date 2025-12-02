import React from 'react'
import { Plus, MoreVertical } from 'lucide-react'

export function TasksList() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Tasks</h2>
        <button className="w-8 h-8 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center justify-center text-white transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-3">
        {[
          { date: 'June 17', title: 'Set Up Conference Room B' },
          { date: 'June 17', title: 'Restock 3rd Floor Supplies' },
          { date: 'June 20', title: 'Pool Area Inspection' },
        ].map((task, i) => (
          <div
            key={i}
            className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">{task.date}</p>
                <p className="font-medium text-gray-900 mt-0.5">{task.title}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}