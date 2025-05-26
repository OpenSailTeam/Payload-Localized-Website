import React from 'react'
import type { Event } from '@/payload-types'
import RichText from './RichText'
import { Form } from '@payloadcms/ui'
import RegistrationOption from '@/blocks/RegistrationOption/Component'
import { SponsorCard } from './SponsorCard'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'

const EventDetails: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <section className="my-16 container">
      {event.sponsors && (
        <div className="z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr]">
          <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
            <div className="">
              <h2 className="text-2xl font-bold mb-4">Brought to you by</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              {event.sponsors.length > 0 &&
                event.sponsors.map((sponsor) =>
                  typeof sponsor !== 'string' ? (
                    <div key={sponsor.id}>
                      <SponsorCard doc={sponsor} relationTo="sponsors" title={sponsor.title} />
                    </div>
                  ) : null,
                )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 pt-8 mb-8">
        <RichText className="max-w-[48rem] mx-auto" data={event.description} enableGutter={false} />
      </div>
      {event.registrationOptions && event.registrationOptions.length > 0 && (
        <div className="mx-auto overflow-hidden max-w-[48rem]">
          <h2 className="text-2xl font-bold mb-4">Registration</h2>
          <div className="flex flex-col gap-4">
            {event.registrationOptions.map((option) => (
              <RegistrationOption key={option.id} option={option} eventId={event.id} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default EventDetails
