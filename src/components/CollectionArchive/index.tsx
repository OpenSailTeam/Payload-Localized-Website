import { Registry, CollectionSlug, ArchiveCardProps } from '../ArchiveRegistry'
import React from 'react'

export type Props<S extends CollectionSlug = CollectionSlug> = {
  docs: any[]                 // or better: docs: DocMap[S][] if you define DocMap
  relationTo: S
}

export const CollectionArchive = <S extends CollectionSlug>({
  docs,
  relationTo,
}: Props<S>) => {
  const CardComponent = Registry[relationTo] as React.FC<ArchiveCardProps<any>>

  return (
    <div className="container">
      <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
        {docs.map((doc, i) => (
          <div className="col-span-4" key={i}>
            <CardComponent
              doc={doc}
              relationTo={relationTo}
              showCategories
            />
          </div>
        ))}
      </div>
    </div>
  )
}
