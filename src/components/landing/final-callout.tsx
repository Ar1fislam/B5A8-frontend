'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ShieldCheck, UserRoundPlus } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function FinalCallout() {
  const { user } = useAuth()

  if (user) return null

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <Card className="relative overflow-hidden rounded-3xl border bg-card/60 p-8 backdrop-blur sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              Free to start
            </Badge>
            <Badge variant="outline" className="rounded-full">
              No credit card required
            </Badge>
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Make your next trip feel organized from day one.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Create a profile, publish a travel plan, and connect with travelers who match your timing and style.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/register">
                <UserRoundPlus className="mr-2 h-4 w-4" />
                Join now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/safety">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Read safety tips
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}
