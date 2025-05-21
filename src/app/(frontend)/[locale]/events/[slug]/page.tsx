import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import type { Event } from '@/payload-types'
import { EventHero } from '@/heros/EventHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { TypedLocale } from 'payload'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return events.docs.flatMap(({ slug }) =>
    routing.locales.map(locale => ({ slug, locale }))
  )
}

type Args = {
  params: Promise<{
    slug?: string
    locale?: TypedLocale
  }>
}

export default async function EventPage({ params: paramsPromise }: Args) {
  const { slug = '', locale = 'en' } = await paramsPromise
  const url = `/events/${slug}`
  const event = await queryEvent({ slug, locale })

  if (!event) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects even for valid slugs */}
      <PayloadRedirects disableNotFound url={url} />

      <EventHero event={event} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container lg:mx-0 lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
          <RichText
            className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
            content={event.description}
            enableGutter={false}
          />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale = 'en' } = await paramsPromise
  const event = await queryEvent({ slug, locale })
  return generateMeta({ doc: event })
}

const queryEvent = cache(async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 1,
    overrideAccess: draft,
    locale,
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
  })

  return (result.docs && result.docs[0]) || null
})
