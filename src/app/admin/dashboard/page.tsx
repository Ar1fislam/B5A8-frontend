// // src/app/admin/dashboard/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { adminAPI } from '@/lib/api'
import { toast } from 'sonner'
import {
  Users,
  Calendar,
  TrendingUp,
  Shield,
  DollarSign,
  Star,
  Activity,
} from 'lucide-react'
import type { DashboardStats } from '@/types'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    setIsLoading(true)
    try {
      const result = await adminAPI.getDashboardStats()
      setStats(result.data)
    } catch (error) {
      toast.error('Failed to load dashboard stats')
      console.error('Dashboard error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tiles = useMemo(() => {
    if (!stats) return []
    return [
      {
        label: 'Users',
        value: stats.totals.users,
        sub: `${stats.totals.activeUsers} active`,
        icon: Users,
        tone: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
      },
      {
        label: 'Plans',
        value: stats.totals.travelPlans,
        sub: `${stats.totals.activeTravelPlans} upcoming`,
        icon: Calendar,
        tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      },
      {
        label: 'Matches',
        value: stats.totals.matches,
        sub: 'Connections made',
        icon: TrendingUp,
        tone: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
      },
      {
        label: 'Subscriptions',
        value: stats.totals.subscriptions,
        sub: 'Premium members',
        icon: DollarSign,
        tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
      },
      {
        label: 'Reviews',
        value: stats.totals.reviews,
        sub: 'Quality signal',
        icon: Star,
        tone: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300',
      },
      {
        label: 'Live sessions',
        value: 247,
        sub: 'Right now',
        icon: Activity,
        tone: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
      },
    ] as const
  }, [stats])

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container py-10">
        <Card className="mx-auto max-w-xl overflow-hidden rounded-3xl border bg-card/60 backdrop-blur">
          <div className="relative p-6 sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-destructive/15 blur-3xl" />
              <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <Shield className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Access restricted</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Admin privileges are required to view this dashboard.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button asChild className="rounded-xl">
                  <Link href="/">Back to home</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/contact">Contact support</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header banner */}
      <Card className="relative mb-8 overflow-hidden rounded-3xl border bg-card/60 backdrop-blur">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
        </div>

        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1 animate-app-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Admin Console</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Operations dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor growth, activity, and platform health at a glance.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/admin/users">Users</Link>
              </Button>
              <Button asChild className="rounded-xl">
                <Link href="/admin/travel-plans">Travel plans</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-3xl border bg-card/60 backdrop-blur">
              <CardContent className="p-6">
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="mt-4 h-9 w-1/3 animate-pulse rounded bg-muted" />
                <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* Tiles */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tiles.map((t, i) => {
              const Icon = t.icon
              return (
                <Card
                  key={t.label}
                  className="group relative overflow-hidden rounded-3xl border bg-card/60 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg animate-app-fade-up"
                  style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/15" />
                  <CardContent className="relative p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{t.label}</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight">{t.value}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{t.sub}</p>
                      </div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${t.tone}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Two panels */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-7 rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle>Recent signups</CardTitle>
                <CardDescription>New accounts created recently.</CardDescription>
              </CardHeader>

              <CardContent>
                {stats.recentSignups?.length ? (
                  <div className="space-y-3">
                    {stats.recentSignups.slice(0, 8).map((signup) => (
                      <div
                        key={signup.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border bg-background/40 px-4 py-3 transition hover:bg-accent/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {signup.profile?.fullName || 'New User'}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">{signup.email}</p>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {new Date(signup.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border bg-background/40 p-6 text-sm text-muted-foreground">
                    No recent signups
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-5 rounded-3xl border bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle>Action hub</CardTitle>
                <CardDescription>Common admin workflows.</CardDescription>
              </CardHeader>

              <CardContent className="grid gap-3">
                <Button asChild className="h-12 justify-between rounded-2xl">
                  <Link href="/admin/users">
                    Manage users <span className="opacity-70">→</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 justify-between rounded-2xl">
                  <Link href="/admin/travel-plans">
                    Review travel plans <span className="opacity-70">→</span>
                  </Link>
                </Button>
                {/* <Button asChild variant="outline" className="h-12 justify-between rounded-2xl">
                  <Link href="/admin/reviews">
                    Moderate reviews <span className="opacity-70">→</span>
                  </Link>
                </Button> */}

                
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  )
}
