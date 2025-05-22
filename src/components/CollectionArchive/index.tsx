import { Registry, CollectionSlug, ArchiveCardProps } from '../ArchiveRegistry'
import React from 'react'
import { CMSLink } from '../Link'

export type Props<S extends CollectionSlug = CollectionSlug> = {
  docs: any[]                 // or DocMap[S][]
  relationTo: S
  /** Text for the archive button; defaults to “View all [relationTo]” */
  archiveLabel?: string
  /** Overrides the URL for the archive button; defaults to `/${relationTo}` */
  archiveUrl?: string
}

export const CollectionArchive = <S extends CollectionSlug>({
  docs,
  relationTo,
  archiveLabel,
  archiveUrl,
}: Props<S>) => {
  const CardComponent = Registry[relationTo] as React.FC<ArchiveCardProps<any>>
  // Build defaults:
  const defaultLabel = `See all ${relationTo} ->`
  const href = archiveUrl || `/${relationTo}`

  return (
    <div className="container flex flex-col gap-16">
      <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
        {docs.map((doc, i) => (
          <div className="col-span-4" key={i}>
            <CardComponent
              doc={doc}
              relationTo={relationTo}
              // showCategories?
            />
          </div>
        ))}
      </div>

      {/* Archive link/button */}
      <div className="flex justify-center text-foreground">
        <CMSLink
          type="custom"
          appearance="inline" // or 'secondary', 'primary', etc.
          url={href}
          label={archiveLabel || defaultLabel}
          size="lg"
        />
      </div>
    </div>
  )
}
