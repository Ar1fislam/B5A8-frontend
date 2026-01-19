// frontend/src/components/explore/explore-content.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { travelPlanAPI, matchAPI, paymentAPI } from '@/lib/api'
import { formatDate } from '@/lib/utils'

import type { Match, TravelPlan } from '@/types'
import MatchRequestDialog from './match-request-dialogue'

import {
  Sparkles,
  Search,
  Filter,
  MapPin,
  CalendarDays,
  UsersRound,
  Heart,
  SendHorizonal,
  BadgeCheck,
  Clock3,
  XCircle,
  Flame,
  ChevronLeft,
  ChevronRight,
  Compass,
  Coins,
} from 'lucide-react'

type ExplorePlan = TravelPlan & {
  savedByMe?: boolean
  _count?: { matches?: number }
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const router = useRouter()

  const [travelPlans, setTravelPlans] = useState<ExplorePlan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [joinRequestLoading, setJoinRequestLoading] = useState(false)

  const [selectedPlan, setSelectedPlan] = useState<ExplorePlan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    travelType: searchParams.get('travelType') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    sort: searchParams.get('sort') || 'upcoming',
  })

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [sentRequestPlanIds, setSentRequestPlanIds] = useState<Set<string>>(new Set())
  const [sentMatchRequests, setSentMatchRequests] = useState<Match[]>([])
  const [savedPlans, setSavedPlans] = useState<Set<string>>(new Set())

  const travelTypes = useMemo(() => ['SOLO', 'FAMILY', 'FRIENDS'], [])

  // Small animated word in hero (UI-only; no logic change)
  const heroWords = useMemo(
    () => ['adventures', 'weekends', 'backpacking', 'food trips', 'city breaks'],
    []
  )
  const [heroWordIndex, setHeroWordIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(
      () => setHeroWordIndex((i) => (i + 1) % heroWords.length),
      2200
    )
    return () => clearInterval(id)
  }, [heroWords.length])

  useEffect(() => {
    fetchTravelPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page])

  useEffect(() => {
    const fetchMatchRequests = async () => {
      try {
        const sentMatchRequestsData = await matchAPI.getMyMatches({
          type: 'sent',
          page: 1,
          limit: 20,
        })

        const sentMatchRequestsPlanIds =
          sentMatchRequestsData.data.matches
            .map((v: Match) => v.travelPlanId)
            .filter((id): id is string => Boolean(id)) || []

        setSentRequestPlanIds(new Set(sentMatchRequestsPlanIds))
        setSentMatchRequests(sentMatchRequestsData.data.matches || [])
      } catch (error) {
        console.error('Failed to fetch match requests:', error)
      }
    }

    fetchMatchRequests()
  }, [])

  const fetchTravelPlans = async () => {
    setIsLoading(true)
    try {
      // Keep original approach (Object.fromEntries)
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      ) as Record<string, string>

      const result = await travelPlanAPI.search(activeFilters, page, 9)

      const plans: ExplorePlan[] = result.data?.plans || []
      setTravelPlans(plans)
      setTotalPages(result.data?.pagination?.pages || 1)

      plans.forEach((plan) => {
        if (plan.savedByMe) {
          setSavedPlans((prev) => new Set(prev).add(plan.id))
        }
      })
    } catch (error) {
      toast.error('Failed to load travel plans')
      console.error('Explore error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchTravelPlans()
  }

  const handleReset = () => {
    setFilters({
      destination: '',
      travelType: '',
      startDate: '',
      endDate: '',
      sort: 'upcoming',
    })
    setPage(1)
  }

  const handleRequestClick = async (plan: ExplorePlan) => {
    setJoinRequestLoading(true)

    if (!user) {
      toast.error('Please login to send match requests')
      setJoinRequestLoading(false)
      return
    }

    if (user.id === plan.user?.id) {
      toast.error('You cannot send a match request to your own travel plan')
      setJoinRequestLoading(false)
      return
    }

    const subscription = await paymentAPI.getSubscription()
    if (subscription.data.subscription?.status !== 'active') {
      toast.error('You need an active subscription to send match requests')
      router.push('/payments')
      setJoinRequestLoading(false)
      return
    }

    setSelectedPlan(plan)
    setIsDialogOpen(true)
    setJoinRequestLoading(false)
  }

  const handleSaveBtnClick = async (planId: string) => {
    if (savedPlans.has(planId)) {
      setSavedPlans((prev) => {
        const newSet = new Set(prev)
        newSet.delete(planId)
        return newSet
      })
    } else {
      setSavedPlans((prev) => new Set(prev).add(planId))
    }

    try {
      const response = await travelPlanAPI.likeTravelPlan(planId)
      if (response.data.isSaved) {
        setSavedPlans((prev) => new Set(prev).add(planId))
      } else {
        setSavedPlans((prev) => {
          const newSet = new Set(prev)
          newSet.delete(planId)
          return newSet
        })
      }
    } catch (error) {
      toast.error('Failed to like plan')
    }
  }

  const handleMatchSuccess = async () => {
    if (!selectedPlan) return

    try {
      const sentMatchRequestsData = await matchAPI.getMyMatches({
        type: 'sent',
        page: 1,
        limit: 20,
      })

      const sentMatchRequestsPlanIds =
        sentMatchRequestsData.data.matches
          .map((v: Match) => v.travelPlanId)
          .filter((id): id is string => Boolean(id)) || []

      setSentRequestPlanIds(new Set(sentMatchRequestsPlanIds))
      setSentMatchRequests(sentMatchRequestsData.data.matches || [])
    } catch (error) {
      console.error('Failed to refresh match requests:', error)
    }

    fetchTravelPlans()
  }

  const getMatchStatus = (planId: string): 'PENDING' | 'ACCEPTED' | 'REJECTED' | null => {
    const match = sentMatchRequests.find((m) => m.travelPlanId === planId)
    return match?.status || null
  }

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
                <Sparkles className="h-3.5 w-3.5" />
                Explore
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Find your travel buddy
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Discover travelers with similar plans for{' '}
                <span className="text-foreground font-medium">{heroWords[heroWordIndex]}</span>.
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button className="rounded-xl" asChild>
                  <Link href="/travel-plans/new">
                    <Flame className="mr-2 h-4 w-4" />
                    Create travel plan
                  </Link>
                </Button>

                <Button variant="outline" className="rounded-xl" asChild>
                  <Link href="/dashboard">
                    <Compass className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            <div className="animate-app-fade-up">
              <div className="rounded-2xl border bg-background/60 px-4 py-3">
                <p className="text-sm font-medium">Showing</p>
                <p className="text-xs text-muted-foreground">
                  {travelPlans.length} plans • page {page}/{totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT GRID (filters left, results right) */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* FILTERS (sticky) */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="rounded-3xl border bg-card/60 p-5 backdrop-blur animate-app-fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-tight">Filters</p>
                  <p className="text-xs text-muted-foreground">Refine destination & dates</p>
                </div>

                <Button variant="outline" size="sm" className="rounded-xl" onClick={handleReset}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <form onSubmit={handleSearch} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Where are you going?"
                      className="h-11 rounded-2xl pl-10"
                      value={filters.destination}
                      onChange={(e) => handleFilterChange('destination', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Travel type</label>
                  <Select
                    value={filters.travelType}
                    onValueChange={(value) => handleFilterChange('travelType', value)}
                  >
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Start date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        className="h-11 rounded-2xl pl-10"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">End date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        className="h-11 rounded-2xl pl-10"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="h-11 w-full rounded-2xl">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>

                <Button type="button" variant="outline" className="h-11 w-full rounded-2xl" onClick={handleReset}>
                  <Filter className="mr-2 h-4 w-4" />
                  Reset filters
                </Button>
              </form>
            </div>
          </div>

          {/* RESULTS */}
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between animate-app-fade-up">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Available travel plans {travelPlans.length > 0 && <span className="text-muted-foreground">({travelPlans.length})</span>}
                </h2>
                <p className="text-sm text-muted-foreground">Click a card to view details.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by</span>
                <Select
                  defaultValue="upcoming"
                  value={filters.sort}
                  onValueChange={(value) => handleFilterChange('sort', value)}
                >
                  <SelectTrigger className="w-[190px] rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="most_recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[280px] rounded-3xl border bg-background/40 animate-pulse"
                  />
                ))}
              </div>
            ) : travelPlans.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {travelPlans.map((plan, idx) => {
                    const matchStatus = getMatchStatus(plan.id)
                    const isOwnPlan = user?.id === plan.user?.id

                    const statusPill =
                      matchStatus === 'ACCEPTED'
                        ? { label: 'Accepted', cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' }
                        : matchStatus === 'PENDING'
                          ? { label: 'Pending', cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' }
                          : matchStatus === 'REJECTED'
                            ? { label: 'Declined', cls: 'bg-rose-500/10 text-rose-700 dark:text-rose-300' }
                            : null

                    return (
                      <Link
                        href={`/travel-plans/${plan.id}`}
                        key={plan.id}
                        className="group block"
                        style={{ animationDelay: `${Math.min(idx, 8) * 60}ms` }}
                      >
                        <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-app-fade-up">
                          {/* glow */}
                          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                            <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-primary/12 blur-2xl opacity-70 transition-opacity group-hover:opacity-100" />
                            <div className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-accent/18 blur-2xl opacity-70 transition-opacity group-hover:opacity-100" />
                          </div>

                          {/* header row */}
                          <div className="relative flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl ">
                                  <MapPin className="h-4 w-4 text-black dark:text-white" />
                                </div>
                                <h3 className="truncate text-base font-semibold tracking-tight">
                                  {plan.destination}
                                </h3>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-700 dark:text-blue-300">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                                </span>

                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-black dark:text-white">
                                  <BadgeCheck className="h-3.5 w-3.5" />
                                  {plan.travelType}
                                </span>
                              </div>
                            </div>

                            <button
                              className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-background/60 transition hover:bg-accent/30"
                              onClick={(e) => {
                                e.preventDefault()
                                handleSaveBtnClick(plan.id)
                              }}
                              aria-label="Save plan"
                              title="Save"
                            >
                              <Heart
                                className={
                                  savedPlans.has(plan.id)
                                    ? 'h-5 w-5 text-rose-600 fill-rose-600'
                                    : 'h-5 w-5 text-muted-foreground'
                                }
                              />
                            </button>
                          </div>

                          {/* host + status */}
                          <div className="relative mt-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-10 w-10 ring-2 ring-background">
                                <AvatarImage src={plan.user?.profile?.profileImage ?? undefined} />
                                <AvatarFallback>
                                  {(plan.user?.profile?.fullName?.charAt(0) || 'T').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {plan.user?.profile?.fullName || 'Traveler'}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <UsersRound className="h-3.5 w-3.5" />
                                  <span>{plan._count?.matches ?? 0} requests</span>
                                  <span className="opacity-60">•</span>
                                  <span className="inline-flex items-center gap-1">
                                    <Coins className="h-3.5 w-3.5" />
                                    {plan.budget || '—'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {statusPill ? (
                              <span className={`rounded-full px-2.5 py-1 text-xs ${statusPill.cls}`}>
                                {statusPill.label}
                              </span>
                            ) : isOwnPlan ? (
                              <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                Own
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                                <Clock3 className="mr-1 inline h-3.5 w-3.5" />
                                Open
                              </span>
                            )}
                          </div>

                          {/* description */}
                          <p className="relative mt-4 line-clamp-3 text-sm text-muted-foreground">
                            {plan.description || 'No description provided—send a request to ask details.'}
                          </p>

                          {/* actions */}
                          <div className="relative mt-5 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                            {isOwnPlan ? (
                              <Button variant="outline" className="rounded-2xl" disabled>
                                Your plan
                              </Button>
                            ) : matchStatus === 'ACCEPTED' ? (
                              <Button variant="outline" className="rounded-2xl" disabled>
                                Accepted
                              </Button>
                            ) : matchStatus === 'PENDING' ? (
                              <Button variant="outline" className="rounded-2xl" disabled>
                                Pending
                              </Button>
                            ) : matchStatus === 'REJECTED' ? (
                              <Button variant="outline" className="rounded-2xl" disabled>
                                Declined
                              </Button>
                            ) : (
                              <Button
                                className="rounded-2xl"
                                disabled={joinRequestLoading}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleRequestClick(plan)
                                }}
                              >
                                <SendHorizonal className="mr-2 h-4 w-4" />
                                Request
                              </Button>
                            )}

                            <Button variant="outline" className="rounded-2xl">
                              View <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) pageNum = i + 1
                      else if (page <= 3) pageNum = i + 1
                      else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                      else pageNum = page - 2 + i

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          className="rounded-xl"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border bg-card/60 p-10 text-center backdrop-blur animate-app-fade-up">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No travel plans found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search filters or create your own travel plan
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" className="rounded-xl" onClick={handleReset}>
                    Clear Filters
                  </Button>
                  <Button className="rounded-xl" asChild>
                    <Link href="/travel-plans/new">Create Travel Plan</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Match Request Dialog */}
        {selectedPlan && (
          <MatchRequestDialog
            travelPlan={selectedPlan}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={handleMatchSuccess}
          />
        )}
      </div>
    </div>
  )
}


