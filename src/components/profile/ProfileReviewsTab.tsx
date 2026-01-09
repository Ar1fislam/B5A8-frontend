// frontend/components/profile/ProfileReviewsTab.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReviewCard } from '@/components/reviews/review-card'
import { StarRating } from '@/components/reviews/star-rating'
import { Star } from 'lucide-react'
import { ProfileUser } from '@/types'

interface ProfileReviewsTabProps {
  profileUser: ProfileUser
  currentUser?: {
    id: string
  } | null
  averageRating: number
}

export function ProfileReviewsTab({
  profileUser,
  currentUser,
  averageRating,
}: ProfileReviewsTabProps) {
  const reviews = profileUser.reviewsReceived || []
  const reviewCount = profileUser._count?.reviewsReceived || 0

  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0]
  reviews.forEach((review) => {
    const r = Math.round(Number(review.rating))
    if (r >= 1 && r <= 5) ratingDistribution[r - 1]++
  })

  return (
    <>
      {/* Reviews Summary */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold mb-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size="lg" />
              <p className="text-muted-foreground mt-2">
                Based on {reviewCount} reviews
              </p>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating - 1]
                const percentage =
                  reviewCount > 0 ? (count / reviewCount) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-8 text-sm">{rating} star</span>
                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              type="received"
              currentUserId={currentUser?.id}
              showAuthor={true}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                Complete your first trip to receive reviews
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
