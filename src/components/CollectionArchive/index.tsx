import { useTranslations } from 'next-intl'
import { Registry, CollectionSlug, ArchiveCardProps } from '../ArchiveRegistry'
import React from 'react'
import { CMSLink } from '../Link'

export type Props<S extends CollectionSlug = CollectionSlug> = {
  docs: any[]
  relationTo: S
  /** Text for the archive button; defaults to “View all [collection label]” */
  archiveLabel?: string
  /** Overrides the URL for the archive button; defaults to `/${relationTo}` */
  archiveUrl?: string
}

export const CollectionArchive = <S extends CollectionSlug>({
  docs,
  relationTo,
  archiveLabel,
  archiveUrl,
  showArchiveLink = true,
}: Props<S> & { showArchiveLink?: boolean }) => {
  const t = useTranslations()
  // Use t() to translate the registry label at render time.
  const { component: CardComponent } = Registry[relationTo]
  // Get translation or fallback to the static label
  const translatedLabel = t(relationTo) || Registry[relationTo].label
  const defaultLabel = `See all ${translatedLabel} →`
  const href = archiveUrl || `/${relationTo}`

  return (
    <div className="container flex flex-col gap-16">
      <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
        {docs.map((doc, i) => (
          <div className="col-span-4" key={i}>
            <CardComponent
              doc={doc}
              relationTo={relationTo}
            />
          </div>
        ))}
      </div>

      {showArchiveLink && (
        <div className="flex justify-center text-foreground">
          <CMSLink
            type="custom"
            appearance="inline"
            url={href}
            label={archiveLabel || defaultLabel}
            size="lg"
          />
        </div>
      )}
    </div>
  )
}
