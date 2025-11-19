import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <Image
      alt="cfgglogo"
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx(' h-12 w-auto', className)}
      src="/assets/logos/sunlink.png"
      width={505}
      height={403}
    />
  )
}
