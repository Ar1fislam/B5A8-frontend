// frontend/components/profile/ReviewOpportunityBanner.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LeaveReviewDialog } from '@/components/reviews/leave-review-dialog'
import { CheckCircle } from 'lucide-react'

interface ReviewOpportunityBannerProps {
  subjectId: string
  subjectName: string
  subjectImage?: string
  travelPlanId?: string
  travelPlanDestination?: string
  tripCount: number
  onReviewSubmitted: () => void
}

export function ReviewOpportunityBanner({
  subjectId,
  subjectName,
  subjectImage,
  travelPlanId,
  travelPlanDestination,
  tripCount,
  onReviewSubmitted,
}: ReviewOpportunityBannerProps) {
  return (
    <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold">You can leave a review!</h3>
              <p className="text-sm text-muted-foreground">
                You traveled together on {tripCount} trip{tripCount > 1 ? 's' : ''}
                {travelPlanDestination && ` to ${travelPlanDestination}`}
              </p>
            </div>
          </div>
          <LeaveReviewDialog
            subjectId={subjectId}
            subjectName={subjectName}
            subjectImage={subjectImage}
            travelPlanId={travelPlanId}
            travelPlanDestination={travelPlanDestination}
            onReviewSubmitted={onReviewSubmitted}
            trigger={
              <Button size="sm" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Write Review
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}