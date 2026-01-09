//src\app\admin\travel-plans\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Globe,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { toast } from 'sonner'
import { formatDate, calculateDaysBetween } from '@/lib/utils'

interface AdminTravelPlan {
  id: string
  destination: string
  startDate: string
  endDate: string
  travelType: string
  budget: string
  isPublic: boolean
  createdAt: string
  user: {
    id: string
    email: string
    profile?: {
      fullName: string
      profileImage?: string
    }
  }
  _count?: {
    matches: number
  }
}

export default function AdminTravelPlansPage() {
  const [travelPlans, setTravelPlans] = useState<AdminTravelPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'public' | 'private'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    fetchTravelPlans()
  }, [page, selectedVisibility, selectedStatus])

  const fetchTravelPlans = async () => {
    setIsLoading(true)
    try {
      const filters: any = {}
      if (searchQuery) filters.search = searchQuery
      if (selectedVisibility !== 'all') filters.visibility = selectedVisibility
      if (selectedStatus !== 'all') filters.status = selectedStatus

      const result = await adminAPI.getAllTravelPlans(page, 20, filters)
      setTravelPlans(result.data?.travelPlans || [])
      setTotalPages(result.data?.pagination?.pages || 1)
    } catch (error) {
      toast.error('Failed to load travel plans')
      console.error('Admin travel plans error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchTravelPlans()
  }
  const [deleteOpen, setDeleteOpen] = useState(false)
const [deletePlanId, setDeletePlanId] = useState<string | null>(null)
const [isDeleting, setIsDeleting] = useState(false)

  const requestDelete = (planId: string) => {
  setDeletePlanId(planId)
  setDeleteOpen(true)
}

const confirmDelete = async () => {
  if (!deletePlanId) return

  setIsDeleting(true)
  try {
    await adminAPI.deleteTravelPlan(deletePlanId)
    toast.success('Travel plan deleted successfully')
    setDeleteOpen(false)
    setDeletePlanId(null)
    fetchTravelPlans()
  } catch (error) {
    toast.error('Failed to delete travel plan')
  } finally {
    setIsDeleting(false)
  }
}

  

  const handleExport = () => {
    toast.info('Export feature coming soon!')
  }

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date()
  }

  
  return (
  <div className="container py-8">
    {/* Header banner (new design, no stats cards) */}
    <Card className="relative mb-8 overflow-hidden rounded-3xl border bg-card/60 backdrop-blur">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
      </div>

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="animate-app-fade-up">
            <p className="text-xs text-muted-foreground">Admin Console</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Travel plans workspace
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Search, review, and moderate itineraries created by travelers. Use visibility and time filters to focus quickly.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleExport} className="rounded-xl gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button asChild className="rounded-xl">
              <Link href="/travel-plans">
                Open public listing
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Filters toolbar */}
    <Card className="mb-6 rounded-3xl border bg-card/60 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleSearch} className="w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search destination or organizer email…"
                className="h-11 rounded-2xl pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filters
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Visibility</span>
                {(['all', 'public', 'private'] as const).map((v) => (
                  <Button
                    key={v}
                    type="button"
                    size="sm"
                    variant={selectedVisibility === v ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => {
                      setPage(1)
                      setSelectedVisibility(v)
                    }}
                  >
                    {v === 'all' ? 'Any' : v}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Time</span>
                {(['all', 'upcoming', 'past'] as const).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={selectedStatus === s ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => {
                      setPage(1)
                      setSelectedStatus(s)
                    }}
                  >
                    {s === 'all' ? 'Any' : s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-1">Page: {page}/{totalPages}</span>
          <span className="rounded-full bg-muted px-2 py-1">Results: {travelPlans.length}</span>
        </div>
      </CardContent>
    </Card>

    {/* Results */}
    <Card className="rounded-3xl border bg-card/60 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Moderation queue</CardTitle>
        <CardDescription>
          Open a plan to review details or remove content that violates guidelines.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl border bg-background/40 animate-pulse"
              />
            ))}
          </div>
        ) : travelPlans.length > 0 ? (
          <>
            {/* Mobile: card list (unique + looks different) */}
            <div className="grid gap-3 md:hidden">
              {travelPlans.map((plan) => {
                const upcoming = isUpcoming(plan.startDate)
                const daysBetween = calculateDaysBetween(
                  new Date(plan.startDate),
                  new Date(plan.endDate)
                )

                return (
                  <Card key={plan.id} className="rounded-2xl border bg-background/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{plan.destination}</p>
                            <p className="text-xs text-muted-foreground">
                              {daysBetween} days • {plan.budget}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="outline">{plan.travelType}</Badge>
                          <Badge variant={upcoming ? 'default' : 'secondary'}>
                            {upcoming ? 'Upcoming' : 'Past'}
                          </Badge>
                          <Badge variant={plan.isPublic ? 'default' : 'outline'}>
                            {plan.isPublic ? 'Public' : 'Private'}
                          </Badge>
                          <Badge variant="secondary" className="gap-1">
                            <Users className="h-3 w-3" />
                            {plan._count?.matches || 0}
                          </Badge>
                        </div>

                        <div className="mt-3 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {plan.user.profile?.fullName || 'Anonymous'}
                          </span>{' '}
                          • {plan.user.email}
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          {formatDate(plan.startDate)} → {formatDate(plan.endDate)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1 rounded-xl gap-1">
                        <Link href={`/travel-plans/${plan.id}`}>
                          <Eye className="h-3 w-3" />
                          View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 rounded-xl gap-1"
                        onClick={() => requestDelete(plan.id)}

                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Desktop: table (restyled cells so it doesn’t look like the old one) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-3 px-4 text-left font-medium">Plan</th>
                    <th className="py-3 px-4 text-left font-medium">Organizer</th>
                    <th className="py-3 px-4 text-left font-medium">Dates</th>
                    <th className="py-3 px-4 text-left font-medium">Labels</th>
                    <th className="py-3 px-4 text-left font-medium">Matches</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {travelPlans.map((plan) => {
                    const upcoming = isUpcoming(plan.startDate)
                    const daysBetween = calculateDaysBetween(
                      new Date(plan.startDate),
                      new Date(plan.endDate)
                    )

                    return (
                      <tr
                        key={plan.id}
                        className="border-b transition hover:bg-accent/20"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{plan.destination}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {daysBetween} days • {plan.budget}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
                              {plan.user.profile?.profileImage ? (
                                // keep <img> as you had; no next/image needed here
                                <img
                                  src={plan.user.profile.profileImage}
                                  alt={plan.user.profile.fullName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Users className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {plan.user.profile?.fullName || 'Anonymous'}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">{plan.user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(plan.startDate)}</span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              → {formatDate(plan.endDate)}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{plan.travelType}</Badge>
                            <Badge variant={upcoming ? 'default' : 'secondary'}>
                              {upcoming ? 'Upcoming' : 'Past'}
                            </Badge>
                            <Badge variant={plan.isPublic ? 'default' : 'outline'}>
                              {plan.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{plan._count?.matches || 0}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button asChild size="sm" variant="outline" className="rounded-xl gap-1">
                              <Link href={`/travel-plans/${plan.id}`}>
                                <Eye className="h-3 w-3" />
                                View
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => requestDelete(plan.id)}

                              className="rounded-xl gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Globe className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">No plans found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search term or change filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              Page <span className="text-foreground font-medium">{page}</span> of{' '}
              <span className="text-foreground font-medium">{totalPages}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    <AlertDialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

    <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
      <AlertDialog.Title className="text-lg font-semibold tracking-tight">
        Delete travel plan?
      </AlertDialog.Title>

      <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
        This action cannot be undone. It will also delete associated matches and reviews.
      </AlertDialog.Description>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <AlertDialog.Cancel asChild>
          <Button variant="outline" className="rounded-xl" disabled={isDeleting}>
            Cancel
          </Button>
        </AlertDialog.Cancel>

        <AlertDialog.Action asChild>
          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>

  </div>
)

}