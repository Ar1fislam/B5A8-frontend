
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { CheckCircle, Home, CreditCard } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { authAPI, paymentAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function PaymentSuccessContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [paymentType, setPaymentType] = useState<'subscription' | 'badge' | 'unknown'>('unknown')

  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const { updateUser } = useAuth()

  // Guard against repeated effect runs (Strict Mode / remounts)
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (!sessionId) {
      router.push('/')
      return
    }

    if (hasRunRef.current) return
    hasRunRef.current = true

    const verifyAndRefreshUser = async () => {
      try {
        const subscriptionRes = await paymentAPI.getSubscription()

        if (subscriptionRes.data?.subscription) {
          setPaymentType('subscription')
          toast.success('Premium subscription activated!')
        } else {
          setPaymentType('unknown')
        }

        const meRes = await authAPI.getMe()
        updateUser(meRes.data.user)
      } catch (error) {
        console.error('Payment verification failed:', error)
        toast.error('Payment verification failed. Please contact support.')
      } finally {
        setIsLoading(false)
      }
    }

    verifyAndRefreshUser()
  }, [sessionId, router, updateUser])

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Verifying payment…</CardTitle>
          <CardDescription>Please wait while the subscription is activated.</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Payment successful
        </CardTitle>
        <CardDescription>
          {paymentType === 'subscription'
            ? 'Your premium subscription is now active.'
            : 'Your payment was received.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {paymentType === 'subscription' && (
          <div className="rounded-md border p-4 flex items-start gap-3">
            <CreditCard className="h-5 w-5 mt-0.5" />
            <div>
              <div className="font-medium">Premium is enabled</div>
              <div className="text-sm text-muted-foreground">
                You can now access premium-only features (travel plans, advanced filters, etc.).
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to dashboard
            </Link>
          </Button>

          <Button variant="outline" onClick={() => router.push('/travel-plans/new')}>
            Create travel plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
