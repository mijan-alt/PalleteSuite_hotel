// src/components/StatusWithRoomCheck.tsx
'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import { SelectInput } from '@payloadcms/ui'

export const StatusWithRoomCheck: React.FC<any> = (props) => {
  const assignedRoomNumber = useFormFields(([fields]) => fields.assignedRoomNumber?.value)

  const hasRoomNumber = !!assignedRoomNumber

  // Correct way in Payload v3: options come directly in props
  const originalOptions = props.options || []

  const filteredOptions = originalOptions.filter((option: any) => {
    // Remove "checked-in" if no room number is assigned
    if (option.value === 'checked-in' && !hasRoomNumber) {
      return false
    }
    return true
  })

  // Optional: show a helpful message when checked-in is blocked
  const description = !hasRoomNumber
    ? 'Assign a room number before checking in the guest'
    : props.admin?.description

  return (
    <SelectInput
      {...props}
      options={filteredOptions}
      admin={{
        ...props.admin,
        description,
      }}
    />
  )
}
