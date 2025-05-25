import type { CollectionConfig, TypedLocale } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateOrganizers } from './hooks/populateOrganizers'
import { revalidateEvent } from './hooks/revalidateEvent'

import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { FormBlock } from '@/blocks/Form/config'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { RegistrationOption } from '../../blocks/RegistrationOption/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'startDate', 'location', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'events',
          locale: locale.code,
        })
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data, { locale }) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'events',
        locale,
      })
      return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Event Details',
          fields: [
            {
              name: 'facility',
              type: 'relationship',
              relationTo: 'facilities',
              required: true,
              admin: { position: 'sidebar' },
              label: 'Facility',
            },
            { name: 'location', type: 'text' },
            { name: 'sponsors', type: 'relationship', relationTo: 'sponsors', hasMany: true },
            { name: 'dateStart', type: 'date' },
            { name: 'dateEnd', type: 'date' },
            {
              name: 'golfGeniusURL',
              type: 'text',
              label: 'Golf Genius URL',
            },
            {
              name: 'zone',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: false,
              relationTo: 'zones',
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'description',
              type: 'richText',
              localized: true,
              required: true,
              label: false,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
                  BlocksFeature({
                    blocks: [Banner, Code, MediaBlock, CallToAction, Content, Archive, FormBlock],
                  }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Registration Options',
          fields: [
            {
              name: 'registrationOptions',
              type: 'blocks',
              blocks: [RegistrationOption],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
        {
          label: 'Additional Settings',
          fields: [
            {
              type: 'group',
              name: 'financial',
              label: 'Financial Settings',
              fields: [
                {
                  name: 'unearnedGLAccount',
                  type: 'text',
                  label: 'Unearned Revenue GL Account',
                },
              ],
            },
            {
              // Refactored out into its own collection config
              type: 'relationship',
              name: 'eventTypes',
              label: 'Event Types',
              relationTo: 'event-types',
              hasMany: true,
            },
            {
              name: 'subType',
              type: 'relationship',
              relationTo: 'sub-types',
              label: 'Sub Type',
              filterOptions: ({ siblingData }) => {
                // Assuming siblingData has the main event type reference (e.g., eventType)
                // Return a filter that shows only sub-types whose eventType equals the selected value
                return {
                  eventType: {
                    equals: (siblingData as any).eventType, // adjust field name as needed
                  },
                }
              },
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'organizers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'populatedOrganizers',
      type: 'array',
      access: { update: () => false },
      admin: { disabled: true, readOnly: true },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'name', type: 'text' },
      ],
    },
    ...slugField('title', { slugOverrides: { localized: true } }),
  ],
  hooks: {
    afterRead: [populateOrganizers],
    afterChange: [revalidateEvent],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 50,
  },
}
