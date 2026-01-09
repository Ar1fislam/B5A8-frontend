/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { paymentAPI } from '@/lib/api'
import { toast } from 'sonner'
import { SubscriptionPlans } from '@/components/payments/subscription-plans'
import {
  Crown,
  WalletCards,
  BadgeCheck,
  CalendarClock,
  ReceiptText,
  Download,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  XCircle,
  Sparkles,
} from 'lucide-react'
import { Subscription } from '@/types'

export default function PaymentsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    setIsLoading(true)
    try {
      const result = await paymentAPI.getSubscription()
      setSubscription(result.data?.subscription || null)
    } catch (error) {
      toast.error('Couldn’t load membership details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        'Cancel membership at period end?\n\nYou’ll keep premium access until your current billing period ends.'
      )
    ) {
      return
    }

    setIsCancelling(true)
    try {
      await paymentAPI.cancelSubscription()
      toast.success('Membership will end at the end of your billing period')
      fetchSubscription()
    } catch (error) {
      toast.error('Cancellation failed. Please try again.')
    } finally {
      setIsCancelling(false)
    }
  }

  const getSubscriptionStatus = () => {
    if (!subscription) return { label: 'Free', variant: 'secondary' as const }

    switch (subscription.status) {
      case 'active':
        return { label: 'Premium active', variant: 'default' as const }
      case 'past_due':
        return { label: 'Payment issue', variant: 'destructive' as const }
      case 'canceled':
        return { label: 'Canceled', variant: 'outline' as const }
      default:
        return { label: subscription.status, variant: 'outline' as const }
    }
  }

  const status = getSubscriptionStatus()

  const nextBillingDateText = useMemo(() => {
    const end = subscription?.stripeData?.currentPeriodEnd
    if (!end) return 'N/A'
    return new Date(end).toLocaleDateString()
  }, [subscription?.stripeData?.currentPeriodEnd])

  const currentPlan = useMemo(() => {
    const priceId = subscription?.stripeData?.priceId
    if (!priceId) return 'free'
    if (priceId === 'price_1SaHXbLaGyGdTIttfCY7mwaP') return 'premium'
    if (priceId === 'price_1SaI29LaGyGdTItteNpIsNMc') return 'yearly'
    return 'free'
  }, [subscription?.stripeData?.priceId])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-7s]" />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-app-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Membership
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Billing & membership
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Manage your plan, renewals, and invoices in one place.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge variant={status.variant} className="rounded-full">
                  {status.label}
                </Badge>

                {subscription?.stripeData?.cancelAtPeriodEnd ? (
                  <Badge variant="outline" className="rounded-full">
                    Ending on {nextBillingDateText}
                  </Badge>
                ) : subscription ? (
                  <Badge variant="secondary" className="rounded-full">
                    Next renewal: {nextBillingDateText}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="rounded-full">
                    Upgrade anytime
                  </Badge>
                )}
              </div>
            </div>

            <div className="animate-app-fade-up">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
                <div className="rounded-2xl border bg-background/60 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {subscription ? 'Premium' : 'Free'}
                  </p>
                </div>
                <div className="rounded-2xl border bg-background/60 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Billing</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {subscription ? 'Auto-renew' : 'None'}
                  </p>
                </div>
                <div className="rounded-2xl border bg-background/60 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Invoices</p>
                  <p className="mt-0.5 text-sm font-medium">Download</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURRENT MEMBERSHIP */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <WalletCards className="h-5 w-5 text-muted-foreground" />
                    Current membership
                  </CardTitle>
                  <CardDescription>
                    Your plan status and renewal details.
                  </CardDescription>
                </div>

                <Badge variant={status.variant} className="rounded-full">
                  {status.label}
                </Badge>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                    <div className="h-10 w-2/3 rounded bg-muted animate-pulse" />
                    <div className="h-24 w-full rounded bg-muted animate-pulse" />
                  </div>
                ) : subscription ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border bg-background/40 p-4">
                        <p className="text-xs text-muted-foreground">Plan</p>
                        <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
                          <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          Premium
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-background/40 p-4">
                        <p className="text-xs text-muted-foreground">Billing cycle</p>
                        <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                          Monthly
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-background/40 p-4">
                        <p className="text-xs text-muted-foreground">Next renewal</p>
                        <p className="mt-1 text-lg font-semibold">{nextBillingDateText}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="rounded-2xl border bg-background/40 p-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          What you unlock
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Verified traveler badge
                          </li>
                          <li className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Unlimited travel plans
                          </li>
                          <li className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Priority support
                          </li>
                          <li className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Advanced filters
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-2xl border bg-background/40 p-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <ReceiptText className="h-5 w-5 text-muted-foreground" />
                          Receipts & invoices
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Download your invoices for personal or business records.
                        </p>

                        <div className="mt-4 flex flex-col gap-2">
                          <Button
                            variant="outline"
                            className="rounded-xl justify-start gap-2"
                            onClick={() => toast.info('Invoices download is coming soon.')}
                          >
                            <Download className="h-4 w-4" />
                            Download invoices
                          </Button>

                          <Button
                            variant="outline"
                            className="rounded-xl justify-start gap-2"
                            onClick={() => toast.info('Update payment method is coming soon.')}
                          >
                            <CreditCard className="h-4 w-4" />
                            Update payment method
                          </Button>
                        </div>
                      </div>
                    </div>

                    {subscription.stripeData?.cancelAtPeriodEnd ? (
                      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-900/20 p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-400" />
                          <div>
                            <h4 className="font-semibold text-amber-900 dark:text-amber-200">
                              Membership scheduled to end
                            </h4>
                            <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-300/90">
                              Your premium access stays active until {nextBillingDateText}. After
                              that, the account returns to the free plan.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                          variant="outline"
                          className="rounded-xl gap-2 text-destructive hover:text-destructive"
                          onClick={handleCancelSubscription}
                          disabled={isCancelling}
                        >
                          <XCircle className="h-4 w-4" />
                          {isCancelling ? 'Cancelling…' : 'Cancel membership'}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-muted">
                      <Crown className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">You’re on the free plan</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Upgrade to premium to unlock verified badge, unlimited plans, and better matching.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Trust / Guarantee panel */}
          <div className="lg:col-span-5">
            <Card className="rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  Secure checkout
                </CardTitle>
                <CardDescription>
                  Clear terms, cancel anytime, and encrypted payments.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="rounded-2xl border bg-background/40 p-4">
                  <p className="font-medium">Encrypted payments</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Checkout is processed securely by Stripe.
                  </p>
                </div>

                <div className="rounded-2xl border bg-background/40 p-4">
                  <p className="font-medium">Cancel anytime</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you cancel, you keep access until the period ends.
                  </p>
                </div>

                <div className="rounded-2xl border bg-background/40 p-4">
                  <p className="font-medium">Fast support</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment trouble? Reach out and get help quickly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PLANS */}
        <Card className="mt-8 rounded-3xl border bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-muted-foreground" />
              Upgrade your plan
            </CardTitle>
            <CardDescription>
              Pick a plan that matches how often you travel.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <SubscriptionPlans currentPlan={currentPlan as any} />

           
          </CardContent>
        </Card>
      </div>
    </div>
  )
}













