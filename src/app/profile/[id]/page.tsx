'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { reviewAPI, userAPI } from '@/lib/api'
import { toast } from 'sonner'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ReviewOpportunityBanner } from '@/components/profile/ReviewOpportunityBanner'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileAboutTab } from '@/components/profile/ProfileAboutTab'
import { ProfileReviewsTab } from '@/components/profile/ProfileReviewsTab'
import { ProfilePlansTab } from '@/components/profile/ProfilePlansTab'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar'
import { ProfileUser, ReviableTrip } from '@/types'

export default function ProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [canReview, setCanReview] = useState(false)
  const [reviewableTrips, setReviewableTrips] = useState<ReviableTrip[]>([])
  const [activeTab, setActiveTab] = useState('about')

  const isOwnProfile = currentUser?.id === params.id

  useEffect(() => {
    fetchProfile()
    if (currentUser && !isOwnProfile) {
      checkReviewPermission()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, currentUser])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const result = await userAPI.getPublicProfile(params.id as string)
      setProfileUser(result.data.user)
    } catch (error) {
      toast.error('Failed to load profile')
      console.error('Profile error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkReviewPermission = async () => {
    if (!currentUser || isOwnProfile) return

    try {
      const response = await reviewAPI.checkCanReview(params.id as string)
      setCanReview(response.data.canReview)
      if (response.data.trips) {
        setReviewableTrips(response.data.trips)
      }
    } catch (error) {
      console.error('Error checking review permission:', error)
      setCanReview(false)
    }
  }

  const calculateAverageRating = () => {
    if (
      !profileUser?.reviewsReceived ||
      profileUser.reviewsReceived.length === 0
    )
      return 0
    const total = profileUser.reviewsReceived.reduce(
      (sum, review) => sum + review.rating,
      0
    )
    return total / profileUser.reviewsReceived.length
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <p className="text-muted-foreground">
            The user profile you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

  const averageRating = calculateAverageRating()

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <ProfileHeader
        profileUser={profileUser}
        currentUser={currentUser}
        isOwnProfile={isOwnProfile}
        canReview={canReview}
        averageRating={averageRating}
        onReviewSubmitted={fetchProfile}
      />

      {/* Review Opportunities Banner */}
      {canReview && reviewableTrips.length > 0 && (
        <ReviewOpportunityBanner
          subjectId={profileUser.id}
          subjectName={profileUser.profile?.fullName || 'Traveler'}
          subjectImage={profileUser.profile?.profileImage}
          travelPlanId={reviewableTrips[0]?.id}
          travelPlanDestination={reviewableTrips[0]?.destination}
          tripCount={reviewableTrips.length}
          onReviewSubmitted={() => {
            setCanReview(false)
            fetchProfile()
          }}
        />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          travelPlansCount={profileUser.travelPlans?.length || 0}
          reviewsCount={profileUser._count?.reviewsReceived || 0}
        />

        <TabsContent value="about" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProfileAboutTab
                profileUser={profileUser}
                isOwnProfile={isOwnProfile}
              />
            </div>
            <ProfileSidebar
              profileUser={profileUser}
              averageRating={averageRating}
            />
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <ProfilePlansTab
            travelPlans={profileUser.travelPlans || []}
            isOwnProfile={isOwnProfile}
          />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProfileReviewsTab
                profileUser={profileUser}
                currentUser={currentUser}
                averageRating={averageRating}
              />
            </div>

            {/* Review Guidelines Sidebar */}
            <div>
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Review Guidelines
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Be Honest</h4>
                      <p className="text-sm text-muted-foreground">
                        Share your genuine experience to help other travelers.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        Be Specific
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Include details about the trip, communication, and
                        overall experience.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        Be Respectful
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on the experience rather than personal attributes.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Timing</h4>
                      <p className="text-sm text-muted-foreground">
                        Reviews can only be left after a trip is completed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
