// frontend/components/reviews/ReviewsStats.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from './star-rating'
import { Star, User, TrendingUp } from 'lucide-react'

interface ReviewsStatsProps {
  averageRating: number
  receivedCount: number
  givenCount: number
  totalReviews: number
}

export function ReviewsStats({
  averageRating,
  receivedCount,
  givenCount,
  totalReviews,
}: ReviewsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <StarRating rating={averageRating} size="sm" />
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {receivedCount}
            </div>
            <div className="h-12 w-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground">Reviews Received</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {givenCount}
            </div>
            <div className="h-12 w-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground">Reviews Given</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {totalReviews}
            </div>
            <div className="h-12 w-12 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}