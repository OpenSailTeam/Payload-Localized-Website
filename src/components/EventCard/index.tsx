'use client'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import type { Event } from '@/payload-types'
import { Media } from '@/components/Media'
import { ArchiveCardProps } from '../ArchiveRegistry'
import { FlagTriangleRight, MapPin } from 'lucide-react'

export const EventCard: React.FC<ArchiveCardProps<Event>> = ({
  doc,
  relationTo,
  title: titleOverride,
  className,
}) => {
  const {
    slug,
    dateStart,
    dateEnd,
    facility,
    location,
    zone,
    title,
    meta,
  } = doc || {}

  const titleToUse = titleOverride || title || 'Untitled event'

  // format dates like "May 12 – 18, 2025"
  const formattedDate =
    dateStart && dateEnd
      ? (() => {
          const opts: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }
          const d1 = new Date(dateStart).toLocaleDateString(undefined, opts)
          const d2 = new Date(dateEnd).toLocaleDateString(undefined, opts)
          const [m1, day1, year1] = d1.replace(',', '').split(' ')
          const [m2, day2, year2] = d2.replace(',', '').split(' ')
          if (m1 === m2 && year1 === year2) {
            return `${m1} ${day1} – ${day2}, ${year1}`
          }
          return `${d1} – ${d2}`
        })()
      : ''

  const href = `/${relationTo}/${slug}`

  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-shadow hover:shadow-md h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
        className
      )}
      aria-labelledby={`event-card-title-${slug}`}
      tabIndex={0}
    >
      {/* Image */}
      <div className="w-full overflow-hidden">
        {meta?.image && typeof meta.image !== 'string' ? (
          <Media
            resource={meta.image}
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

      <div className="flex flex-col flex-grow p-5 pb-8 gap-3">
        <div className="flex items-end flex-grow">
          {formattedDate && (
            <time
              dateTime={`${dateStart}/${dateEnd}`}
              className="w-full text-sm text-muted-foreground"
            >
              {formattedDate}
            </time>
          )}

          {zone && typeof zone !== 'string' && zone.logo && (
            <div className="w-full flex justify-center -mt-24">
              <div className="w-28 h-28 rounded-full bg-card p-1 shadow-md overflow-hidden bg-white dark:bg-black">
                <Media
                  resource={zone.logo}
                  className="w-full h-full object-contain flex items-center justify-center dark:invert dark:grayscale"
                  alt={zone.title || 'Zone logo'}
                />
              </div>
            </div>
          )}
        </div>

        <h3
          id={`event-card-title-${slug}`}
          className="text-lg font-semibold text-foreground"
        >
          {titleToUse}
        </h3>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {facility && typeof facility !== 'string' && (
            <div className="flex items-center">
              <FlagTriangleRight
                aria-hidden="true"
                className="w-4 h-4 mr-2 text-muted-foreground"
              />
              <span>{facility.title}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center">
              <MapPin
                aria-hidden="true"
                className="w-4 h-4 mr-2 text-muted-foreground"
              />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      <div
        className="block w-full p-5 border-t border-border text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        aria-label={`View details for ${titleToUse}`}
      >
        View event details →
      </div>
    </Link>
  )
}
