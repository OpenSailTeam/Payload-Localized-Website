// components/Form/Payment.tsx
'use client'

import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

interface PaymentProps {
  name: string
  basePrice: number
  priceConditions?: any[]
}

const Payment: React.FC<PaymentProps> = ({
  name,
  basePrice,
  priceConditions = [],
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const { control, getValues, setValue } = useFormContext()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Called by the outer form’s onSubmit handler
  const processPayment = async () => {
    // 1. Call your submissions endpoint to create a PaymentIntent
    const formValues = getValues()
    const res = await fetch('/api/form-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form: formValues._formID,               // hidden field
        submissionData: Object.entries(formValues).map(([field, value]) => ({ field, value })),
      }),
    })
    const json = await res.json()
    setClientSecret(json.clientSecret)

    // 2. Confirm the payment with Stripe
    if (stripe && elements && json.clientSecret) {
      const card = elements.getElement(CardElement)!
      const { error, paymentIntent } = await stripe.confirmCardPayment(json.clientSecret, {
        payment_method: { card },
      })
      if (error) throw error

      // 3. Optionally store the intent ID or signal success back to the form
      setValue('paymentIntentId', paymentIntent!.id)
    }
  }

  return (
    <fieldset className="mb-6 last:mb-0">
      <Label htmlFor={name}>Payment</Label>
      <p className="my-3 text-sm">
        Total: ${basePrice.toFixed(2)}
      </p>
      <div className="my-3 p-2 border rounded">
      <Controller
        name={name}
        control={control}
        render={() => <CardElement />}
        
      />
      </div>
    </fieldset>
  )
}

export default Payment
