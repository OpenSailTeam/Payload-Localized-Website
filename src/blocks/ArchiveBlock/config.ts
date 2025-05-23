import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1','h2','h3','h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Intro Content',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Collection', value: 'collection' },
        { label: 'Individual Selection', value: 'selection' },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: { condition: (_, data) => data.populateBy === 'collection' },
      defaultValue: 'posts',
      label: 'Collection to Show',
      options: [
        { label: 'Posts', value: 'posts' },
        { label: 'Events', value: 'events' },
        { label: 'Zones',  value: 'zones'  },
        { label: 'Golf Pros',  value: 'golf-pros'  },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      hasMany: true,
      relationTo: 'categories',
      admin: { condition: (_, data) => data.populateBy === 'collection' },
      label: 'Categories To Show',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
      admin: {
        condition: (_, data) => data.populateBy === 'collection',
        step: 1,
      },
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      hasMany: true,
      relationTo: ['posts','events','zones'],
      admin: { condition: (_, data) => data.populateBy === 'selection' },
      label: 'Select Documents',
    },
    // ── NEW FIELDS ──
    {
      name: 'showArchiveLink',
      type: 'checkbox',
      label: 'Show “See all” link/button',
      defaultValue: true,
    },
    {
      name: 'archiveLabel',
      type: 'text',
      label: 'Custom archive button text',
      admin: {
        description: 'Overrides default “See all [collection]” label',
        condition: (_, data) => data.showArchiveLink === true,
      },
    },
    {
      name: 'archiveUrl',
      type: 'text',
      label: 'Custom archive button URL',
      admin: {
        description: 'Overrides default `/${relationTo}` link',
        condition: (_, data) => data.showArchiveLink === true,
      },
    },
  ],
  labels: {
    singular: 'Archive',
    plural:   'Archives',
  },
}
