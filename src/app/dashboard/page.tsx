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





// 'use client'

// import { useEffect, useMemo, useState } from 'react'
// import Link from 'next/link'

// import { Button } from '@/components/ui/button'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// import { useAuth } from '@/lib/auth-context'
// import { travelPlanAPI, matchAPI } from '@/lib/api'
// import { toast } from 'sonner'
// import { formatDate } from '@/lib/utils'

// import type { Match, TravelPlan } from '@/types'

// import {
//   Sparkles,
//   Star,
//   Shield,
//   ChevronRight,
//   MapPin,
//   CalendarDays,
//   UsersRound,
//   MessageCircle,
//   Plus,
//   Compass,
//   ArrowRight,
// } from 'lucide-react'

// export default function DashboardPage() {
//   const { user } = useAuth()

//   const [upcomingPlans, setUpcomingPlans] = useState<TravelPlan[]>([])
//   const [recentMatches, setRecentMatches] = useState<Match[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   // Small animated word in the hero
//   const words = useMemo(
//     () => ['plan smarter', 'meet buddies', 'travel safer', 'collect stories'],
//     []
//   )
//   const [wordIndex, setWordIndex] = useState(0)

//   useEffect(() => {
//     const id = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 2200)
//     return () => clearInterval(id)
//   }, [words.length])

//   useEffect(() => {
//     if (!user) return
//     fetchDashboardData()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user])

//   const fetchDashboardData = async () => {
//     setIsLoading(true)
//     try {
//       // Upcoming travel plans (top 3)
//       const result = await travelPlanAPI.getMyPlans(1, 3)
//       const plansData = result.data
//       setUpcomingPlans(plansData.plans || [])

//       // Recent matches
//       const matchesData = await matchAPI.getMyMatches({
//         type: 'received',
//         status: 'ACCEPTED',
//         page: 1,
//         limit: 5,
//       })
//       setRecentMatches(matchesData.data.matches || [])
//     } catch (error) {
//       toast.error('Failed to load dashboard data')
//       console.error('Dashboard data error:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!user) return null

//   // Rating (keep graceful fallback; replace with real value when API is ready)
//   const rating =
//     (user as any)?.profile?.averageRating ??
//     (user as any)?.profile?.rating ??
//     (user as any)?.averageRating ??
//     4.8

//   const ratingLabel =
//     rating >= 4.8 ? 'Excellent' : rating >= 4.5 ? 'Great' : rating >= 4.0 ? 'Good' : 'New'

//   return (
//     <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
//       <div className="container py-8">
//         {/* HERO */}
//         <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
//           <div aria-hidden="true" className="pointer-events-none absolute inset-0">
//             <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-primary/12 blur-3xl animate-app-float" />
//             <div className="absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-7s]" />
//           </div>

//           <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//             <div className="animate-app-fade-up">
//               <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
//                 <Sparkles className="h-3.5 w-3.5" />
//                 Dashboard
//               </div>

//               <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
//                 Welcome back, {user.profile?.fullName || 'Traveler'}
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
//                 Today: <span className="text-foreground font-medium">{words[wordIndex]}</span>
//                 <span className="ml-2 inline-block h-4 w-[1px] translate-y-[2px] bg-muted-foreground/50" />
//               </p>

//               <div className="mt-5 flex flex-col gap-2 sm:flex-row">
//                 <Button asChild className="rounded-xl">
//                   <Link href="/travel-plans/new">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Create a plan
//                   </Link>
//                 </Button>

//                 <Button variant="outline" asChild className="rounded-xl">
//                   <Link href="/explore">
//                     <Compass className="mr-2 h-4 w-4" />
//                     Explore travelers
//                   </Link>
//                 </Button>

//                 {user.role === 'ADMIN' && (
//                   <Button variant="outline" asChild className="rounded-xl">
//                     <Link href="/admin/dashboard">
//                       <Shield className="mr-2 h-4 w-4" />
//                       Admin dashboard
//                     </Link>
//                   </Button>
//                 )}
//               </div>
//             </div>

