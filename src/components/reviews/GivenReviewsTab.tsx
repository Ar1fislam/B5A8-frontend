'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReviewCard } from './review-card'
import { Star, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { Review } from '@/types'

interface GivenReviewsTabProps {
  reviews: Array<Review>
  currentUserId?: string
  isLoading: boolean
  onEditReview: (reviewId: string) => void
  onDeleteReview: (reviewId: string) => void
}

export function GivenReviewsTab({
  reviews,
  currentUserId,
  isLoading,
  onEditReview,
  onDeleteReview,
}: GivenReviewsTabProps) {
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
            <Star className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No reviews given</h3>
          <p className="text-muted-foreground mb-4">
            Complete trips with other travelers to leave reviews
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <a href="/explore">
                <User className="mr-2 h-4 w-4" />
                Find Travel Buddies
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/travel-plans">
                <Calendar className="mr-2 h-4 w-4" />
                View Your Trips
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews You&apos;ve Given</CardTitle>
        <CardDescription>
          Reviews you&apos;ve written for other travelers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              type="given"
              currentUserId={currentUserId}
              onEdit={onEditReview}
              onDelete={onDeleteReview}
              showSubject={true}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
