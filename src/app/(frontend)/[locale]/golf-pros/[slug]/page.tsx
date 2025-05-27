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
import { Media } from '@/components/Media'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

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
          <div className="flex flex-col items-start py-8 gap-3 max-w-[48rem] mx-auto">
                    <div className="w-28 h-28 rounded-full bg-card shadow-md overflow-hidden bg-white dark:bg-black">
                      {golfPro.photo && typeof golfPro.photo !== 'string' ? (
                        <Media
                          resource={golfPro.photo}
                          className="w-full h-full object-contain flex items-center justify-center dark:invert dark:grayscale"
                          imgClassName="w-full h-full object-cover"
                          alt={golfPro.name}
                        />
                      ) : (
                        <div className="w-full h-32 sm:h-48 md:h-64 bg-muted flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <h3 id={`golfpro-card-title-${golfPro.slug}`} className="text-lg font-semibold text-foreground">
                      {golfPro.name || 'Unnamed Pro'}
                    </h3>
                    <div className="flex flex-row gap-1.5 p-2 bg-muted rounded-lg">
                      <MapPin aria-hidden="true" className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{golfPro.location}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{golfPro.organization}</p>
                    <Button asChild>
                            <Link href="/">
                                {'Book a lesson ->'}
                            </Link>
                            </Button>
                  </div>
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
