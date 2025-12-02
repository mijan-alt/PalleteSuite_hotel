'use client'

import { useEffect } from 'react'
import { useFormFields, useForm } from '@payloadcms/ui'

export const PriceCalculator = () => {
  const pricePerNight = useFormFields(([fields]) => fields.pricePerNight?.value)
  const totalNights = useFormFields(([fields]) => fields.totalNights?.value)
  const discount = useFormFields(([fields]) => fields.discount?.value)
  const form = useForm()

  useEffect(() => {
    if (pricePerNight && totalNights) {
      const price = Number(pricePerNight) || 0
      const nights = Number(totalNights) || 0
      const discountAmount = Number(discount) || 0
      const totalPrice = price * nights - discountAmount
      
      form.dispatchFields({
        type: 'UPDATE',
        path: 'totalPrice',
        value: totalPrice,
      })
      console.log('Auto-calculated totalPrice:', totalPrice)
    }
  }, [pricePerNight, totalNights, discount, form])

  return null
}
