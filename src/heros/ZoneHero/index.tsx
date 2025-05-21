import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Zone } from '@/payload-types'

import { Media } from '@/components/Media'
import { useTranslations } from 'next-intl'

export const ZoneHero: React.FC<{
  zone: Zone
}> = ({ zone }) => {
  const { meta: { image: metaImage } = {}, title } = zone
  const t = useTranslations()

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
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
