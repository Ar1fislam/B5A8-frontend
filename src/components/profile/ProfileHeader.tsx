// frontend/components/profile/ProfileHeader.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from '@/components/reviews/star-rating'
import { LeaveReviewDialog } from '@/components/reviews/leave-review-dialog'
import { formatDate } from '@/lib/utils'
import {
  MapPin,
  Briefcase,
  Star,
  Mail,
  Phone,
  Edit,
  Heart,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import { ProfileUser } from '@/types'

interface ProfileHeaderProps {
  profileUser: ProfileUser
  currentUser?: {
    id: string
    isPremium: boolean
  } | null
  isOwnProfile: boolean
  canReview?: boolean
  averageRating: number
  onReviewSubmitted?: () => void
}

export function ProfileHeader({
  profileUser,
  currentUser,
  isOwnProfile,
  canReview = false,
  averageRating,
  onReviewSubmitted,
}: ProfileHeaderProps) {
  const calculateAverageRating = () => {
    if (
      !profileUser.reviewsReceived ||
      profileUser.reviewsReceived.length === 0
    )
      return 0
    const total = profileUser.reviewsReceived.reduce(
      (sum, review) => sum + review.rating,
      0
    )
    return total / profileUser.reviewsReceived.length
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage className='object-cover w-full h-full' src={profileUser.profile?.profileImage} />
              <AvatarFallback className="text-3xl">
                {profileUser.profile?.fullName?.charAt(0).toUpperCase() || 'T'}
              </AvatarFallback>
            </Avatar>
            {currentUser?.isPremium && (
              <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-500 border-4 border-background flex items-center justify-center">
                <Badge className="bg-blue-500 text-white rounded-full w-6 h-6">✓</Badge>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">
                    {profileUser.profile?.fullName || 'Traveler'}
                  </h1>
                  {isOwnProfile && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      asChild
                    >
                      <Link href="/profile/edit">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Link>
                    </Button>
                  )}
                </div>

                {profileUser.profile?.currentLocation && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{profileUser.profile.currentLocation}</span>
                  </div>
                )}

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({profileUser._count?.reviewsReceived || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-semibold">
                      {profileUser._count?.travelPlans || 0}
                    </span>
                    <span className="text-muted-foreground">trips</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && currentUser && (
                <div className="flex gap-3">
                  <Button className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>

                  {canReview && (
                    <LeaveReviewDialog
                      subjectId={profileUser.id}
                      subjectName={profileUser.profile?.fullName || 'Traveler'}
                      subjectImage={profileUser.profile?.profileImage}
                      onReviewSubmitted={onReviewSubmitted}
                      trigger={
                        <Button variant="outline" className="gap-2">
                          <Star className="h-4 w-4" />
                          Leave Review
                        </Button>
                      }
                    />
                  )}

                  <Button variant="outline" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Connect
                  </Button>
                </div>
              )}
            </div>

            {/* Bio */}
            {profileUser.profile?.bio && (
              <p className="text-muted-foreground mb-6">
                {profileUser.profile.bio}
              </p>
            )}

            {/* Travel Interests */}
            {profileUser.profile?.travelInterests &&
              profileUser.profile.travelInterests.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Travel Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.profile.travelInterests.map(
                      (interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Contact Info */}
            <div className="flex flex-wrap gap-6 text-sm">
              {profileUser.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{profileUser.email}</span>
                </div>
              )}
              {profileUser.profile?.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{profileUser.profile.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
