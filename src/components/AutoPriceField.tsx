// components/AutoPriceField.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useField, useForm } from '@payloadcms/ui'

interface AutoPriceFieldProps {
  roomFieldPath?: string
  priceFieldPath?: string
}

export const AutoPriceField: React.FC<AutoPriceFieldProps> = ({
  roomFieldPath = 'room',
  priceFieldPath = 'pricePerNight'
}) => {
  const { value: selectedRoom, setValue: setRoom } = useField({
    path: roomFieldPath
  })
  
  const { value: price, setValue: setPrice } = useField({
    path: priceFieldPath
  })
  
  const form = useForm()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadPrice = async () => {
      if (!selectedRoom) {
        if (price) {
          setPrice(undefined) // Clear price if room is cleared
        }
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/rooms/${selectedRoom}`)
        if (response.ok) {
          const data = await response.json()
          if (data.pricePerNight) {
            setPrice(data.pricePerNight)
          }
        }
      } catch (error) {
        console.error('Error loading room price:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Add slight delay to avoid rapid API calls
    const timer = setTimeout(loadPrice, 500)
    return () => clearTimeout(timer)
  }, [selectedRoom, setPrice, price])

  return null // This is a non-visual component
}