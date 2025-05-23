'use client'
import React, { Fragment } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { ArchiveCardProps } from '../ArchiveRegistry'

export const Card: React.FC<ArchiveCardProps<Post>> = ({
  doc,
  relationTo,
  showCategories = false,
  title: titleOverride,
  className,
}) => {
  const { card, link } = useClickableCard({})
  const { slug, publishedAt, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const titleToUse = titleOverride || title || 'Untitled post'
  const href = `/${relationTo}/${slug}`

  // truncate description to ~120 chars
  const excerpt = description ? description.replace(/\s+/g, ' ').trim().slice(0, 120) + '…' : ''

  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-shadow hover:shadow-md h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
        className,
      )}
      aria-labelledby={`event-card-title-${slug}`}
      tabIndex={0}
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
        {/* Date */}
        {publishedAt && (
          <time dateTime={publishedAt} className="text-sm text-muted-foreground">
            {new Date(publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        )}

        {/* Categories */}
        {showCategories && Array.isArray(categories) && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => {
              if (typeof cat === 'object') {
                return (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded"
                  >
                    {cat.title}
                  </span>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Title */}
        <h3 id={`post-card-title-${slug}`} className="text-lg font-semibold text-foreground">
          {titleToUse}
        </h3>

        {/* Excerpt */}
        {excerpt && <p className="text-sm text-muted-foreground flex-grow">{excerpt}</p>}
      </div>

      <div
        className="block w-full p-5 border-t border-border text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        aria-label={`Read full text of ${titleToUse}`}
      >
        Read more →
      </div>
    </Link>
  )
}
