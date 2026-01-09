/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/app/travel-plans/[id]/components/TravelPlanDetails.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import {
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Users,
  Share2,
  MessageSquare,
  Heart,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Eye,
  Lock,
} from 'lucide-react'

import { calculateDaysBetween, formatDate } from '@/lib/utils'
import { travelPlanAPI } from '@/lib/api'
import { toast } from 'sonner'
import type { TravelPlan } from '@/types'

interface TravelPlanDetailsProps {
  travelPlan: TravelPlan
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  isUpcoming: boolean
  travelPlanId: string
  onRequestToJoin: () => void
  savedPlans: Set<string>
  setSavedPlans: React.Dispatch<React.SetStateAction<Set<string>>>
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border bg-muted/20 p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-semibold leading-snug">{value}</p>
        </div>
      </div>
    </div>
  )
}

export function TravelPlanDetails({
  travelPlan,
  isPlanOwner,
  userMatchStatus,
  isUpcoming,
  travelPlanId,
  onRequestToJoin,
  savedPlans,
  setSavedPlans,
}: TravelPlanDetailsProps) {
  const [isSaving, setIsSaving] = useState(false)

  const daysBetween = useMemo(() => {
    return calculateDaysBetween(new Date(travelPlan.startDate), new Date(travelPlan.endDate))
  }, [travelPlan.startDate, travelPlan.endDate])

  const isSaved = savedPlans.has(travelPlan.id)

  const statusBadge = useMemo(() => {
    if (!isUpcoming) {
      return (
        <Badge variant="outline" className="rounded-full">
          Completed
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="rounded-full">
        Planning
      </Badge>
    )
  }, [isUpcoming])

  const matchBadge = useMemo(() => {
    if (isPlanOwner) return null
    if (userMatchStatus === 'ACCEPTED') {
      return (
        <Badge className="rounded-full bg-green-600 text-white">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Accepted
        </Badge>
      )
    }
    if (userMatchStatus === 'PENDING') {
      return (
        <Badge className="rounded-full bg-yellow-500 text-white">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
    if (userMatchStatus === 'REJECTED') {
      return (
        <Badge className="rounded-full bg-red-600 text-white">
          <XCircle className="h-3 w-3 mr-1" />
          Declined
        </Badge>
      )
    }
    return null
  }, [isPlanOwner, userMatchStatus])

  const joinDisabled =
    !isUpcoming || userMatchStatus === 'PENDING' || userMatchStatus === 'ACCEPTED'

  const joinLabel =
    userMatchStatus === 'PENDING'
      ? 'Request pending'
      : userMatchStatus === 'ACCEPTED'
        ? 'Request accepted'
        : 'Request to join'

  const handleSaveBtnClick = async (planId: string) => {
    if (isSaving) return
    setIsSaving(true)

    // optimistic toggle
    const nextSaved = !savedPlans.has(planId)
    setSavedPlans((prev) => {
      const copy = new Set(prev)
      if (nextSaved) copy.add(planId)
      else copy.delete(planId)
      return copy
    })

    try {
      const response = await travelPlanAPI.likeTravelPlan(planId)
      const confirmedSaved = Boolean(response.data?.isSaved)

      setSavedPlans((prev) => {
        const copy = new Set(prev)
        if (confirmedSaved) copy.add(planId)
        else copy.delete(planId)
        return copy
      })
    } catch {
      // rollback on failure
      setSavedPlans((prev) => {
        const copy = new Set(prev)
        if (nextSaved) copy.delete(planId)
        else copy.add(planId)
        return copy
      })
      toast.error('Failed to like plan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero / Summary */}
      <Card className="rounded-3xl overflow-hidden border bg-background/80 backdrop-blur">
        <CardHeader className="bg-linear-to-r from-primary/10 via-background to-secondary/10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="truncate">{travelPlan.destination}</span>
              </CardTitle>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(travelPlan.startDate)} – {formatDate(travelPlan.endDate)}
                </span>
                <span className="text-muted-foreground/60">•</span>
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {travelPlan.travelType}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {statusBadge}
                {matchBadge}
                <Badge variant="outline" className="rounded-full">
                  {travelPlan.isPublic ? (
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
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
            </div>

            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* About */}
          <div className="rounded-3xl border bg-card/50 p-5">
            <h3 className="font-semibold mb-2">About this trip</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {travelPlan.description || 'No description provided.'}
            </p>
          </div>

          {/* Stats / Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatPill
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
              label="Trip duration"
              value={`${daysBetween} days`}
            />
            <StatPill
              icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
              label="Budget"
              value={travelPlan.budget}
            />
            <StatPill
              icon={<Users className="h-5 w-5 text-muted-foreground" />}
              label="Requests"
              // count might be optional in your type; this is safe
              value={(travelPlan as any)?.count?.matches ?? '—'}
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {isPlanOwner ? (
              <>
                <Link href={`/travel-plans/${travelPlanId}/matches`}>
                  <Button className="gap-2 rounded-2xl">
                    <Users className="h-4 w-4" />
                    View match requests
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="gap-2 rounded-2xl"
                  onClick={() => toast.info('Share feature coming soon!')}
                >
                  <Share2 className="h-4 w-4" />
                  Share plan
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onRequestToJoin}
                  className="gap-2 rounded-2xl"
                  disabled={joinDisabled}
                >
                  <UserPlus className="h-4 w-4" />
                  {joinLabel}
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 rounded-2xl"
                  onClick={() => toast.info('Messaging feature coming soon!')}
                >
                  <MessageSquare className="h-4 w-4" />
                  Message organizer
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 rounded-2xl"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSaveBtnClick(travelPlan.id)
                  }}
                  disabled={isSaving}
                >
                  {isSaved ? (
                    <Heart className="h-4 w-4 fill-red-600 text-red-600" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                  {isSaving ? 'Saving…' : isSaved ? 'Saved' : 'Save'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      {travelPlan.tripPhotos && travelPlan.tripPhotos.length > 0 && (
        <Card className="rounded-3xl overflow-hidden border bg-background/80 backdrop-blur">
          <CardHeader className="bg-linear-to-r from-secondary/10 via-background to-primary/10">
            <CardTitle>Trip photos</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {travelPlan.tripPhotos.map((photo, idx) => (
                <div
                  key={`${photo.url}-${idx}`}
                  className="relative overflow-hidden rounded-3xl border bg-muted/20 aspect-[4/3]"
                >
                  <Image
                    src={photo.url}
                    alt={`Trip photo ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
