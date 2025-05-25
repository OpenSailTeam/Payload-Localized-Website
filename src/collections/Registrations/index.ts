import { CollectionConfig } from "payload";

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events' },
    { name: 'optionBlockID', type: 'text' }, // stores the block id of registrationOption
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'formData', type: 'json' },
    { name: 'status', type: 'select', options: ['registered','waitlisted','cancelled'] },
    { name: 'invoice', type: 'text' },
    { name: 'paymentStatus', type: 'select', options: ['pending','paid','refunded'] },
    { name: 'scheduledPaymentDate', type: 'date' },
    { name: 'createdAt', type: 'date', admin: { readOnly: true } },
  ],
  hooks: {
    beforeChange: [
      // Enforce paymentDeadline, disallow scheduling past deadline
    ]
  }
}

