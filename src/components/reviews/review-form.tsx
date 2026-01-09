// frontend/components/reviews/review-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Star, Send } from 'lucide-react'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Review comment is required'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  subjectId?: string
  travelPlanId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewForm({
  subjectId,
  travelPlanId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  })

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!subjectId) {
      toast.error('Subject ID not found')
      return
    }

    setIsLoading(true)
    try {
      await reviewAPI.create({
        subjectId,
        travelPlanId,
        rating: data.rating,
        comment: data.comment,
      })
      toast.success('Review submitted successfully!')
      onSuccess?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to submit review')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
    setValue('rating', value, { shouldValidate: true })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="block mb-2">Your Rating *</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRatingClick(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  value <= (hoverRating || rating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-sm text-destructive mt-1">
            {errors.rating.message}
          </p>
        )}
        <div className="text-sm text-muted-foreground mt-2">
          {rating === 5 && 'Excellent! 😊'}
          {rating === 4 && 'Very Good! 👍'}
          {rating === 3 && 'Good! 🙂'}
          {rating === 2 && 'Fair 😐'}
          {rating === 1 && 'Poor 😞'}
          {rating === 0 && 'Select a rating'}
        </div>
      </div>

      <div>
        <Label htmlFor="comment" className="block mb-2">
          Your Review *
        </Label>
        <Textarea
          id="comment"
          placeholder="Share your experience traveling with this person..."
          className="min-h-[120px]"
          {...register('comment')}
          disabled={isLoading}
        />
        {errors.comment && (
          <p className="text-sm text-destructive mt-1">
            {errors.comment.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Be honest and specific about your experience. Your review helps other
          travelers.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || rating === 0}
          className="gap-2"
        >
          {isLoading ? (
            'Submitting...'
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Review
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
