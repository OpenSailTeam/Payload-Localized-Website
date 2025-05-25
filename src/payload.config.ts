// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin, getPaymentTotal } from '@payloadcms/plugin-form-builder'
import { stripePlugin } from '@payloadcms/plugin-stripe'
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
import { Members } from './collections/Members'
import { Facilities } from './collections/Facilities'
import { MembershipTypes } from './collections/MembershipTypes'
import { Sponsors } from './collections/Sponsors'

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
import { TextSizeFeature } from 'payload-lexical-typography'
import Stripe from 'stripe'
import { Registrations } from './collections/Registrations'

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
})

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
            { value: '0.875rem', label: 'Small' },
            { value: '1rem', label: 'Normal' },
            { value: '1.125rem', label: 'Large (H3)' },
            { value: '1.5rem', label: 'XL (H2)' },
            { value: '3.5rem', label: 'XL (H1)' },
            { value: '4rem', label: '2XL' },
            { value: '5rem', label: '3XL' },
            { value: '6rem', label: '4XL' },
            { value: '7rem', label: '5XL' },
          ],
          scroll: false,
          customSize: false, // remove the “enter custom size” field
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
  collections: [
    Pages,
    Posts,
    Events,
    Zones,
    Media,
    Categories,
    Users,
    GolfPros,
    EventTypes,
    SubTypes,
    Members,
    Facilities,
    MembershipTypes,
    Sponsors,
    Registrations,
  ],
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
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
      // Optionally specify your webhook secret here if you want Payload to verify events
      // webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    }),
    formBuilderPlugin({
      fields: {
        text: true,
        email: true,
        number: true,
        textarea: true,
        payment: true,
      },
      // Stripe logic
      handlePayment: async ({ form, submissionData, payload }) => {
        // 1. Ensure we have the full Form object
        let fullForm = typeof form === 'string'
          // fetch it if it’s just an ID
          ? await payload.findByID({ collection: 'forms', id: form, depth: 1 })
          : form

        if (!fullForm) return

        // 2. Find the payment field
        const paymentField = fullForm.fields.find(f => f.blockType === 'payment')
        if (!paymentField) return

        // 3. Calculate amount
        const amount = getPaymentTotal({
          basePrice: paymentField.basePrice,
          priceConditions: paymentField.priceConditions,
          fieldValues: submissionData,
        })

        // 4. Create Stripe intent
        const intent = await stripe.paymentIntents.create({
          amount,
          currency: paymentField.paymentProcessor?.currency || 'cad',
          metadata: {
            formID:    fullForm.id,
            submissionID: submissionData.id,
          },
        })

        // 5. Return whatever you want saved
        return {
          clientSecret:   intent.client_secret,
          paymentIntentId: intent.id,
        }
      },
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
      formSubmissionOverrides: {
        fields: ({ defaultFields }) => defaultFields,
        hooks: {
          beforeChange: [
            async ({ data }) => {
              // 1. Enforce paymentDeadline
              // The scheduler field in your form is typically named e.g. 'scheduledPaymentDate'
              const schedField = data.submissionData.find(f => f.field === 'scheduledPaymentDate')
              if (schedField) {
                const scheduledDate = new Date(String(schedField.value))
                const deadline = new Date(data.paymentDeadline)
                if (scheduledDate > deadline) {
                  throw new Error(`You must schedule payment on or before ${deadline.toLocaleDateString()}`)
                }
              }
              return data
            },
          ],
          afterChange: [
            async ({ doc, req }) => {
              // Only on new registrations
              if (doc._status !== 'published') return

              const optionId = doc.submissionData.find(f => f.field === 'optionId')?.value as string
              const eventId  = doc.submissionData.find(f => f.field === 'eventId')?.value as string
              if (!optionId || !eventId) return

              // 2. Fetch the event to read participantLimit
              const evt = await req.payload.findByID({
                collection: 'events',
                id: eventId,
                depth: 2,
              })
              const opt = evt?.registrationOptions?.find(o => o.id === optionId)
              const limit = opt?.participantLimit ?? Infinity

              // 3. Count how many are already registered
              const { totalDocs } = await req.payload.find({
                collection: 'form-submissions',
                where: ({
                  submissionData: {
                    elemMatch: {
                      field: { equals: 'optionId' },
                      value: { equals: optionId },
                    }
                  },
                  status: { equals: 'registered' },
                } as any),
                overrideAccess: true,
              })

              // 4. Decide status
              const newStatus = totalDocs < limit ? 'registered' : 'waitlisted'

              // 5. Persist it back on this submission
              await req.payload.update({
                collection: 'form-submissions',
                id: doc.id,
                data: { status: newStatus } as any,
              })
            },
          ],
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
