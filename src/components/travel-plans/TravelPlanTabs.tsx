// frontend/app/travel-plans/[id]/components/TravelPlanTabs.tsx
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { TravelPlanDetails } from './TravelPlanDetails'
import { TravelPlanMatches } from './TravelPlanMatches'
import { TravelPlanOrganizer } from './TravelPlanOrganizer'
import { TravelPlanReviews } from './TravelPlanReviews'

import { CalendarDays, Users, Star, UserRound } from 'lucide-react'
import type { Review, TravelPlan } from '@/types'

interface TravelPlanTabsProps {
  travelPlan: TravelPlan
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  isUpcoming: boolean
  travelPlanId: string
  onRequestToJoin: () => void
  reviews: Review[]
  fetchReviews: () => void
  savedPlans: Set<string>
  setSavedPlans: React.Dispatch<React.SetStateAction<Set<string>>>
}

function TabLabel({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode
  label: string
  count?: number
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center justify-center h-8 w-8 rounded-2xl bg-muted">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {typeof count === 'number' ? (
        <Badge variant="secondary" className="rounded-full px-2 py-0.5">
          {count}
        </Badge>
      ) : null}
    </span>
  )
}

export function TravelPlanTabs({
  travelPlan,
  isPlanOwner,
  userMatchStatus,
  isUpcoming,
  travelPlanId,
  onRequestToJoin,
  reviews,
  fetchReviews,
  savedPlans,
  setSavedPlans,
}: TravelPlanTabsProps) {
  const matchesCount = travelPlan.matches?.length || 0
  const reviewsCount = reviews.length || 0

  return (
    <div className="lg:col-span-2">
      <Tabs defaultValue="details" className="w-full">
        {/* Revamped tab bar */}
        <TabsList
          className={cn(
            'w-full h-auto p-1.5 rounded-3xl border bg-background/70 backdrop-blur',
            'flex flex-wrap justify-start gap-2'
          )}
        >
          <TabsTrigger value="details" className="rounded-2xl data-[state=active]:shadow-sm">
            <TabLabel
              icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
              label="Details"
            />
          </TabsTrigger>

          <TabsTrigger value="matches" className="rounded-2xl data-[state=active]:shadow-sm">
            <TabLabel
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              label="Matches"
              count={matchesCount}
            />
          </TabsTrigger>

          <TabsTrigger value="reviews" className="rounded-2xl data-[state=active]:shadow-sm">
            <TabLabel
              icon={<Star className="h-4 w-4 text-muted-foreground" />}
              label="Reviews"
              count={reviewsCount}
            />
          </TabsTrigger>

          <TabsTrigger value="organizer" className="rounded-2xl data-[state=active]:shadow-sm">
            <TabLabel
              icon={<UserRound className="h-4 w-4 text-muted-foreground" />}
              label="Organizer"
            />
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="details" className="mt-0">
            <TravelPlanDetails
              travelPlan={travelPlan}
              isPlanOwner={isPlanOwner}
              userMatchStatus={userMatchStatus}
              isUpcoming={isUpcoming}
              travelPlanId={travelPlanId}
              onRequestToJoin={onRequestToJoin}
              savedPlans={savedPlans}
              setSavedPlans={setSavedPlans}
            />
          </TabsContent>

          <TabsContent value="matches" className="mt-0">
            <TravelPlanMatches travelPlan={travelPlan} travelPlanId={travelPlanId} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <TravelPlanReviews
              travelPlanId={travelPlan.id}
              travelPlanDestination={travelPlan.destination}
              organizerId={travelPlan.user?.id}
              organizerName={travelPlan.user?.profile?.fullName || 'Traveler'}
              organizerImage={travelPlan.user?.profile?.profileImage ?? undefined}
              reviews={reviews}
              fetchReviews={fetchReviews}
            />
          </TabsContent>

          <TabsContent value="organizer" className="mt-0">
            <TravelPlanOrganizer travelPlan={travelPlan} isPlanOwner={isPlanOwner} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
