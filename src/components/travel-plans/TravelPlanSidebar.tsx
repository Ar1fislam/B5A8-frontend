// frontend/app/travel-plans/[id]/components/TravelPlanSidebar.tsx
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TravelPlanTimeline } from './TravelPlanTimeline'
// import { QuickActions } from './QuickActions'
import { Share2 } from 'lucide-react'
import { TravelPlan } from '@/types'

interface TravelPlanSidebarProps {
  travelPlan: TravelPlan
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  isUpcoming: boolean
  onShare: () => void
  onRequestToJoin: () => void
}

export function TravelPlanSidebar({
  travelPlan,
  isPlanOwner,
  userMatchStatus,
  isUpcoming,
  onShare,
  onRequestToJoin
}: TravelPlanSidebarProps) {
  return (
    <div className='items-center py-22'>
      {/* <QuickActions
        isPlanOwner={isPlanOwner}
        userMatchStatus={userMatchStatus}
        isUpcoming={isUpcoming}
        travelPlanId={travelPlan.id}
        onRequestToJoin={onRequestToJoin}
      /> */}

      <TravelPlanTimeline
        destination={travelPlan.destination}
        startDate={travelPlan.startDate}
        endDate={travelPlan.endDate}
        isUpcoming={isUpcoming}
      />

    </div>
  )
}