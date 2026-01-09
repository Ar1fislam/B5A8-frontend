// frontend/components/reviews/leave-review-dialog.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ReviewForm } from './review-form'
import { toast } from 'sonner'
import { Star, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

interface LeaveReviewDialogProps {
  subjectId?: string
  subjectName: string
  subjectImage?: string
  travelPlanId?: string
  travelPlanDestination?: string
  trigger?: React.ReactNode
  onReviewSubmitted?: () => void
}

export function LeaveReviewDialog({
  subjectId,
  subjectName,
  subjectImage,
  travelPlanId,
  travelPlanDestination,
  trigger,
  onReviewSubmitted,
}: LeaveReviewDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    toast.success('Review submitted successfully!')
    setOpen(false)
    onReviewSubmitted?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <Star className="h-4 w-4" />
            Leave Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={subjectImage} />
              <AvatarFallback>{getInitials(subjectName)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Leave a Review</DialogTitle>
              <DialogDescription>
                How was your experience with {subjectName}?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {travelPlanDestination && (
          <div className="bg-muted/50 rounded-lg p-3 mb-4">
            <div className="text-sm font-medium mb-1">Trip Information</div>
            <div className="text-sm text-muted-foreground">
              Destination: {travelPlanDestination}
            </div>
          </div>
        )}

        <ReviewForm
          subjectId={subjectId}
          travelPlanId={travelPlanId}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}