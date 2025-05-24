import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { GolfPro } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { TypedLocale } from 'payload'
import { routing } from '@/i18n/routing'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { LowImpactHero } from '@/heros/LowImpact'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const golfPros = await payload.find({
    collection: 'golf-pros',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return golfPros.docs.flatMap(({ slug }) => 
    routing.locales.map(locale => ({
      slug,
      locale
    }))
  )
}

type Args = {
  params: Promise<{
    slug?: string
    locale?: TypedLocale
  }>
}

export default async function GolfPro({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', locale = 'en' } = await paramsPromise
  const url = '/golf-pros/' + slug
  const golfPro = await queryGolfPro({ slug, locale })

  if (!golfPro) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <LowImpactHero />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={golfPro.description} enableGutter={false} />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale = 'en' } = await paramsPromise
  const golfPro = await queryGolfPro({ slug, locale })

  return generateMeta({ doc: golfPro })
}

const queryGolfPro = cache(async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'golf-pros',
    draft,
    limit: 1,
    overrideAccess: draft,
    locale,
    where: {
      slug: {
        equals: slug,
      },
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs?.[0] || null
})
