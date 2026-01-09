// frontend/app/travel-plans/[id]/components/TravelPlanMatches.tsx
'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, ChevronRight } from 'lucide-react'
import { Match, TravelPlan } from '@/types'

interface TravelPlanMatchesProps {
  travelPlan: TravelPlan
  travelPlanId: string
}

export function TravelPlanMatches({
  travelPlan,
  travelPlanId,
}: TravelPlanMatchesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Requests</CardTitle>
        <CardDescription>
          Travelers interested in joining this trip
        </CardDescription>
      </CardHeader>
      <CardContent>
        {travelPlan.matches && travelPlan.matches.length > 0 ? (
          <div className="space-y-4">
            {travelPlan.matches.slice(0, 5).map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={match.initiator?.profile?.profileImage ?? undefined}
                    />
                    <AvatarFallback>
                      {match.initiator?.profile?.fullName
                        ?.charAt(0)
                        .toUpperCase() || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {match.initiator?.profile?.fullName || 'Traveler'}
                    </p>
                    <Badge
                      variant={
                        match.status === 'ACCEPTED'
                          ? 'default'
                          : match.status === 'REJECTED'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {match.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {travelPlan.matches.length > 5 && (
              <div className="text-center">
                <Link href={`/travel-plans/${travelPlanId}/matches`}>
                  <Button variant="outline">
                    View All {travelPlan.matches.length} Matches
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              No match requests yet
            </h3>
            <p className="text-muted-foreground">
              Share your travel plan to receive match requests
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
