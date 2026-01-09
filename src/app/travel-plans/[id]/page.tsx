// frontend/app/travel-plans/[id]/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { travelPlanAPI, matchAPI, reviewAPI, paymentAPI } from '@/lib/api'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { TravelPlanHeader } from '../../../components/travel-plans/TravelPlanHeader'
import { TravelPlanStats } from '../../../components/travel-plans/TravelPlanStats'
import { TravelPlanTabs } from '../../../components/travel-plans/TravelPlanTabs'
import { TravelPlanSidebar } from '../../../components/travel-plans/TravelPlanSidebar'
import { MatchRequestDialog } from '../../../components/travel-plans/MatchRequestDialog'
import { TravelPlanReviews } from '../../../components/travel-plans/TravelPlanReviews'
import { Match, Review, TravelPlan } from '@/types'
import Loading from '@/components/loading'
import { set } from 'zod'

export default function TravelPlanDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [joinRequestLoading, setJoinRequestLoading] = useState(false)
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false)
  const [userMatchStatus, setUserMatchStatus] = useState<
    'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  >(null)
  const [savedPlans, setSavedPlans] = useState<Set<string>>(new Set())

  const travelPlanId = params.id as string

  useEffect(() => {
    if (travelPlanId) {
      fetchTravelPlan()
      fetchUserMatchStatus()
      fetchReviews()
    }
  }, [travelPlanId])

  const fetchTravelPlan = async () => {
    setIsLoading(true)
    try {
      const result = await travelPlanAPI.getById(travelPlanId)
      setTravelPlan(result.data?.travelPlan || null)
      setSavedPlans(
        result.data?.travelPlan?.savedByMe
          ? new Set([travelPlanId])
          : new Set()
      )
    } catch (error) {
      toast.error('Failed to load travel plan details')
      console.error('Travel plan details error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserMatchStatus = async () => {
    if (!user) return

    try {
      const matchesResult = await matchAPI.getMyMatches({
        type: 'sent',
        page: 1,
        limit: 20,
      })

      const matchForThisPlan = matchesResult.data?.matches?.find(
        (match: Match) => match.travelPlanId === travelPlanId
      )

      setUserMatchStatus(matchForThisPlan?.status || null)
    } catch (error) {
      console.error('Failed to fetch match status:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      const result = await reviewAPI.getTravelPlanReviews(travelPlanId)
      setReviews(result.data.reviews || [])
    } catch (error) {
      toast.error('Failed to load reviews')
      console.error('Reviews error:', error)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this travel plan? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      await travelPlanAPI.delete(travelPlanId)
      toast.success('Travel plan deleted successfully')
      router.push('/travel-plans')
    } catch (error) {
      toast.error('Failed to delete travel plan')
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const handleMatchSuccess = () => {
    toast.success(
      'Match request sent! The plan owner will review your request.'
    )
    fetchTravelPlan()
    fetchUserMatchStatus()
  }

  const handlJoinRequestClick = async () => {
    setJoinRequestLoading(true)
    if (!user) {
      toast.error('Please login to send match requests')
      setJoinRequestLoading(false)
      return
    }

    // Check if user is viewing their own plan
    if (user.id === travelPlan?.user?.id) {
      toast.error('You cannot send a match request to your own travel plan')
      setJoinRequestLoading(false)
      return
    }

    const subscription = await paymentAPI.getSubscription()
    if (subscription.data.subscription?.status !== 'active') {
      toast.error('You need an active subscription to send match requests')
      router.push('/payments')
      setJoinRequestLoading(false)
      return
    }

    // setSelectedPlan(plan)
    setIsMatchDialogOpen(true)
    setJoinRequestLoading(false)
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading travel plan...</p>
        </div>
      </div>
    )
  }

  if (!travelPlan) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Travel Plan Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The travel plan you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </p>
          <Button onClick={() => router.push('/travel-plans')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Travel Plans
          </Button>
        </div>
      </div>
    )
  }

  const isPlanOwner = user?.id === travelPlan.user?.id
  const startDate = new Date(travelPlan.startDate)
  const isUpcoming = startDate > new Date()

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.push('/travel-plans')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Travel Plans
      </Button>

      <TravelPlanHeader
        destination={travelPlan.destination}
        startDate={travelPlan.startDate}
        endDate={travelPlan.endDate}
        travelType={travelPlan.travelType}
        isPlanOwner={isPlanOwner}
        userMatchStatus={userMatchStatus}
        isUpcoming={isUpcoming}
        joinRequestLoading={joinRequestLoading}
        onEdit={() => router.push(`/travel-plans/${travelPlanId}/edit`)}
        onDelete={handleDelete}
        onShare={handleShare}
        onRequestToJoin={handlJoinRequestClick}
      />

      <TravelPlanStats
        startDate={travelPlan.startDate}
        endDate={travelPlan.endDate}
        budget={travelPlan.budget}
        matchesCount={travelPlan.matches?.length || 0}
        isUpcoming={isUpcoming}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <TravelPlanTabs
          travelPlan={travelPlan}
          isPlanOwner={isPlanOwner}
          userMatchStatus={userMatchStatus}
          isUpcoming={isUpcoming}
          travelPlanId={travelPlanId}
          onRequestToJoin={() => setIsMatchDialogOpen(true)}
          reviews={reviews}
          fetchReviews={fetchReviews}
          savedPlans={savedPlans}
          setSavedPlans={setSavedPlans}
        />

        <TravelPlanSidebar
          travelPlan={travelPlan}
          isPlanOwner={isPlanOwner}
          userMatchStatus={userMatchStatus}
          isUpcoming={isUpcoming}
          onShare={handleShare}
          onRequestToJoin={() => setIsMatchDialogOpen(true)}
        />
      </div>

      <MatchRequestDialog
        travelPlan={travelPlan}
        isOpen={isMatchDialogOpen}
        onOpenChange={setIsMatchDialogOpen}
        onSuccess={handleMatchSuccess}
      />
    </div>
  )
}
