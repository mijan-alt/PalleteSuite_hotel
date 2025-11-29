'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { SelectInput, useField } from '@payloadcms/ui'

interface RoomNumber {
  number: string
  floor?: number
  isAvailable: boolean
}

export const RoomNumberSelect: React.FC<any> = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  const [roomNumbers, setRoomNumbers] = useState<RoomNumber[]>([])
  const [loading, setLoading] = useState(false)

  // Get form values for room, checkIn, checkOut
  const room = useFormFields(([fields]) => fields?.room?.value)
  const checkIn = useFormFields(([fields]) => fields?.checkIn?.value)
  const checkOut = useFormFields(([fields]) => fields?.checkOut?.value)
  const bookingId = useFormFields(([fields]) => fields?.id?.value)

  useEffect(() => {
    const fetchRoomNumbers = async () => {
      if (!room) {
        setRoomNumbers([])
        return
      }

      setLoading(true)
      try {
        // Extract room ID
        const roomId =
          typeof room === 'object' && room !== null && 'id' in room ? (room as any).id : room

        // Build query params manually to avoid spread error
        const params = new URLSearchParams()
        params.append('roomId', String(roomId))

        if (checkIn) {
          params.append('checkIn', new Date(checkIn as string).toISOString())
        }

        if (checkOut) {
          params.append('checkOut', new Date(checkOut as string).toISOString())
        }

        if (bookingId) {
          params.append('excludeBookingId', String(bookingId))
        }

        const response = await fetch(`/api/bookings/available-rooms?${params.toString()}`, {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch room numbers')
        }

        const data = await response.json()
        setRoomNumbers(data.roomNumbers || [])
      } catch (error) {
        console.error('Error fetching room numbers:', error)
        setRoomNumbers([])
      } finally {
        setLoading(false)
      }
    }

    fetchRoomNumbers()
  }, [room, checkIn, checkOut, bookingId])

  // Show warning if dates are missing
  const missingDates = room && (!checkIn || !checkOut)

  // Filter to only show available rooms
  const availableRooms = roomNumbers.filter((rn) => rn.isAvailable)
  const occupiedRooms = roomNumbers.filter((rn) => !rn.isAvailable)

  const options = availableRooms.map((rn) => ({
    label: `${rn.number}${rn.floor ? ` (Floor ${rn.floor})` : ''}`,
    value: rn.number,
  }))

  return (
    <div className="field-type">
      <label className="field-label">
        {props.label || 'Assigned Room Number'}
        {props.required && <span className="required">*</span>}
      </label>

      {loading ? (
        <div className="field-description">Loading room numbers...</div>
      ) : !room ? (
        <div className="field-description" style={{ color: '#666' }}>
          Please select a room type first
        </div>
      ) : missingDates ? (
        <div
          style={{
            padding: '12px',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '8px',
            color: '#856404',
          }}
        >
          <strong>⚠️ Warning:</strong> Please set check-in and check-out dates to see accurate room
          availability.
        </div>
      ) : options.length === 0 ? (
        <div
          style={{
            padding: '12px',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '8px',
            color: '#721c24',
          }}
        >
          <strong>❌ No rooms available</strong> for the selected dates.
          {occupiedRooms.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              Occupied rooms: {occupiedRooms.map((r) => r.number).join(', ')}
            </div>
          )}
        </div>
      ) : (
        <>
          <SelectInput
            path={path}
            name={path}
            options={options}
            value={value as string}
            onChange={(selectedOption) => {
              if (
                selectedOption &&
                typeof selectedOption === 'object' &&
                'value' in selectedOption
              ) {
                setValue(selectedOption.value as string)
              }
            }}
          />
          <div className="field-description" style={{ marginTop: '8px', fontSize: '12px' }}>
            ✅ {availableRooms.length} room{availableRooms.length !== 1 ? 's' : ''} available
            {occupiedRooms.length > 0 && (
              <span style={{ color: '#dc3545', marginLeft: '12px' }}>
                • {occupiedRooms.length} occupied ({occupiedRooms.map((r) => r.number).join(', ')})
              </span>
            )}
          </div>
        </>
      )}

      {props.admin?.description && (
        <div className="field-description">{props.admin.description}</div>
      )}
    </div>
  )
}
