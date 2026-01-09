'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  XCircle,
  ArrowLeft,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  RefreshCcw,
} from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container max-w-3xl py-10">
        {/* Top nav */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" className="rounded-xl" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <Badge variant="secondary" className="rounded-full">
            Payments
          </Badge>
        </div>

        <Card className="relative overflow-hidden rounded-3xl border bg-card/60 backdrop-blur">
          {/* ambient glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl animate-app-float" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-app-float [animation-delay:-7s]" />
          </div>

          <CardHeader className="relative text-center">
            <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl border bg-background/60 shadow-sm">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10">
                <XCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <CardTitle className="text-2xl tracking-tight">Payment cancelled</CardTitle>
            <CardDescription className="mx-auto max-w-md">
              No charge was made. You can retry anytime, or keep using the free features.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {/* Info tiles */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-background/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Safe
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your card wasn’t charged.
                </p>
              </div>

              <div className="rounded-2xl border bg-background/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <RefreshCcw className="h-4 w-4 text-primary" />
                  Retry anytime
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use the same or another method.
                </p>
              </div>

              <div className="rounded-2xl border bg-background/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  Need help?
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  If it keeps failing, contact support.
                </p>
              </div>
            </div>

            {/* Primary actions */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
              <Button className="rounded-xl" asChild>
                <Link href="/payments">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Try again
                </Link>
              </Button>

              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}









