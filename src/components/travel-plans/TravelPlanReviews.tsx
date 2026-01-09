// frontend/app/travel-plans/[id]/components/TravelPlanReviews.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReviewCard } from '@/components/reviews/review-card'
import { LeaveReviewDialog } from '@/components/reviews/leave-review-dialog'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Star, MessageSquare, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Review } from '@/types'

interface TravelPlanReviewsProps {
  travelPlanId: string
  travelPlanDestination: string
  organizerId?: string
  organizerName: string
  organizerImage?: string
  reviews: Review[]
  fetchReviews: () => void
}

export function TravelPlanReviews({
  travelPlanId,
  travelPlanDestination,
  organizerId,
  organizerName,
  organizerImage,
  reviews,
  fetchReviews
}: TravelPlanReviewsProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
   
  // const [travelCompanions, setTravelCompanions] = useState<any[]>([])

  useEffect(() => {
    // fetchTravelCompanions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelPlanId])

  const fetchTravelCompanions = async () => {
    // Implement this based on your backend
    // Fetch users who participated in this travel plan
    try {
      // Placeholder - implement based on your matches API
      // const companions = await matchAPI.getTravelPlanCompanions(travelPlanId)
      // setTravelCompanions(companions)
    } catch (error) {
      console.error('Error fetching companions:', error)
    }
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return total / reviews.length
  }

  const averageRating = calculateAverageRating()

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Trip Reviews
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  type="received"
                  currentUserId={user?.id}
                />
              ))}
              {reviews.length > 3 && (
                <Button variant="outline" className="w-full">
                  View All Reviews ({reviews.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                No reviews yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share your experience from this trip
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leave Review Section - Only show if trip is completed */}
      {user && user.id !== organizerId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Leave Review for Organizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Share your experience traveling with {organizerName} to {travelPlanDestination}
            </p>
            <LeaveReviewDialog
              subjectId={organizerId}
              subjectName={organizerName}
              subjectImage={organizerImage}
              travelPlanId={travelPlanId}
              travelPlanDestination={travelPlanDestination}
              trigger={
                <Button className="gap-2">
                  <Star className="h-4 w-4" />
                  Write a Review
                </Button>
              }
              onReviewSubmitted={fetchReviews}
            />
          </CardContent>
        </Card>
      )}

      {/* Review Travel Companions Section */}
      {/* travelCompanions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Review Travel Companions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {travelCompanions.map((companion) => (
                <div
                  key={companion.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {companion.profileImage ? (
                        <img
                          src={companion.profileImage}
                          alt={companion.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <span className="font-semibold">
                          {companion.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{companion.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Travel companion
                      </p>
                    </div>
                  </div>
                  <LeaveReviewDialog
                    subjectId={companion.id}
                    subjectName={companion.name}
                    subjectImage={companion.profileImage}
                    travelPlanId={travelPlanId}
                    travelPlanDestination={travelPlanDestination}
                    trigger={
                      <Button size="sm" variant="outline" className="gap-2">
                        <Star className="h-3 w-3" />
                        Review
                      </Button>
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) */}
    </div>
  )
}