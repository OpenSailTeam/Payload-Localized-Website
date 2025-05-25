// components/Form/StripeProvider.tsx
'use client'

import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'

export const StripeProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Elements stripe={stripePromise}>
    {children}
  </Elements>
)
