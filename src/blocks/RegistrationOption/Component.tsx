// components/RegistrationOption/Component.tsx
'use client'

import React from 'react'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { Event } from '@/payload-types'
import { v4 as uuid } from 'uuid'


export interface RegistrationOptionProps {
  option: Extract<
    NonNullable<Event['registrationOptions']>[number],
    { blockType: 'registrationOption' }
  >
  eventId: string
}

export default function RegistrationOption({
  option,
  eventId,
}: RegistrationOptionProps) {
  const now = new Date()
  const cutoff = option.earlyBirdCutoff ? new Date(option.earlyBirdCutoff) : null
  const isEarlyBird = cutoff ? now <= cutoff : false

  // Now option.earlyBirdForm and regularForm are full objects (FormType)
  const formConfig: FormType | undefined =
    (isEarlyBird ? option.earlyBirdForm : option.regularForm) as any

  if (!formConfig) {
    return <p className="text-red-600">No form configured for this option.</p>
  }

  console.log('Loaded Form:', formConfig);
  return (
    <div className="p-6 border rounded-md">
      <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
      {/* Render the FormBlock you already have, passing in the form object */}
      <FormBlock
        enableIntro
        form={formConfig}
        introContent={(formConfig as any).intro || []}
      />
    </div>
  )
}
