// src/components/CustomSearch.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // This is the ONLY URL that actually works in Payload v2
    router.push(`/admin/collections/bookings?limit=50&where[or][0][firstName][like]=${query}&where[or][1][lastName][like]=${query}&where[or][2][email][like]=${query}&where[or][3][bookingId][like]=${query}`)
  }

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search bookings: name, email, PAL-2025-XXXXXX"
        className="w-full max-w-md px-4 py-2 border rounded-lg text-sm"
        autoFocus
      />
    </form>
  )
}