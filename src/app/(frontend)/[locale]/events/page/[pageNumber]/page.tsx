import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { TypedLocale } from 'payload'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
    locale: TypedLocale
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber, locale } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations()

  const page = Number(pageNumber)
  if (!Number.isInteger(page)) notFound()

  const events = await payload.find({
    collection: 'events',
    depth: 2,
    limit: 12,
    locale,
    page,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t('events')}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="events"
          currentPage={events.page}
          limit={12}
          totalDocs={events.totalDocs}
        />
      </div>

      <CollectionArchive docs={events.docs} relationTo="events" />

      <div className="container">
        {events.totalPages > 1 && events.page && (
          <Pagination page={events.page} totalPages={events.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Website Template Events Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    depth: 0,
    limit: 10,
    draft: false,
    overrideAccess: false,
  })

  const pages: { pageNumber: string }[] = []
  for (let i = 1; i <= events.totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }
  return pages
}
