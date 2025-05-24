import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import { TypedLocale } from 'payload'

// src/blocks/ArchiveBlock/Component.tsx
export const ArchiveBlock: React.FC<ArchiveBlockProps & { locale: TypedLocale }> = async ({
    id,
    populateBy,
    relationTo,
    selectedDocs,
    categories,
    limit: limitProp,
    locale,
    introContent,
    showArchiveLink = true,
    archiveLabel,
    archiveUrl,
  }) => {
  const limit = limitProp || 3;
  let docs: any[] = [];

  if (populateBy === 'collection' && relationTo) {
    const payload = await getPayload({ config: configPromise });
    const criteria = categories?.length
      ? { where: { categories: { in: categories.map(c => typeof c === 'object' ? c.id : c) } } }
      : {};
    const result = await payload.find({
      collection: relationTo,
      depth: 2,
      locale,
      limit,
      ...criteria,
    });
    docs = result.docs;
  } else if (selectedDocs?.length) {
    docs = selectedDocs.map(d => typeof d.value === 'object' ? d.value : null).filter(Boolean);
  }



  if (!relationTo) {
    // you could throw, log, or simply return null/placeholder
    return (
      <div className="my-16">
        <p>Please pick a collection in the block settings.</p>
      </div>
    )
  }

  return (
    <div id={`block-${id}`} className="my-16">
      {introContent && (
        <div className="container mb-12 text-center sm:text-left">
          <RichText data={introContent} enableGutter={false} />
        </div>
      )}

      <CollectionArchive
        docs={docs}
        relationTo={relationTo}
        archiveLabel={archiveLabel ?? undefined}
        archiveUrl={archiveUrl ?? undefined}
        showArchiveLink={showArchiveLink ?? undefined}
      />
    </div>
  );
};
