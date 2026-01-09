// frontend/components/profile/ProfilePlansTab.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Calendar, Users, Share2 } from 'lucide-react'
import Link from 'next/link'

interface ProfilePlansTabProps {
  travelPlans: Array<{
    id: string
    destination: string
    startDate: Date | string
    endDate: Date | string
    budget: string
    travelType: string
    description: string
    isPublic: boolean
    userId: string
    createdAt: Date | string
    updatedAt: Date | string
  }>
  isOwnProfile: boolean
}

export function ProfilePlansTab({ travelPlans, isOwnProfile }: ProfilePlansTabProps) {
  return (
    <div className="space-y-4">
      {travelPlans.length > 0 ? (
        travelPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {plan.destination}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                    </div>
                    <Badge>{plan.travelType}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              {plan.description && (
                <p className="text-muted-foreground mb-4">
                  {plan.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Looking for companions</span>
                  </div>
                </div>
                {!isOwnProfile && <Button>Request to Join</Button>}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              No travel plans yet
            </h3>
            <p className="text-muted-foreground">
              Create your first travel plan to start finding companions
            </p>
            {isOwnProfile && (
              <Button className="mt-4" asChild>
                <Link href="/travel-plans/new">
                  Create Travel Plan
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}