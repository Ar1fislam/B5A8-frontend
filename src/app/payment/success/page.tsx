'use client'

import { Suspense } from 'react'
import PaymentSuccessContent from './payment-success-content'

function PaymentSuccessLoading() {
  return (
    <div className="container max-w-md py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
