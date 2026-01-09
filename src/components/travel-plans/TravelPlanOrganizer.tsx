// frontend/app/travel-plans/[id]/components/TravelPlanOrganizer.tsx
'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { MapPin, Star, MessageSquare, UserPlus, LoaderCircle } from 'lucide-react'
import { Review, TravelPlan } from '@/types'
import { useRouter } from 'next/navigation'
import { paymentAPI } from '@/lib/api'
import { toast } from 'sonner'
import { useState } from 'react'

interface TravelPlanOrganizerProps {
  travelPlan: TravelPlan
  isPlanOwner: boolean
}

export function TravelPlanOrganizer({
  travelPlan,
  isPlanOwner,
}: TravelPlanOrganizerProps) {
  // Calculate average rating for the plan owner
  const averageRating = travelPlan.user?.reviewsReceived?.length
    ? travelPlan.user?.reviewsReceived.reduce(
        (sum: number, review: Review) => sum + review.rating,
        0
      ) / travelPlan.user?.reviewsReceived.length
    : 0

  const router = useRouter()
  const [loadingSubscription, setLoadingSubscription] = useState(false)

  const handleClickViewProfile = async () => {
    setLoadingSubscription(true)
    const subscription = await paymentAPI.getSubscription()
    if (subscription.data.subscription?.status !== 'active') {
      toast.error('You need an active subscription to view full profiles')
      router.push('/payments')
      setLoadingSubscription(false)
      return
    }
    setLoadingSubscription(false)
    router.push(`/profile/${travelPlan.user?.id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trip Organizer</span>
          <Button
            variant="outline"
            size="sm"
            disabled={loadingSubscription}
            onClick={handleClickViewProfile}
          >
            {loadingSubscription && <LoaderCircle className='animate-spin' />} View Full Profile
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={travelPlan.user?.profile?.profileImage ?? undefined}
            />
            <AvatarFallback className="text-2xl">
              {travelPlan.user?.profile?.fullName?.charAt(0).toUpperCase() ||
                'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {travelPlan.user?.profile?.fullName || 'Traveler'}
                </h3>
                {travelPlan.user?.profile?.currentLocation && (
                  <div className="flex items-center gap-1 text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{travelPlan.user?.profile.currentLocation}</span>
                  </div>
                )}

                {/* Rating */}
                {averageRating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(averageRating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({travelPlan.user?._count?.reviewsReceived || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {travelPlan.user?.profile?.bio && (
              <p className="text-muted-foreground mb-4">
                {travelPlan.user?.profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold">
                  {travelPlan.user?._count?.travelPlans || 0}
                </div>
                <div className="text-sm text-muted-foreground">Trips</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold">
                  {travelPlan.user?._count?.reviewsReceived || 0}
                </div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold">
                  {travelPlan.user?.profile?.visitedCountries?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">
                  Response Rate
                </div>
              </div>
            </div>

            {/* Interests */}
            {travelPlan.user?.profile?.travelInterests &&
              travelPlan.user?.profile.travelInterests.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Travel Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {travelPlan.user.profile.travelInterests.map(
                      (interest: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-3 w-full">
          <Button className="flex-1 gap-2">
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          {!isPlanOwner && (
            <Link href={`/profile/${travelPlan.user?.id}`} className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <UserPlus className="h-4 w-4" />
                Connect
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
