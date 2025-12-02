'use client'

import { useEffect } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { useField } from '@payloadcms/ui'
import type { Room } from '@/payload-types'

type Props = {
  path: string // This comes from clientProps: { path: 'room' }
}

export const RoomSelector: React.FC<Props> = ({ path }) => {
  // Now we can dynamically watch ANY relationship field, not just hardcoded 'room'
  console.log('RoomSelector mounted with path:', path)
  const room = useFormFields(([fields]) => fields[path]?.value as Room | string | null)

  const { setValue: setPrice } = useField<number>({ path: 'pricePerNight' })

  useEffect(() => {
    if (room && typeof room === 'object' && 'pricePerNight' in room) {
      setPrice((room as Room).pricePerNight ?? 0)
    }
  }, [room, setPrice])

  return null
}
