// src/app/matches/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { matchAPI } from '@/lib/api'
import { Match } from '@/types'
import { MatchRequest } from '@/components/matches/match-request'

import {
  Sparkles,
  Inbox,
  Send,
  CheckCircle2,
  Clock3,
  UsersRound,
  NotebookText,
  ArrowRight,
} from 'lucide-react'

type TabKey = 'received' | 'sent' | 'accepted'

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('received')
  const [receivedMatches, setReceivedMatches] = useState<Match[]>([])
  const [sentMatches, setSentMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchMatches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      // Keep same idea as your old logic: fetch what is needed for the current tab.
      if (activeTab === 'received') {
        const receivedData = await matchAPI.getMyMatches({ type: 'received' })
        setReceivedMatches(receivedData.data.matches || [])
      }

      if (activeTab === 'sent') {
        const sentData = await matchAPI.getMyMatches({ type: 'sent' })
        setSentMatches(sentData.data.matches || [])
      }

      // Accepted tab needs both lists (because acceptedMatches is derived from both arrays)
      if (activeTab === 'accepted') {
        const [receivedData, sentData] = await Promise.all([
          matchAPI.getMyMatches({ type: 'received' }),
          matchAPI.getMyMatches({ type: 'sent' }),
        ])
        setReceivedMatches(receivedData.data.matches || [])
        setSentMatches(sentData.data.matches || [])
      }
    } catch (error) {
      toast.error('Failed to load matches')
      console.error('Matches error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const pendingReceived = useMemo(
    () => receivedMatches.filter((m) => m.status === 'PENDING'),
    [receivedMatches]
  )

  const acceptedMatches = useMemo(
    () => [...receivedMatches, ...sentMatches].filter((m) => m.status === 'ACCEPTED'),
    [receivedMatches, sentMatches]
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-app-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Matches
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Match Requests
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Manage your travel companion requests and connections.
              </p>
            </div>

            <div className="animate-app-fade-up">
              <Button asChild className="rounded-xl">
                <Link href="/explore">
                  <UsersRound className="mr-2 h-4 w-4" />
                  Find travelers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* STATS */}
          {/* <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 animate-app-fade-up">
            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Pending</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/10">
                  <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {pendingReceived.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Accepted</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {acceptedMatches.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Received</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500/10">
                  <Inbox className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {receivedMatches.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Sent</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-fuchsia-500/10">
                  <Send className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {sentMatches.length}
              </p>
            </div>
          </div> */}
        </div>

        {/* MAIN GRID */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)} className="mt-8">
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            {/* LEFT: Tab rail */}
            <div className="lg:sticky lg:top-20 h-fit">
              <div className="rounded-3xl border bg-card/60 p-5 backdrop-blur animate-app-fade-up">
                <p className="text-sm font-semibold tracking-tight">Views</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Switch between requests and accepted buddies.
                </p>

                <TabsList className="mt-4 grid h-auto grid-cols-1 gap-2 bg-transparent p-0">
                  <TabsTrigger
                    value="received"
                    className="w-full justify-between rounded-2xl border bg-background/40 px-4 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:border-sky-500/30"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Inbox className="h-4 w-4" />
                      Pending received
                    </span>
                    <Badge variant="secondary" className="rounded-full">
                      {pendingReceived.length}
                    </Badge>
                  </TabsTrigger>

                  <TabsTrigger
                    value="sent"
                    className="w-full justify-between rounded-2xl border bg-background/40 px-4 py-3 data-[state=active]:bg-fuchsia-500/10 data-[state=active]:border-fuchsia-500/30"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Sent
                    </span>
                    <Badge variant="secondary" className="rounded-full">
                      {sentMatches.length}
                    </Badge>
                  </TabsTrigger>

                  <TabsTrigger
                    value="accepted"
                    className="w-full justify-between rounded-2xl border bg-background/40 px-4 py-3 data-[state=active]:bg-emerald-500/10 data-[state=active]:border-emerald-500/30"
                  >
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Accepted
                    </span>
                    <Badge variant="secondary" className="rounded-full">
                      {acceptedMatches.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="animate-app-fade-up">
              <TabsContent value="received" className="m-0">
                <Card className="rounded-3xl bg-card/60 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Received Match Requests</CardTitle>
                    <CardDescription>
                      Travelers who want to join your adventures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                        <p className="mt-2 text-muted-foreground">Loading matches...</p>
                      </div>
                    ) : pendingReceived.length > 0 ? (
                      <div className="space-y-4">
                        {pendingReceived.map((match) => (
                          <MatchRequest
                            key={match.id}
                            match={match}
                            type="received"
                            onUpdate={fetchMatches}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-14">
                        <div className="h-16 w-16 mx-auto rounded-2xl bg-sky-500/10 flex items-center justify-center mb-4">
                          <Inbox className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No pending requests</h3>
                        <p className="text-muted-foreground mb-5">
                          You don&apos;t have any pending match requests
                        </p>
                        <Button asChild className="rounded-xl">
                          <Link href="/travel-plans">
                            <NotebookText className="mr-2 h-4 w-4" />
                            My Travel Plans
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sent" className="m-0">
                <Card className="rounded-3xl bg-card/60 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Sent Match Requests</CardTitle>
                    <CardDescription>
                      Requests you&apos;ve sent to other travelers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                        <p className="mt-2 text-muted-foreground">Loading matches...</p>
                      </div>
                    ) : sentMatches.length > 0 ? (
                      <div className="space-y-4">
                        {sentMatches.map((match) => (
                          <MatchRequest key={match.id} match={match} type="sent" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-14">
                        <div className="h-16 w-16 mx-auto rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-4">
                          <Send className="h-8 w-8 text-fuchsia-600 dark:text-fuchsia-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No sent requests</h3>
                        <p className="text-muted-foreground mb-5">
                          You haven&apos;t sent any match requests yet
                        </p>
                        <Button asChild className="rounded-xl">
                          <Link href="/explore">
                            <UsersRound className="mr-2 h-4 w-4" />
                            Explore Travelers
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accepted" className="m-0">
                <Card className="rounded-3xl bg-card/60 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Accepted Matches</CardTitle>
                    <CardDescription>
                      Travel companions you&apos;ve connected with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                        <p className="mt-2 text-muted-foreground">Loading matches...</p>
                      </div>
                    ) : acceptedMatches.length > 0 ? (
                      <div className="space-y-4">
                        {acceptedMatches.map((match) => (
                          <MatchRequest key={match.id} match={match} type="received" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-14">
                        <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                          <UsersRound className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No accepted matches</h3>
                        <p className="text-muted-foreground mb-5">
                          Start connecting with travelers to see accepted matches here
                        </p>
                        <Button asChild className="rounded-xl">
                          <Link href="/explore">
                            <UsersRound className="mr-2 h-4 w-4" />
                            Explore Travelers
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
