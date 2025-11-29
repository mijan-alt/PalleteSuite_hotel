'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const ReadOnlyRoomDisplay: React.FC<any> = (props) => {
  const assignedRoomNumber = useFormFields(([fields]) => fields?.assignedRoomNumber?.value)

  // Convert to string for display
  const displayValue = assignedRoomNumber ? String(assignedRoomNumber) : 'N/A'

  return (
    <div className="field-type">
      <label className="field-label">{props.label || 'Room Number (Historical)'}</label>
      <div
        style={{
          padding: '10px 12px',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          color: '#495057',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        {displayValue}
      </div>
      {props.admin?.description && (
        <div className="field-description" style={{ marginTop: '4px' }}>
          {props.admin.description}
        </div>
      )}
    </div>
  )
}
