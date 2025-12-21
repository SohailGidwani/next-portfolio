"use client"

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

type Props = Omit<ImageProps, 'onLoadingComplete' | 'placeholder' | 'blurDataURL'> & {
  showSkeleton?: boolean
}

const BLUR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2U1ZTVlNSIvPjwvc3ZnPg=='

export default function ProgressiveImage({ showSkeleton = true, ...props }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative w-full h-full">
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-xl" />
      )}
      <Image
        {...props}
        alt={props.alt || ''}
        placeholder="blur"
        blurDataURL={BLUR}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
