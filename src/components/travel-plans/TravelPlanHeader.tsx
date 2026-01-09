// frontend/app/travel-plans/[id]/components/TravelPlanHeader.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Edit,
  Trash2,
  Share2,
  UserPlus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  LoaderCircle,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { formatDate, calculateDaysBetween } from '@/lib/utils'

interface TravelPlanHeaderProps {
  destination: string
  startDate: string | Date
  endDate: string | Date
  travelType: string
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  isUpcoming: boolean
  joinRequestLoading: boolean
  onEdit: () => void
  onDelete: () => void
  onShare: () => void
  onRequestToJoin: () => void
}

function StatusBadge({
  isPlanOwner,
  userMatchStatus,
}: {
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
}) {
  if (isPlanOwner || !userMatchStatus) return null

  if (userMatchStatus === 'PENDING') {
    return (
      <Badge className="rounded-full bg-yellow-500 text-white">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
  }

  if (userMatchStatus === 'ACCEPTED') {
    return (
      <Badge className="rounded-full bg-green-600 text-white">
        <CheckCircle className="h-3 w-3 mr-1" />
        Accepted
      </Badge>
    )
  }

  return (
    <Badge className="rounded-full bg-red-600 text-white">
      <XCircle className="h-3 w-3 mr-1" />
      Declined
    </Badge>
  )
}

export function TravelPlanHeader({
  destination,
  startDate,
  endDate,
  travelType,
  isPlanOwner,
  userMatchStatus,
  isUpcoming,
  joinRequestLoading,
  onEdit,
  onDelete,
  onShare,
  onRequestToJoin,
}: TravelPlanHeaderProps) {
  const daysBetween = calculateDaysBetween(new Date(startDate), new Date(endDate))

  const joinDisabled =
    !isUpcoming ||
    userMatchStatus === 'PENDING' ||
    userMatchStatus === 'ACCEPTED' ||
    joinRequestLoading

  const joinLabel =
    userMatchStatus === 'PENDING'
      ? 'Request pending'
      : userMatchStatus === 'ACCEPTED'
        ? 'Request accepted'
        : 'Request to join'

  return (
    <div className="mb-8">
      <div className="rounded-3xl border bg-linear-to-r from-primary/10 via-background to-secondary/10 p-5 md:p-6 overflow-hidden relative">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 relative">
          {/* Left: title + meta */}
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight truncate">
                  {destination}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(startDate)} – {formatDate(endDate)}
                  </span>

                  <span className="text-muted-foreground/60">•</span>

                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {daysBetween} days
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="rounded-full" variant={isUpcoming ? 'default' : 'secondary'}>
                    {isUpcoming ? 'Upcoming' : 'Completed'}
                  </Badge>

                  <Badge className="rounded-full" variant="outline">
                    {travelType}
                  </Badge>

                  <StatusBadge isPlanOwner={isPlanOwner} userMatchStatus={userMatchStatus} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {isPlanOwner ? (
              <>
                <Button variant="outline" onClick={onEdit} className="gap-2 rounded-2xl">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="gap-2 rounded-2xl text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onShare} className="gap-2 rounded-2xl">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>

                <Button
                  onClick={onRequestToJoin}
                  className="gap-2 rounded-2xl"
                  disabled={joinDisabled}
                >
                  {joinRequestLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {joinLabel}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
