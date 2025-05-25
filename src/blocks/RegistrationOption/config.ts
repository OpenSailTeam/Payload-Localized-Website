import type { Block } from 'payload'

export const RegistrationOption: Block = {
  slug: 'registrationOption',
  labels: {
    singular: 'Registration Option',
    plural: 'Registration Options',
  },
  fields: [
    // 1. Basic info
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'participantType',
      type: 'select',
      options: [
        { label: 'Individual', value: 'individual' },
        { label: 'Team',        value: 'team' },
      ],
      required: true,
    },

    // 2. Form relations (one form per phase)
    {
      name: 'earlyBirdForm',
      label: 'Early‑Bird Registration Form',
      type: 'relationship',
      relationTo: 'forms',    // Form Builder’s Forms collection
      hasMany: false,
      required: false,        // optional if no early‑bird phase
      admin: {
        description:
          'Select the Form Builder form configured with early‑bird pricing & cutoff logic.',
      },
    },
    {
      name: 'regularForm',
      label: 'Regular Registration Form',
      type: 'relationship',
      relationTo: 'forms',
      hasMany: false,
      required: true,
      admin: {
        description:
          'Select the Form Builder form configured with regular pricing.',
      },
    },

    // 3. Early‑Bird phase metadata (for front‑end display & overrides)
    {
      name: 'earlyBirdCutoff',
      label: 'Early‑Bird Cutoff Date',
      type: 'date',
      required: false,
      admin: {
        description:
          'Date after which the regular form should be shown instead of early‑bird.',
      },
    },

    // 4. Payment scheduling control
    {
      name: 'allowImmediatePayment',
      label: 'Allow Immediate Payment',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Members can pay at time of registration.',
      },
    },
    {
      name: 'allowScheduledPayment',
      label: 'Allow Scheduling of Payment',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Members can choose a future date to schedule payment.',
      },
    },
    {
      name: 'paymentDeadline',
      label: 'Payment Deadline',
      type: 'date',
      required: false,
      admin: {
        description:
          'Latest date members may schedule or make a payment.',
      },
    },

    // 5. Eligibility rules
    {
      name: 'eligibility',
      type: 'group',
      fields: [
        {
          name: 'membershipTypes',
          label: 'Allowed Membership Types',
          type: 'relationship',
          relationTo: 'membership-types',
          hasMany: true,
        },
        {
          name: 'zones',
          label: 'Allowed Zones',
          type: 'relationship',
          relationTo: 'zones',
          hasMany: true,
        },
      ],
    },

    // 6. GL coding
    {
      name: 'glCode',
      label: 'GL Code',
      type: 'text',
      admin: {
        description: 'General ledger code for this registration option.',
      },
    },

    // 7. Participant caps & waitlist
    {
      name: 'participantLimit',
      label: 'Participant Limit',
      type: 'number',
      required: true,
      admin: {
        description:
          'Maximum number of participants (individuals or teams).',
      },
    },
    {
      name: 'enableWaitlist',
      label: 'Enable Waitlist',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'When limit is reached, additional submissions go to waitlist.',
      },
    },
  ],
}
