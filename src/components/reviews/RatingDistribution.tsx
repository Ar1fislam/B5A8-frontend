// frontend/components/reviews/RatingDistribution.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface RatingDistributionProps {
  ratingDistribution: number[]
  totalReviews: number
  title?: string
  description?: string
}

export function RatingDistribution({
  ratingDistribution,
  totalReviews,
  title = "Rating Distribution",
  description = "Breakdown of all ratings you've received"
}: RatingDistributionProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating, index) => {
            const count = ratingDistribution[rating - 1]
            const percentage = totalReviews > 0 
              ? (count / totalReviews) * 100 
              : 0
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-20">
                  <span className="text-sm font-medium w-6">{rating}</span>
                  <span className="h-4 w-4 text-yellow-500">★</span>
                  <span className="text-sm text-muted-foreground">
                    ({count})
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}