//             {/* RATING (only stat, NOT a Card) */}
//             <div className="animate-app-fade-up lg:text-right">
//               <div className="inline-flex w-full max-w-md items-center justify-between gap-3 rounded-2xl border bg-background/60 px-4 py-3 shadow-sm">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10">
//                     <Star className="h-5 w-5 text-amber-600 dark:text-amber-400 fill-amber-500/30" />
//                   </div>
//                   <div className="leading-tight">
//                     <p className="text-xs text-muted-foreground">Your rating</p>
//                     <p className="text-sm font-medium">{ratingLabel}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div className="text-2xl font-semibold tabular-nums">{Number(rating).toFixed(1)}</div>
//                   <div className="hidden sm:flex items-center gap-0.5">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={
//                           i < Math.round(Number(rating))
//                             ? 'h-4 w-4 text-amber-500 fill-amber-500'
//                             : 'h-4 w-4 text-muted-foreground/40'
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <p className="mt-2 text-xs text-muted-foreground">
//                 Build trust by completing trips and collecting reviews.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* MAIN GRID */}
//         <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
//           {/* LEFT: plans + matches */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Upcoming Plans */}
//             <Card className="rounded-3xl border bg-card/60 backdrop-blur">
//               <CardHeader className="flex flex-row items-start justify-between gap-3">
//                 <div>
//                   <CardTitle className="flex items-center gap-2">
//                     <CalendarDays className="h-5 w-5 text-muted-foreground" />
//                     Upcoming plans
//                   </CardTitle>
//                   <CardDescription>Your next trips (showing up to 3).</CardDescription>
//                 </div>

//                 <Button variant="outline" size="sm" className="rounded-xl" asChild>
//                   <Link href="/travel-plans">
//                     View all <ArrowRight className="ml-2 h-4 w-4" />
//                   </Link>
//                 </Button>
//               </CardHeader>

//               <CardContent>
//                 {isLoading ? (
//                   <div className="py-10 text-center text-sm text-muted-foreground">
//                     Loading plans...
//                   </div>
//                 ) : upcomingPlans.length ? (
//                   <div className="space-y-3">
//                     {upcomingPlans.map((plan) => (
//                       <div
//                         key={plan.id}
//                         className="flex flex-col gap-3 rounded-2xl border bg-background/40 p-4 transition hover:bg-accent/20 sm:flex-row sm:items-center sm:justify-between"
//                       >
//                         <div className="min-w-0">
//                           <p className="flex items-center gap-2 font-medium">
//                             <MapPin className="h-4 w-4 text-muted-foreground" />
//                             <span className="truncate">{plan.destination}</span>
//                           </p>
//                           <p className="mt-1 text-sm text-muted-foreground">
//                             {formatDate(plan.startDate)} → {formatDate(plan.endDate)}
//                           </p>
//                         </div>

//                         <Button variant="outline" size="sm" className="rounded-xl" asChild>
//                           <Link href={`/travel-plans/${plan.id}`}>
//                             Open <ChevronRight className="ml-1 h-4 w-4" />
//                           </Link>
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="py-10 text-center">
//                     <p className="text-sm text-muted-foreground">
//                       No upcoming plans yet. Create one to start matching.
//                     </p>
//                     <Button className="mt-4 rounded-xl" asChild>
//                       <Link href="/travel-plans/new">
//                         <Plus className="mr-2 h-4 w-4" />
//                         Create travel plan
//                       </Link>
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Recent Matches */}
//             <Card className="rounded-3xl border bg-card/60 backdrop-blur">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <UsersRound className="h-5 w-5 text-muted-foreground" />
//                   Recent matches
//                 </CardTitle>
//                 <CardDescription>Latest accepted connections.</CardDescription>
//               </CardHeader>

//               <CardContent>
//                 {recentMatches.length ? (
//                   <div className="space-y-3">
//                     {recentMatches.slice(0, 4).map((match) => {
//                       const otherUser = match.initiator?.profile || match.receiver?.profile
//                       return (
//                         <div
//                           key={match.id}
//                           className="flex items-center justify-between gap-3 rounded-2xl border bg-background/40 p-4 transition hover:bg-accent/20"
//                         >
//                           <div className="flex items-center gap-3 min-w-0">
//                             <Avatar>
//                               <AvatarImage src={(otherUser as any)?.profileImage ?? undefined} />
//                               <AvatarFallback>
//                                 {(otherUser as any)?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
//                               </AvatarFallback>
//                             </Avatar>

//                             <div className="min-w-0">
//                               <p className="truncate font-medium">
//                                 Matched with {(otherUser as any)?.fullName || 'Traveler'}
//                               </p>
//                               <p className="truncate text-sm text-muted-foreground">
//                                 {match.travelPlan?.destination || 'General match'}
//                               </p>
//                             </div>
//                           </div>

