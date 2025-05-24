import { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  auth: {
    verify: {
      generateEmailSubject: () => 'Welcome to PGA of Canada',
      generateEmailHTML: ({ token }) =>
        `<p>Click <a href="${process.env.SERVER_URL}/verify?token=${token}">here</a> to confirm your account.</p>`,
    },
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'zone', 'isGolfPro'],
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'zone', type: 'relationship', relationTo: 'zones' },
    { name: 'isGolfPro', type: 'checkbox', defaultValue: false },
    {
      name: 'golfProProfile',
      label: 'Golf Pro Profile',
      type: 'join',
      collection: 'golf-pros',
      on: 'member',
    },
  ],
}
