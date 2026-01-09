'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { travelPlanAPI } from '@/lib/api'
import { toast } from 'sonner'

import {
  PlusCircle,
  Route,
  CalendarDays,
  Compass,
  UsersRound,
  PencilLine,
  Trash2,
  Eye,
  MoreHorizontal,
  Lock,
  Globe2,
  Clock,
  CheckCircle2,
} from 'lucide-react'

import { formatDate } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TravelPlan } from '@/types'

export default function TravelPlansPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) fetchTravelPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchTravelPlans = async () => {
    setIsLoading(true)
    try {
      const result = await travelPlanAPI.getMyPlans()
      setTravelPlans(result.data.plans || [])
    } catch (error) {
      toast.error('Could not load your trips')
      console.error('Travel plans error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trip plan? This cannot be undone.')) return
    try {
      await travelPlanAPI.delete(id)
      toast.success('Trip plan removed')
      fetchTravelPlans()
    } catch (error) {
      toast.error('Failed to delete trip plan')
    }
  }

  const getStatus = (startDate: string) => {
    const now = new Date()
    const start = new Date(startDate)

    if (start < now) return { label: 'Past trip', variant: 'secondary' as const, icon: CheckCircle2 }
    if (start.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return { label: 'Next 7 days', variant: 'default' as const, icon: Clock }
    }
    return { label: 'Scheduled', variant: 'outline' as const, icon: CalendarDays }
  }

  const stats = useMemo(() => {
    const total = travelPlans.length
    const upcoming = travelPlans.filter((p) => new Date(p.startDate) >= new Date()).length
    const past = total - upcoming
    const publicPlans = travelPlans.filter((p) => p.isPublic).length
    return { total, upcoming, past, publicPlans }
  }, [travelPlans])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        {/* Hero header */}
        <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-7s]" />
          </div>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <Route className="h-3.5 w-3.5" />
                Trips workspace
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your trips</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Create trips, keep dates organized, and check match requests when you’re ready.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full">
                  Total: {stats.total}
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  Upcoming: {stats.upcoming}
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  Past: {stats.past}
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  Public: {stats.publicPlans}
                </Badge>
              </div>
            </div>

            <Button className="rounded-2xl gap-2" asChild>
              <Link href="/travel-plans/new">
                <PlusCircle className="h-4 w-4" />
                Create trip
              </Link>
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="rounded-3xl border bg-card/60 backdrop-blur animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-2/3 mb-3" />
                    <div className="h-3 bg-muted rounded w-1/2 mb-6" />
                    <div className="h-24 bg-muted rounded-2xl" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : travelPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {travelPlans.map((plan) => {
                const status = getStatus(plan.startDate)
                const StatusIcon = status.icon

                return (
                  <div key={plan.id} className="group">
                    <Card className="rounded-3xl border bg-card/60 backdrop-blur transition hover:shadow-lg hover:-translate-y-0.5">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10">
                                <Compass className="h-5 w-5 text-primary" />
                              </span>
                              <span className="truncate">{plan.destination}</span>
                            </CardTitle>

                            <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(plan.startDate)} → {formatDate(plan.endDate)}
                              </span>

                              <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs">
                                <UsersRound className="h-3.5 w-3.5" />
                                {plan._count?.matches || 0} requests
                              </span>
                            </CardDescription>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/travel-plans/${plan.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Open trip
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/travel-plans/${plan.id}/edit`)}
                              >
                                <PencilLine className="mr-2 h-4 w-4" />
                                Edit details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(plan.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={status.variant} className="rounded-full">
                            <span className="inline-flex items-center gap-1">
                              <StatusIcon className="h-3.5 w-3.5" />
                              {status.label}
                            </span>
                          </Badge>

                          <Badge variant="outline" className="rounded-full">
                            {plan.travelType}
                          </Badge>

                          <Badge variant="secondary" className="rounded-full">
                            {plan.budget}
                          </Badge>

                          <Badge variant="outline" className="rounded-full">
                            {plan.isPublic ? (
                              <span className="inline-flex items-center gap-1">
                                <Globe2 className="h-3.5 w-3.5" />
                                Public
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <Lock className="h-3.5 w-3.5" />
                                Private
                              </span>
                            )}
                          </Badge>
                        </div>

                        {plan.description ? (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {plan.description}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No description yet—add one to attract better matches.
                          </p>
                        )}

                        <Separator />

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 rounded-2xl"
                            onClick={() => router.push(`/travel-plans/${plan.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            className="flex-1 rounded-2xl"
                            onClick={() => router.push(`/travel-plans/${plan.id}/matches`)}
                          >
                            Requests
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          ) : (
            <Card className="rounded-3xl border bg-card/60 backdrop-blur">
              <CardContent className="py-14 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-muted">
                  <Route className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No trips created yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first trip plan to start receiving join requests from compatible travelers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="rounded-2xl gap-2" asChild>
                    <Link href="/travel-plans/new">
                      <PlusCircle className="h-4 w-4" />
                      Create a trip
                    </Link>
                  </Button>
                  <Button variant="outline" className="rounded-2xl gap-2" asChild>
                    <Link href="/explore">
                      <Compass className="h-4 w-4" />
                      Explore public plans
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
