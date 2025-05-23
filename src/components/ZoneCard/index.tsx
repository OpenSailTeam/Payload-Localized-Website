'use client'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { Zone } from '@/payload-types'
import { Media } from '@/components/Media'
import { ArchiveCardProps } from '../ArchiveRegistry'

export const ZoneCard: React.FC<ArchiveCardProps<Zone>> = ({
  doc,
  relationTo,
  title: titleOverride,
  className,
}) => {
  const { slug, meta, title, logo } = doc || {}
  const { description, image: metaImage } = meta || {}

  const titleToUse = titleOverride || title || 'Untitled zone'
  const href = `/${relationTo}/${slug}`

  // Truncate description to ~100 chars
  const excerpt = description
    ? description.replace(/\s+/g, ' ').trim().slice(0, 100) + '…'
    : ''

  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col h-full bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
        className
      )}
      aria-labelledby={`zone-card-title-${slug}`}
      tabIndex={0}
    >
      {/* Image */}
      <div className="w-full overflow-hidden">
        {logo && typeof logo !== 'string' ? (
          <Media
            resource={logo}
            size="720px"
            className="w-full h-32 sm:h-48 md:h-64 bg-white"
            imgClassName="w-full h-full object-contain"
            alt={titleToUse}
          />
        ) : (
          <div className="w-full h-32 sm:h-48 md:h-64 bg-muted flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5 gap-3">
        {/* Title */}
        <h3
          id={`zone-card-title-${slug}`}
          className="text-lg font-semibold text-foreground"
        >
          {titleToUse}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-muted-foreground flex-grow">
            {excerpt}
          </p>
        )}
      </div>

      {/* Explore link visually hidden for screen readers */}
      <span className="sr-only" aria-hidden="false">
        Learn more about {titleToUse}
      </span>
    </Link>
  )
}
