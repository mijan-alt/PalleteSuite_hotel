'use client'

import { useEffect } from 'react'
import { useFormFields, useForm } from '@payloadcms/ui'

export const DateRangeCalculator = () => {
  const checkIn = useFormFields(([fields]) => fields.checkIn?.value)
  const checkOut = useFormFields(([fields]) => fields.checkOut?.value)
  const pricePerNight = useFormFields(([fields]) => fields.pricePerNight?.value)
  const discount = useFormFields(([fields]) => fields.discount?.value)
  const form = useForm()

  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn as string)
      const checkOutDate = new Date(checkOut as string)
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
      const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

      const totalNights = nights > 0 ? nights : 1
      
      form.dispatchFields({
        type: 'UPDATE',
        path: 'totalNights',
        value: totalNights,
      })
      console.log('Auto-calculated totalNights:', totalNights)

      // Calculate total price if we have pricePerNight
      if (pricePerNight && totalNights) {
        const price = Number(pricePerNight) || 0
        const discountAmount = Number(discount) || 0
        const totalPrice = price * totalNights - discountAmount
        
        form.dispatchFields({
          type: 'UPDATE',
          path: 'totalPrice',
          value: totalPrice,
        })
        console.log('Auto-calculated totalPrice:', totalPrice)
      }
    }
  }, [checkIn, checkOut, pricePerNight, discount, form])

  return null
}
