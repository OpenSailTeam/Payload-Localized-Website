import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { TypedLocale } from 'payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const revalidate = 600

type Args = {
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function Page({ params }: Args) {
  const { locale = 'en' } = await params
  const t = await getTranslations()
  const payload = await getPayload({ config: configPromise })

  const golfPros = await payload.find({
    collection: 'golf-pros',
    locale,
    depth: 1,
    limit: 12,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t('golf-pros')}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="golf-pros" 
          currentPage={golfPros.page}
          limit={12}
          totalDocs={golfPros.totalDocs}
        />
      </div>

      <CollectionArchive docs={golfPros.docs} relationTo={'golf-pros'} showArchiveLink={false} /> 

      <div className="container">
        {golfPros.totalPages > 1 && golfPros.page && (
          <Pagination page={golfPros.page} totalPages={golfPros.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Golf Pros`,
  }
}
