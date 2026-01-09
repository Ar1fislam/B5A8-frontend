'use client'

import { useState, useEffect, useMemo } from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'

import { ReviewsHeader } from '@/components/reviews/ReviewsHeader'
import { ReviewsStats } from '@/components/reviews/ReviewsStats'
import { RatingDistribution } from '@/components/reviews/RatingDistribution'
import { ReviewsTabs } from '@/components/reviews/ReviewsTabs'
import { ReceivedReviewsTab } from '@/components/reviews/ReceivedReviewsTab'
import { GivenReviewsTab } from '@/components/reviews/GivenReviewsTab'
import { EditReviewDialog } from '@/components/reviews/edit-review-dialog'
import type { Review } from '@/types'

import { Star, Sparkles } from 'lucide-react'

export default function ReviewsPage() {
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState('all')
  const [givenReviews, setGivenReviews] = useState<Review[]>([])
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
  })

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'received' || activeTab === 'all') {
        const receivedData = await reviewAPI.getMyReviews('received')
        setReceivedReviews(receivedData.data.reviews || [])

        setStats((prev) => ({
          ...prev,
          averageRating: receivedData.data.averageRating || 0,
          totalReviews: receivedData.data.totalReviews || 0,
        }))
      }
      if (activeTab === 'given' || activeTab === 'all') {
        const givenData = await reviewAPI.getMyReviews('given')
        setGivenReviews(givenData.data.reviews || [])
      }
    } catch (error) {
      toast.error('Failed to load reviews')
      console.error('Reviews error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this review? This action cannot be undone.'
      )
    )
      return

    try {
      await reviewAPI.delete(reviewId)
      toast.success('Review deleted successfully')
      fetchReviews()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const handleEditReview = (reviewId: string) => {
    const review = givenReviews.find((r) => r.id === reviewId)
    if (review) setEditingReview(review)
  }

  const handleReviewUpdated = () => {
    toast.success('Review updated successfully!')
    setEditingReview(null)
    fetchReviews()
  }

  const calculateRatingDistribution = (reviews: Review[]) => {
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++
      }
    })
    return distribution
  }

  useEffect(() => {
    if (receivedReviews.length > 0) {
      const distribution = calculateRatingDistribution(receivedReviews)
      setStats((prev) => ({
        ...prev,
        ratingDistribution: distribution,
      }))
    } else {
      // keep same shape; reset distribution when no received reviews
      setStats((prev) => ({
        ...prev,
        ratingDistribution: [0, 0, 0, 0, 0],
      }))
    }
  }, [receivedReviews])

  const subtitle = useMemo(() => {
    if (stats.totalReviews > 0) {
      return `Your reputation score is ${stats.averageRating.toFixed(
        1
      )}/5 from ${stats.totalReviews} reviews.`
    }
    return 'Build trust with honest reviews from real travel experiences.'
  }, [stats.totalReviews, stats.averageRating])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-7s]" />
          </div>

          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Reviews
              </div>

              {/* Keep your existing header component, but present it in the new layout */}
              <div className="mt-4">
                <ReviewsHeader />
              </div>

              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                {subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border bg-background/60 px-4 py-3">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <div className="leading-tight">
                <p className="text-xs text-muted-foreground">Average rating</p>
                <p className="text-lg font-semibold tabular-nums">
                  {stats.averageRating.toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TOP INSIGHTS */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-3xl border bg-card/60 p-1 backdrop-blur">
            <div className="rounded-[22px] bg-background/40 p-6">
              <ReviewsStats
                averageRating={stats.averageRating}
                receivedCount={receivedReviews.length}
                givenCount={givenReviews.length}
                totalReviews={stats.totalReviews}
              />
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border bg-card/60 p-1 backdrop-blur">
            <div className="rounded-[22px] bg-background/40 p-6">
              <RatingDistribution
                ratingDistribution={stats.ratingDistribution}
                totalReviews={stats.totalReviews}
              />
            </div>
          </div>
        </div>

        {/* TABS + LISTS */}
        <div className="mt-8 rounded-3xl border bg-card/60 p-1 backdrop-blur">
          <div className="rounded-[22px] bg-background/40 p-6">
            <Tabs defaultValue="received" onValueChange={setActiveTab}>
              <ReviewsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                receivedCount={receivedReviews.length}
                givenCount={givenReviews.length}
              />

              <div className="mt-6">
                <TabsContent value="received">
                  <ReceivedReviewsTab
                    reviews={receivedReviews}
                    currentUserId={user?.id}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="given">
                  <GivenReviewsTab
                    reviews={givenReviews}
                    currentUserId={user?.id}
                    isLoading={isLoading}
                    onEditReview={handleEditReview}
                    onDeleteReview={handleDeleteReview}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Edit Review Dialog */}
        {editingReview && (
          <EditReviewDialog
            reviewId={editingReview.id}
            initialRating={editingReview.rating}
            initialComment={editingReview.comment || ''}
            onReviewUpdated={handleReviewUpdated}
            onOpenChange={(open) => !open && setEditingReview(null)}
            open={!!editingReview}
          />
        )}

        
      </div>
    </div>
  )
}
