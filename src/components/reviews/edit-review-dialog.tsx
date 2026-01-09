// frontend/components/reviews/edit-review-dialog.tsx
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StarRating } from './star-rating'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Edit, Save } from 'lucide-react'

interface EditReviewDialogProps {
  reviewId: string
  initialRating: number
  initialComment: string
  onReviewUpdated?: () => void
  trigger?: React.ReactNode
  open: boolean                     
  onOpenChange?: (open: boolean) => void 
}

export function EditReviewDialog({
  reviewId,
  initialRating,
  initialComment,
  onReviewUpdated,
  trigger,
}: EditReviewDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setIsLoading(true)
    try {
      await reviewAPI.update(reviewId, { rating, comment })
      toast.success('Review updated successfully!')
      setOpen(false)
      onReviewUpdated?.()
    } catch (error: unknown) {
      if(error instanceof Error){
        toast.error(error.message)
      } else {
         toast.error('Failed to update review')
      }     
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update your review below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="block mb-2">Your Rating</Label>
            <StarRating
              rating={rating}
              interactive={true}
              onChange={setRating}
              value={rating}
              size="lg"
            />
          </div>

          <div>
            <Label htmlFor="comment" className="block mb-2">
              Your Review
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="min-h-[120px]"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || rating === 0}
              className="gap-2"
            >
              {isLoading ? 'Saving...' : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}