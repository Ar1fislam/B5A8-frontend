// frontend/components/profile/ProfileSidebar.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StarRating } from '@/components/reviews/star-rating'
import { Flag, Globe, Calendar, Users, Star } from 'lucide-react'

interface ProfileSidebarProps {
  profileUser: {
    profile?: {
      phoneNumber?: string
      visitedCountries?: string[]
    }
    _count?: {
      travelPlans: number
      reviewsReceived: number
    }
    reviewsReceived?: Array<{
      rating: number
    }>
  }
  averageRating: number
}

export function ProfileSidebar({ profileUser, averageRating }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Trust & Safety */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Trust & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Email Verified</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              ✓ Verified
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Phone Verified</span>
            {profileUser.profile?.phoneNumber ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700"
              >
                ✓ Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                Not Added
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Member Since</span>
            <span className="text-sm text-muted-foreground">2023</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>Countries Visited</span>
            </div>
            <span className="font-semibold">
              {profileUser.profile?.visitedCountries?.length || 0}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Trips Planned</span>
            </div>
            <span className="font-semibold">
              {profileUser._count?.travelPlans || 0}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Travel Companions</span>
            </div>
            <span className="font-semibold">24</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>Average Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <StarRating rating={averageRating} size="sm" />
              <span className="font-semibold ml-1">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}