//                           <Button size="sm" variant="outline" className="rounded-xl gap-2">
//                             <MessageCircle className="h-4 w-4" />
//                             Message
//                           </Button>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <div className="py-10 text-center">
//                     <p className="text-sm text-muted-foreground">
//                       No recent matches. Explore travelers to connect.
//                     </p>
//                     <Button variant="outline" className="mt-4 rounded-xl" asChild>
//                       <Link href="/explore">
//                         <Compass className="mr-2 h-4 w-4" />
//                         Explore now
//                       </Link>
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* RIGHT: profile quick panel */}
//           <div className="space-y-6">
//             <div className="rounded-3xl border bg-card/60 p-6 backdrop-blur">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-14 w-14">
//                   <AvatarImage src={user.profile?.profileImage ?? undefined} />
//                   <AvatarFallback className="text-lg">
//                     {(user.profile?.fullName?.charAt(0) || user.email.charAt(0)).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="min-w-0">
//                   <p className="truncate font-semibold">{user.profile?.fullName || 'Traveler'}</p>
//                   <p className="truncate text-sm text-muted-foreground">{user.email}</p>
//                   {user.profile?.currentLocation && (
//                     <p className="truncate text-xs text-muted-foreground">{user.profile.currentLocation}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-5 grid gap-2">
//                 <Button variant="outline" className="w-full justify-start rounded-2xl" asChild>
//                   <Link href="/profile">
//                     <ArrowRight className="mr-2 h-4 w-4" />
//                     View profile
//                   </Link>
//                 </Button>

//                 <Button variant="outline" className="w-full justify-start rounded-2xl" asChild>
//                   <Link href="/travel-plans/new">
//                     <Plus className="mr-2 h-4 w-4" />
//                     New plan
//                   </Link>
//                 </Button>

//                 <Button variant="outline" className="w-full justify-start rounded-2xl" asChild>
//                   <Link href="/explore">
//                     <Compass className="mr-2 h-4 w-4" />
//                     Find buddies
//                   </Link>
//                 </Button>
//               </div>
//             </div>

            
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }




// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { useAuth } from '@/lib/auth-context'
// import { travelPlanAPI, matchAPI } from '@/lib/api'
// import { toast } from 'sonner'
// import {
//   Calendar,
//   Users,
//   MapPin,
//   Star,
//   Plus,
//   Clock,
//   TrendingUp,
//   Briefcase,
//   MessageSquare,
//   ChevronRight,
// } from 'lucide-react'
// import { formatDate } from '@/lib/utils'
// import { Match, TravelPlan } from '@/types'

// export default function DashboardPage() {
//   const { user } = useAuth()
//   const [upcomingPlans, setUpcomingPlans] = useState<TravelPlan[]>([])
//   const [recentMatches, setRecentMatches] = useState<Match[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     if (user) {
//       fetchDashboardData()
//     }
//   }, [user])

//   const fetchDashboardData = async () => {
//     setIsLoading(true)
//     try {
//       // Fetch upcoming travel plans
//       const result = await travelPlanAPI.getMyPlans(1, 3)
//       const plansData = result.data
//       setUpcomingPlans(plansData.plans || [])

//       // Fetch recent matches
//       const matchesData = await matchAPI.getMyMatches({
//         type: 'received',
//         status: 'ACCEPTED',
//         page: 1,
//         limit: 5,
//       })
//       setRecentMatches(matchesData.data.matches || [])
//     } catch (error) {
//       toast.error('Failed to load dashboard data')
//       console.error('Dashboard data error:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!user) return null

