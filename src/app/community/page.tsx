// src/app/community-guidelines/page.tsx

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, HeartHandshake, Lock, Ban, Flag } from 'lucide-react'

export default function CommunityGuidelinesPage() {
  const lastUpdated = 'Jan 2026'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background to-muted/30">
      <div className="container py-10">
        {/* Hero */}
        <div className="mb-8">
          <Badge variant="outline" className="rounded-full">
            Community
          </Badge>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Community Guidelines
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Simple rules to keep TravelBuddy safe, respectful, and welcoming.
          </p>
        </div>

        {/* Principles */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                Be respectful
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              No harassment, hate speech, bullying, discrimination, or abusive behavior.
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Keep it safe & honest
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              No scams, phishing, impersonation, misleading content, or spam.
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Protect privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Don’t share personal or private information (yours or others’).
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Ban className="h-4 w-4 text-muted-foreground" />
                Follow the law
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Illegal activities are not allowed on the platform.
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <Card className="mt-6 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">See something wrong?</p>
                <p className="text-sm text-muted-foreground">
                  Report it so the team can review and take action.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="rounded-xl" asChild>
                  <Link href="/contact">
                    <Flag className="mr-2 h-4 w-4" />
                    Contact support
                  </Link>
                </Button>
                <Button className="rounded-xl" asChild>
                  <Link href="/help">Reporting help</Link>
                </Button>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Enforcement may include content removal, account suspension, or other actions. Last updated: {lastUpdated}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
