import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Event } from '@/payload-types'

import { Media } from '@/components/Media'
import { useTranslations } from 'next-intl'

export const EventHero: React.FC<{
  event: Event
}> = ({ event }) => {
  const {
    dateStart,
    dateEnd,
    facility,
    location,
    golfGeniusURL,
    zone,
    sponsors,
    meta: { image: metaImage } = {},
    populatedOrganizers,
    publishedAt,
    title,
    participantCap,
    participants,
    registrationDeadline,
  } = event
  const t = useTranslations()

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

  const formattedRegistrationDeadline =
    registrationDeadline ? (() => {
      const opts: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
      return new Date(registrationDeadline).toLocaleDateString(undefined, opts)
    })() : ''

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {dateStart && dateEnd && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{t('date')}</p>

                <time dateTime={`${dateStart}/${dateEnd}`}>{formattedDate}</time>
              </div>
            )}
            {facility && typeof facility !== 'string' && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{t('facility')}</p>

                <p>{facility.title}</p>
              </div>
            )}
            {location && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{t('facility')}</p>

                <p>{location}</p>
              </div>
            )}
            {zone && typeof zone !== 'string' && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{t('zone')}</p>

                <p>{zone.title}</p>
              </div>
            )}
            {registrationDeadline && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{`Registration Deadline`}</p>

                <time dateTime={`${registrationDeadline}`}>{formattedRegistrationDeadline}</time>
              </div>
            )}
            {participantCap && participants && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{`Participants`}</p>

                <p>
                  {participants}/{participantCap}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {metaImage && typeof metaImage !== 'string' && (
          <Media fill imgClassName="-z-10 object-cover" resource={metaImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
