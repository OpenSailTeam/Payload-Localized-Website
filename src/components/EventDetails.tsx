import React from 'react'
import type { Event } from '@/payload-types'
import RichText from './RichText'
import { Form } from '@payloadcms/ui'
import RegistrationOption from '@/blocks/RegistrationOption/Component'

const EventDetails: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <section className="my-16">
      <div className="container">
        <div className="mx-auto overflow-hidden max-w-[48rem]">
          <div className="flex flex-col md:flex-row gap-4 md:gap-16 mb-2">
            {event.sponsors &&
              event.sponsors.length > 0 &&
              event.sponsors.map((sponsor) =>
                typeof sponsor !== 'string' ? (
                  <div key={sponsor.id}>
                    <img
                      src={
                        typeof sponsor.logo === 'string'
                          ? sponsor.logo
                          : (sponsor.logo?.url ?? undefined)
                      }
                      alt={sponsor.title}
                      className="h-24 w-auto"
                    />
                  </div>
                ) : null,
              )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText
            className="max-w-[48rem] mx-auto"
            data={event.description}
            enableGutter={false}
          />
        </div>
      </div>
      {event.registrationOptions && event.registrationOptions.length > 0 && (
        <div className="container">
          <div className="mx-auto overflow-hidden max-w-[48rem]">
            <h2 className="text-2xl font-bold mb-4">Registration Options</h2>
            <div className="flex flex-col gap-4">
              {event.registrationOptions.map((option) => (
                <RegistrationOption
                  key={option.id}
                  option={option}
                  eventId={event.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default EventDetails
