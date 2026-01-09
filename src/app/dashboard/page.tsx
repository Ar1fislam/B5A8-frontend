/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { useAuth } from '@/lib/auth-context'
import { travelPlanAPI, matchAPI } from '@/lib/api'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

import type { Match, TravelPlan } from '@/types'

import {
  Sparkles,
  Star,
  Shield,
  MapPin,
  CalendarDays,
  UsersRound,
  MessageCircle,
  Plus,
  Compass,
  ArrowRight,
  ChevronRight,
  PlaneTakeoff,
  Handshake,
  NotebookText,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const [upcomingPlans, setUpcomingPlans] = useState<TravelPlan[]>([])
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // small animated word in hero
  const words = useMemo(() => ['plan smarter', 'meet buddies', 'travel safer', 'collect stories'], [])
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 2200)
    return () => clearInterval(id)
  }, [words.length])

  useEffect(() => {
    if (!user) return
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Upcoming travel plans (top 3)
      const result = await travelPlanAPI.getMyPlans(1, 3)
      const plansData = result.data
      setUpcomingPlans(plansData.plans || [])

      // Recent matches (accepted)
      const matchesData = await matchAPI.getMyMatches({
        type: 'received',
        status: 'ACCEPTED',
        page: 1,
        limit: 5,
      })
      setRecentMatches(matchesData.data.matches || [])
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard data error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  // Rating fallback
  const rating =
    (user as any)?.profile?.averageRating ??
    (user as any)?.profile?.rating ??
    (user as any)?.averageRating ??
    4.8

  const ratingLabel =
    rating >= 4.8 ? 'Excellent' : rating >= 4.5 ? 'Great' : rating >= 4.0 ? 'Good' : 'New'

  const countriesVisited = user.profile?.visitedCountries?.length || 0

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-7s]" />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-app-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Dashboard
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {user.profile?.fullName || 'Traveler'}
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Today: <span className="text-foreground font-medium">{words[wordIndex]}</span>
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button asChild className="rounded-xl">
                  <Link href="/travel-plans/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create a plan
                  </Link>
                </Button>

                <Button variant="outline" asChild className="rounded-xl">
                  <Link href="/explore">
                    <Compass className="mr-2 h-4 w-4" />
                    Explore
                  </Link>
                </Button>

                <Button variant="outline" asChild className="rounded-xl">
                  <Link href="/messages">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </Button>

                {user.role === 'ADMIN' && (
                  <Button variant="outline" asChild className="rounded-xl">
                    <Link href="/admin/dashboard">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Quick chips */}
            <div className="animate-app-fade-up">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border bg-background/60 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-sm font-medium">{ratingLabel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="text-lg font-semibold tabular-nums">{Number(rating).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background/60 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Visited</p>
                      <p className="text-sm font-medium">Countries</p>
                    </div>
                    <span className="text-lg font-semibold tabular-nums">{countriesVisited}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID (revamped positions) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT: Main content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upcoming Plans (card grid) */}
            <Card className="rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <PlaneTakeoff className="h-5 w-5 text-muted-foreground" />
                    Upcoming plans
                  </CardTitle>
                  <CardDescription>Your next trips (up to 3).</CardDescription>
                </div>

                <Button variant="outline" size="sm" className="rounded-xl" asChild>
                  <Link href="/travel-plans">
                    View all <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-[110px] rounded-2xl border bg-background/40 animate-pulse" />
                    ))}
                  </div>
                ) : upcomingPlans.length ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {upcomingPlans.map((plan) => (
                      <Link
                        key={plan.id}
                        href={`/travel-plans/${plan.id}`}
                        className="group block"
                      >
                        <div className="relative overflow-hidden rounded-2xl border bg-background/40 p-4 transition hover:bg-accent/20">
                          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                            <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-primary/12 blur-2xl opacity-70 transition-opacity group-hover:opacity-100" />
                            <div className="absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-accent/18 blur-2xl opacity-70 transition-opacity group-hover:opacity-100" />
                          </div>

                          <div className="relative flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 font-semibold truncate">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {plan.destination}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                <CalendarDays className="mr-1 inline h-4 w-4" />
                                {formatDate(plan.startDate)} → {formatDate(plan.endDate)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="rounded-full">
                                {plan.travelType}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      No upcoming plans yet. Create one to start matching.
                    </p>
                    <Button className="mt-4 rounded-xl" asChild>
                      <Link href="/travel-plans/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create travel plan
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Matches (better card rows + message works) */}
            <Card className="rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="h-5 w-5 text-muted-foreground" />
                    Recent matches
                  </CardTitle>
                  <CardDescription>Latest accepted connections.</CardDescription>
                </div>

                <Button variant="outline" size="sm" className="rounded-xl" asChild>
                  <Link href="/matches">
                    Open matches <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-[76px] rounded-2xl border bg-background/40 animate-pulse" />
                    ))}
                  </div>
                ) : recentMatches.length ? (
                  <div className="space-y-3">
                    {recentMatches.slice(0, 4).map((match) => {
                      const initiator = (match as any)?.initiator
                      const receiver = (match as any)?.receiver

                      // robust "other user"
                      const other =
                        initiator?.id && initiator.id === user.id ? receiver : initiator

                      const otherProfile = other?.profile
                      const otherName = otherProfile?.fullName || 'Traveler'
                      const otherImage = otherProfile?.profileImage

                      const planId = (match as any)?.travelPlan?.id
                      const planDestination = (match as any)?.travelPlan?.destination || 'General match'

                      return (
                        <div
                          key={match.id}
                          className="flex flex-col gap-3 rounded-2xl border bg-background/40 p-4 transition hover:bg-accent/20 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-11 w-11">
                              <AvatarImage src={otherImage ?? undefined} />
                              <AvatarFallback>
                                {otherName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p className="truncate font-medium">{otherName}</p>
                              <p className="truncate text-sm text-muted-foreground">
                                {planDestination}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            <Badge className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                              Accepted
                            </Badge>

                            {/* FIX: Message now navigates */}
                            <Button size="sm" variant="outline" className="rounded-xl" asChild>
                              <Link href="/messages">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Message
                              </Link>
                            </Button>

                            {planId && (
                              <Button size="sm" className="rounded-xl" asChild>
                                <Link href={`/travel-plans/${planId}`}>
                                  View plan <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      No recent matches yet. Explore travelers to connect.
                    </p>
                    <Button variant="outline" className="mt-4 rounded-xl" asChild>
                      <Link href="/explore">
                        <Compass className="mr-2 h-4 w-4" />
                        Explore now
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Profile + Quick actions (moved / refreshed) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersRound className="h-5 w-5 text-muted-foreground" />
                  Profile
                </CardTitle>
                <CardDescription>Quick access to your account.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={user.profile?.profileImage ?? undefined} />
                    <AvatarFallback className="text-lg">
                      {(user.profile?.fullName?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">{user.profile?.fullName || 'Traveler'}</p>
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                    {user.profile?.currentLocation && (
                      <p className="truncate text-xs text-muted-foreground">{user.profile.currentLocation}</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  <Button variant="outline" className="w-full justify-start rounded-2xl" asChild>
                    <Link href="/profile">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      View profile
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full justify-start rounded-2xl" asChild>
                    <Link href="/travel-plans">
                      <NotebookText className="mr-2 h-4 w-4" />
                      My plans
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full justify-start rounded-2xl" asChild>
                    <Link href="/messages">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Inbox
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}





