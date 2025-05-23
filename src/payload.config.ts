// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import sharp from 'sharp' // editor-import
import { UnderlineFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import Categories from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Events } from './collections/Events'
import { EventTypes } from './collections/EventTypes'
import { SubTypes } from './collections/SubTypes'
import { Zones } from './collections/Zones'
import { GolfPros } from './collections/GolfPros'
import Users from './collections/Users'
import { seedHandler } from './endpoints/seedHandler'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post } from 'src/payload-types'

import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import localization from './i18n/localization'

import { resendAdapter } from '@payloadcms/email-resend'
import { TextSizeFeature } from "payload-lexical-typography";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  return doc?.slug
    ? `${process.env.NEXT_PUBLIC_SERVER_URL!}/${doc.slug}`
    : process.env.NEXT_PUBLIC_SERVER_URL!
}

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `AfterDashboard` component renders "Seed" that you see after logging into your admin panel.
      afterDashboard: ['@/components/AfterDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => {
      return [
        ...defaultFeatures,
        TextSizeFeature({
          sizes: [
            { value: "0.875rem", label: "Small" },
            { value: "1rem",   label: "Normal" },
            { value: "1.125rem", label: "Large (H3)" },
            { value: "1.5rem",   label: "XL (H2)" },
            { value: "3.5rem",   label: "XL (H1)" },
            { value: "4rem",   label: "2XL" },
            { value: "5rem",   label: "3XL" },
            { value: "6rem",   label: "4XL" },
            { value: "7rem",   label: "5XL" },
          ],
          scroll: false,
          customSize: false,      // remove the “enter custom size” field
        }),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts', 'events', 'zones'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
      ]
    },
  }),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [Pages, Posts, Events, Zones, Media, Categories, Users, GolfPros, EventTypes, SubTypes],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  endpoints: [
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    {
      handler: seedHandler,
      method: 'get',
      path: '/seed',
    },
  ],
  globals: [Header, Footer],
  plugins: [
    redirectsPlugin({
      collections: ['pages', 'posts', 'events', 'zones', 'golf-pros'],
      overrides: {
        // @ts-expect-error
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'from') {
              return {
                ...field,
                admin: {
                  description: 'You will need to rebuild the website when changing this field.',
                },
              }
            }
            return field
          })
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    nestedDocsPlugin({
      collections: ['categories', 'event-types', 'sub-types'],
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    formBuilderPlugin({
      formOverrides: {
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          })
        },
      },
    }),
    searchPlugin({
      collections: ['posts', 'events', 'zones', 'golf-pros'],
      beforeSync: beforeSyncWithSearch,
      searchOverrides: {
        fields: ({ defaultFields }) => {
          return [...defaultFields, ...searchFields]
        },
      },
    }),
    payloadCloudPlugin(), // storage-adapter-placeholder
  ],
  localization,
  email: resendAdapter({
    defaultFromAddress: process.env.DEFAULT_FROM_ADDRESS || 'dev@payloadcms.com',
    defaultFromName: process.env.DEFAULT_FROM_NAME || 'Payload CMS',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  secret: process.env.PAYLOAD_SECRET!,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
