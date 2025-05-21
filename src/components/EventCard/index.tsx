'use client'
import React, { Fragment } from 'react'
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
  showCategories,
  title: titleOverride,
  className,
}) => {
  const { card, link } = useClickableCard({})

  const { slug, startDate, endDate, golfCourse, location, zone, title, meta } = doc || {}

  const titleToUse = titleOverride || title || 'Untitled event'

  // format dates like "May 12 – 18, 2025"
  const formattedDate =
    startDate && endDate
      ? (() => {
          const opts: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }
          const d1 = new Date(startDate).toLocaleDateString(undefined, opts)
          const d2 = new Date(endDate).toLocaleDateString(undefined, opts)
          // if same month & year, drop repeated parts, e.g. "May 12 – 18, 2025"
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
    <article
      ref={card.ref}
      className={cn(
        'group flex flex-col bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border',
        className,
      )}
      aria-labelledby={`event-card-title-${slug}`}
    >
      <div className="w-full overflow-hidden">
        {meta?.image && typeof meta.image !== 'string' ? (
          <Media
            resource={meta.image}
            size="720px"
            className="w-full h-full object-cover"
            alt={titleToUse}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-5 pb-8 gap-3">
        <div className="flex flex-row flex-grow items-end">
          {formattedDate && (
            <time
              dateTime={`${startDate}/${endDate}`}
              className="text-sm text-gray-500 w-full h-fit"
            >
              {formattedDate}
            </time>
          )}

          {zone && typeof zone !== 'string' && zone.logo && (
            <div className="flex items-center justify-center w-full">
              <div className="w-28 h-28 rounded-full bg-white p-1 shadow-md overflow-hidden -mt-20">
                <Media
                  resource={zone.logo}
                  size=""
                  className="w-full h-full object-contain flex items-center justify-center"
                  alt={zone.title || 'Zone logo'}
                />
              </div>
            </div>
          )}
        </div>

        <h3 id={`event-card-title-${slug}`} className="text-lg font-semibold text-gray-900">
          <Link
            href={href}
            ref={link.ref}
            className="inline-block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {titleToUse}
          </Link>
        </h3>

        <div className="flex flex-col gap-2 text-gray-600 text-sm">
          {golfCourse && (
            <div className="flex items-center">
              <FlagTriangleRight aria-hidden="true" className="w-4 h-4 mr-2 text-gray-400" />
              <span>{golfCourse}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center">
              <MapPin aria-hidden="true" className="w-4 h-4 mr-2 text-gray-400" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>
      <Link
        href={href}
        ref={link.ref}
        className="text-red-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 p-5 border-t"
        aria-label={`View details for ${titleToUse}`}
      >
        View event details →
      </Link>
    </article>
  )
}
