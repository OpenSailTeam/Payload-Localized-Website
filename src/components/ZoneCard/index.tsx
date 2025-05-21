'use client'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import type { Zone } from '@/payload-types'
import { Media } from '@/components/Media'
import { ArchiveCardProps } from '../ArchiveRegistry'

export const ZoneCard: React.FC<ArchiveCardProps<Zone>> = ({
  doc,
  relationTo,
  title: titleOverride,
  className,
}) => {
  const { card, link } = useClickableCard({})
  const { slug, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const titleToUse = titleOverride || title || 'Untitled zone'
  const href = `/${relationTo}/${slug}`

  // Truncate description to ~100 chars
  const excerpt = description
    ? description.replace(/\s+/g, ' ').trim().slice(0, 100) + '…'
    : ''

  return (
    <article
      ref={card.ref}
      aria-labelledby={`zone-card-title-${slug}`}
      className={cn(
        'group flex flex-col h-full bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Image */}
      <div className="w-full overflow-hidden">
        {metaImage && typeof metaImage !== 'string' ? (
          <Media
            resource={metaImage}
            size="720px"
            className="w-full h-32 sm:h-48 md:h-64"
            imgClassName="w-full h-full object-cover"
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
          <Link
            href={href}
            ref={link.ref}
            className="inline-block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            {titleToUse}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-muted-foreground flex-grow">
            {excerpt}
          </p>
        )}
      </div>

      {/* Explore link */}
      <Link
        href={href}
        ref={link.ref}
        className="block w-full p-5 border-t border-border text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        aria-label={`Learn more about ${titleToUse}`}
      >
        Learn more →
      </Link>
    </article>
  )
}
