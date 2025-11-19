import React from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const mediaContent = isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />

  // Handle Fragment case - just return the content directly
  if (htmlElement === null) {
    return mediaContent
  }

  // Handle regular HTML elements using React.createElement to avoid JSX issues
  return React.createElement(
    htmlElement,
    { className },
    mediaContent
  )
}