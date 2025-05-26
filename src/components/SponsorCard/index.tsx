'use client'
import React, { Fragment } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import type { Sponsor } from '@/payload-types'
import { Media } from '@/components/Media'
import { ArchiveCardProps } from '../ArchiveRegistry'

export const SponsorCard: React.FC<ArchiveCardProps<Sponsor>> = ({
  doc,
  title: titleOverride,
  className,
}) => {
  const { card, link } = useClickableCard({})
  const { slug, meta, title, website, logo } = doc || {}
  const { description, image: metaImage } = meta || {}

  const titleToUse = titleOverride || title || 'Untitled post'

  // truncate description to ~120 chars
  const excerpt = description ? description.replace(/\s+/g, ' ').trim().slice(0, 120) + '…' : ''

  return (
    <Link
      href={website}
      className={cn(
        'group flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-shadow hover:shadow-md h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
        className,
      )}
      aria-labelledby={`event-card-title-${slug}`}
      tabIndex={0}
    >
      {/* Image */}
      <div className="w-full overflow-hidden">
        {logo && typeof logo !== 'string' ? (
          <Media
            resource={logo}
            size="360px"
            className="w-full h-16 sm:h-24 md:h-32"
            imgClassName="w-full h-full object-contain p-4"
            alt={titleToUse}
          />
        ) : (
          <div className="w-full h-16 sm:h-24 md:h-32 bg-muted flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-4 py-2 gap-1">

        {/* Title */}
        <h3 id={`post-card-title-${slug}`} className="text-lg font-semibold text-foreground">
          {titleToUse}
        </h3>

        {/* Excerpt */}
        {excerpt && <p className="text-sm text-muted-foreground flex-grow">{excerpt}</p>}
      </div>

      <div
        className="text-sm block w-full px-4 py-2 border-t border-border text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        aria-label={`Read full text of ${titleToUse}`}
      >
        Learn more →
      </div>
    </Link>
  )
}
