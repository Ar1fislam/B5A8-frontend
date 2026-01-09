// frontend/components/travel-plans/TravelPlanTimeline.tsx
// frontend/app/travel-plans/[id]/components/TravelPlanTimeline.tsx
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, CheckCircle, Clock } from 'lucide-react'
import { formatDate, calculateDaysBetween } from '@/lib/utils'

interface TravelPlanTimelineProps {
  destination: string
  startDate: string | Date
  endDate: string | Date
  isUpcoming: boolean
}

export function TravelPlanTimeline({
  destination,
  startDate,
  endDate,
  isUpcoming
}: TravelPlanTimelineProps) {
  const daysBetween = calculateDaysBetween(new Date(startDate), new Date(endDate))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Departure</p>
              <p className="text-sm text-muted-foreground">{formatDate(startDate)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Destination</p>
              <p className="text-sm text-muted-foreground">{destination}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Return</p>
              <p className="text-sm text-muted-foreground">{formatDate(endDate)}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-1">Trip Status</p>
            <Badge variant={isUpcoming ? "default" : "secondary"} className="text-sm">
              {isUpcoming ? 'Upcoming' : 'Completed'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {isUpcoming 
                ? `${daysBetween} days until departure`
                : 'Trip completed successfully'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}