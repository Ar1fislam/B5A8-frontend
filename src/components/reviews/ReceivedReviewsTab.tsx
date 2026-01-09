// frontend/components/reviews/ReceivedReviewsTab.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReviewCard } from './review-card'
import { User, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Review } from '@/types'

interface ReceivedReviewsTabProps {
  reviews: Array<Review>
  currentUserId?: string
  isLoading: boolean
}

export function ReceivedReviewsTab({
  reviews,
  currentUserId,
  isLoading,
}: ReceivedReviewsTabProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading reviews...</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No reviews yet</h3>
          <p className="text-muted-foreground mb-4">
            Complete trips with other travelers to receive reviews
          </p>
          <Button asChild>
            <Link href="/travel-plans/new">
              <Calendar className="mr-2 h-4 w-4" />
              Plan Your Next Trip
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews About You</CardTitle>
        <CardDescription>
          What other travelers say about traveling with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              type="received"
              currentUserId={currentUserId}
              showAuthor={true}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}