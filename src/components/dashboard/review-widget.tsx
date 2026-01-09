// frontend/components/dashboard/review-widget.tsx
'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import {
  MessageSquareText,
  StarHalf,
  Trophy,
  ChevronRight,
  PencilLine,
  UsersRound,
  AlertTriangle,
} from 'lucide-react'

interface ReviewWidgetProps {
  pendingReviews: number
  averageRating: number
  totalReviews: number
}

export function ReviewWidget({
  pendingReviews = 0,
  averageRating = 0,
  totalReviews = 0,
}: ReviewWidgetProps) {
  const router = useRouter()

  const ratingPercent = useMemo(() => {
    const safe = Number.isFinite(averageRating) ? averageRating : 0
    return Math.max(0, Math.min(100, (safe / 5) * 100))
  }, [averageRating])

  const scoreLabel = useMemo(() => {
    if (averageRating >= 4.6) return 'Excellent'
    if (averageRating >= 4.0) return 'Great'
    if (averageRating >= 3.0) return 'Good'
    if (averageRating > 0) return 'New'
    return 'No rating yet'
  }, [averageRating])

  const showNudge = pendingReviews > 0

  return (
    <Card className="rounded-3xl border bg-card/60 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10">
                <MessageSquareText className="h-5 w-5 text-primary" />
              </span>
              Feedback & ratings
            </CardTitle>
            <CardDescription className="mt-1">
              Track your reputation and finish any pending reviews.
            </CardDescription>
          </div>

          {showNudge ? (
            <Badge variant="destructive" className="rounded-full">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              {pendingReviews} pending
            </Badge>
          ) : (
            <Badge variant="secondary" className="rounded-full">
              Up to date
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Top metrics row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border bg-background/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Average</p>
              <StarHalf className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-1 text-3xl font-semibold">
              {Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{scoreLabel}</p>
          </div>

          <div className="rounded-2xl border bg-background/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Total reviews</p>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-1 text-3xl font-semibold">{totalReviews}</p>
            <p className="mt-1 text-xs text-muted-foreground">From past trips</p>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-2xl border bg-background/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Rating strength</span>
            <span className="font-medium">{ratingPercent.toFixed(0)}%</span>
          </div>
          <Progress value={ratingPercent} className="mt-3 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            A higher score helps your profile appear more trustworthy.
          </p>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            className="rounded-2xl gap-2"
            variant={showNudge ? 'default' : 'outline'}
            onClick={() => router.push('/reviews')}
          >
            <PencilLine className="h-4 w-4" />
            {showNudge ? `Finish reviews (${pendingReviews})` : 'Open reviews'}
          </Button>

          <Button
            className="rounded-2xl gap-2"
            variant="outline"
            onClick={() => router.push('/reviews?tab=given')}
          >
            <UsersRound className="h-4 w-4" />
            Reviews you gave
          </Button>
        </div>

        {/* Small footer hint */}
        <Separator />

        <button
          type="button"
          onClick={() => router.push('/reviews')}
          className="w-full rounded-2xl border bg-background/40 px-4 py-3 text-left transition hover:bg-accent/20"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">Go to Review Center</p>
              <p className="text-xs text-muted-foreground">
                View received, given, and pending items in one place.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>
      </CardContent>
    </Card>
  )
}