//   return (
//     <div className="container py-8">
//       {/* Welcome Section */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">
//           Welcome back, {user.profile?.fullName || 'Traveler'}! 👋
//         </h1>
//         <p className="text-muted-foreground">
//           Here&apos;s what&apos;s happening with your travel plans and
//           connections
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <Card className="card-hover">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Upcoming Trips</p>
//                 <p className="text-2xl font-bold">{upcomingPlans.length}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                 <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="card-hover">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Active Matches</p>
//                 <p className="text-2xl font-bold">{recentMatches.length}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
//                 <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="card-hover">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">
//                   Countries Visited
//                 </p>
//                 <p className="text-2xl font-bold">
//                   {user.profile?.visitedCountries?.length || 0}
//                 </p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
//                 <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="card-hover">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Your Rating</p>
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
//                   <p className="text-2xl font-bold">4.8</p>
//                 </div>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
//                 <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Upcoming Travel Plans */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Upcoming Travel Plans</CardTitle>
//                 <CardDescription>
//                   Your scheduled trips and adventures
//                 </CardDescription>
//               </div>
//               <Link href="/travel-plans/new">
//                 <Button size="sm" className="gap-2">
//                   <Plus className="h-4 w-4" />
//                   New Plan
//                 </Button>
//               </Link>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//                   <p className="mt-2 text-muted-foreground">Loading plans...</p>
//                 </div>
//               ) : upcomingPlans.length > 0 ? (
//                 <div className="space-y-4">
//                   {upcomingPlans.map((plan) => (
//                     <div
//                       key={plan.id}
//                       className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
//                           <MapPin className="h-6 w-6 text-primary" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold">{plan.destination}</h3>
//                           <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                             <div className="flex items-center gap-1">
//                               <Calendar className="h-3 w-3" />
//                               {formatDate(plan.startDate)} -{' '}
//                               {formatDate(plan.endDate)}
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <Briefcase className="h-3 w-3" />
//                               {plan.travelType}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <Link href={`/travel-plans/${plan.id}`}>
//                         <Button variant="ghost" size="sm">
//                           View
//                           <ChevronRight className="ml-1 h-4 w-4" />
//                         </Button>
//                       </Link>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
//                     <Calendar className="h-8 w-8 text-muted-foreground" />
//                   </div>
//                   <h3 className="font-semibold mb-2">No upcoming plans</h3>
//                   <p className="text-muted-foreground mb-4">
//                     Start planning your next adventure
//                   </p>
//                   <Link href="/travel-plans/new">
//                     <Button className="gap-2">
//                       <Plus className="h-4 w-4" />
//                       Create Travel Plan
//                     </Button>
//                   </Link>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Recent Activity */}
//           <Card className="mt-6">
//             <CardHeader>
//               <CardTitle>Recent Activity</CardTitle>
//               <CardDescription>
//                 Your recent matches and interactions
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {recentMatches.length > 0 ? (
//                 <div className="space-y-4">
//                   {recentMatches.slice(0, 3).map((match) => {
//                     const otherUser =
//                       match.initiator?.profile || match.receiver?.profile
//                     return (
//                       <div
//                         key={match.id}
//                         className="flex items-center justify-between"
//                       >
//                         <div className="flex items-center gap-3">
//                           <Avatar>
//                             <AvatarFallback>
//                               {otherUser?.fullName?.charAt(0).toUpperCase() ||
//                                 'U'}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="font-medium">
//                               Matched with {otherUser?.fullName || 'Traveler'}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               {match.travelPlan?.destination || 'General match'}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button size="sm" variant="outline" className="gap-1">
//                             <MessageSquare className="h-3 w-3" />
//                             Message
//                           </Button>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
//                     <Users className="h-8 w-8 text-muted-foreground" />
//                   </div>
//                   <h3 className="font-semibold mb-2">No recent matches</h3>
//                   <p className="text-muted-foreground">
//                     Start exploring travelers to find your perfect match
//                   </p>
//                   <Link href="/explore" className="mt-4 inline-block">
//                     <Button variant="outline" className="gap-2">
//                       <TrendingUp className="h-4 w-4" />
//                       Explore Travelers
//                     </Button>
//                   </Link>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Sidebar */}
//         <div>
//           {/* Quick Actions */}
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//               <CardDescription>Get things done faster</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <Link href="/explore" className="block">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2"
//                 >
//                   <Users className="h-4 w-4" />
//                   Find Travel Buddies
//                 </Button>
//               </Link>
//               <Link href="/travel-plans/new" className="block">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2"
//                 >
//                   <Plus className="h-4 w-4" />
//                   Create Travel Plan
//                 </Button>
//               </Link>
//               <Link href="/profile" className="block">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2"
//                 >
//                   <Briefcase className="h-4 w-4" />
//                   Edit Profile
//                 </Button>
//               </Link>
//               <Link href="/explore?filter=popular" className="block">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2"
//                 >
//                   <TrendingUp className="h-4 w-4" />
//                   Popular Destinations
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>

//           {/* Profile Summary */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Your Profile</CardTitle>
//               <CardDescription>
//                 Complete your profile for better matches
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col items-center text-center mb-6">
//                 <Avatar className="h-20 w-20 mb-4">
//                   <AvatarImage src={user.profile?.profileImage ?? undefined} />
//                   <AvatarFallback className="text-lg">
//                     {user.profile?.fullName?.charAt(0).toUpperCase() ||
//                       user.email.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <h3 className="font-semibold text-lg">
//                   {user.profile?.fullName || 'Traveler'}
//                 </h3>
//                 <p className="text-muted-foreground">{user.email}</p>
//                 {user.profile?.currentLocation && (
//                   <div className="flex items-center gap-1 mt-2">
//                     <MapPin className="h-3 w-3" />
//                     <span className="text-sm">
//                       {user.profile.currentLocation}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-muted-foreground">
//                       Profile Completion
//                     </span>
//                     <span className="font-medium">65%</span>
//                   </div>
//                   <div className="h-2 rounded-full bg-muted overflow-hidden">
//                     <div className="h-full w-2/3 bg-primary rounded-full"></div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="text-center p-3 rounded-lg bg-muted/50">
//                     <div className="font-semibold">
//                       {user.profile?.visitedCountries?.length || 0}
//                     </div>
//                     <div className="text-muted-foreground">Countries</div>
//                   </div>
//                   <div className="text-center p-3 rounded-lg bg-muted/50">
//                     <div className="font-semibold">{upcomingPlans.length}</div>
//                     <div className="text-muted-foreground">Upcoming</div>
//                   </div>
//                 </div>

//                 <Link href="/profile/edit">
//                   <Button className="w-full">Complete Profile</Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
