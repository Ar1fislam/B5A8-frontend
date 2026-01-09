// frontend/app/travel-plans/[id]/matches/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { travelPlanAPI, matchAPI } from '@/lib/api'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Users,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  UserPlus,
  Filter,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { QuickChat } from '@/components/messages/quick-chat'
import { Match, MatchWithRelations, SingleTravelPlan, TravelPlan } from '@/types'

export default function TravelPlanMatchesPage() {
  const params = useParams()
  const router = useRouter()

  const { user } = useAuth()

  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)
  const [matches, setMatches] = useState<MatchWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const travelPlanId = params.id as string

  useEffect(() => {
    if (travelPlanId) {
      fetchTravelPlanAndMatches()
    }
  }, [travelPlanId])

  const fetchTravelPlanAndMatches = async () => {
    setIsLoading(true)
    try {
      // Fetch travel plan details
      const planResult = await travelPlanAPI.getById(travelPlanId)
      setTravelPlan(planResult.data?.travelPlan || null)

      // Fetch matches for this travel plan
      // Note: You might need to adjust your backend to support this filter
      const matchesResult = await matchAPI.getMyMatches({
        travelPlanId,
        type: 'received',
        page: 1,
        limit: 50,
      })

      setMatches(matchesResult.data?.matches)
    } catch (error) {
      toast.error('Failed to load travel plan matches')
      console.error('Travel plan matches error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMatchStatusUpdate = async (
    matchId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    try {
      await matchAPI.updateStatus(matchId, status)
      toast.success(`Match ${status.toLowerCase()} successfully`)
      fetchTravelPlanAndMatches() // Refresh the list
    } catch (error) {
      toast.error('Failed to update match status')
    }
  }

  const getFilteredMatches = () => {
    if (activeTab === 'all') return matches
    return matches.filter((match) => match.status === activeTab)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'ACCEPTED':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading matches...</p>
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
            The travel plan you&apos;re looking for doesn&apos;t exist.
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
  const filteredMatches = getFilteredMatches()
  const stats = {
    total: matches.length,
    pending: matches.filter((m) => m.status === 'PENDING').length,
    accepted: matches.filter((m) => m.status === 'ACCEPTED').length,
    rejected: matches.filter((m) => m.status === 'REJECTED').length,
  }

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.push(`/travel-plans/${travelPlanId}`)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Travel Plan
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Match Requests</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{travelPlan.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(travelPlan.startDate)} -{' '}
                  {formatDate(travelPlan.endDate)}
                </span>
              </div>
            </div>
          </div>
          {!isPlanOwner && (
            <Button
              onClick={() => router.push(`/travel-plans/${travelPlanId}`)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Request to Join
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">
                  Total Requests
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.accepted}
                </div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all" className="gap-2">
                <Users className="h-4 w-4" />
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="PENDING" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="ACCEPTED" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Accepted ({stats.accepted})
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className="gap-2">
                <XCircle className="h-4 w-4" />
                Rejected ({stats.rejected})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredMatches.length > 0 ? (
                <div className="space-y-4">
                  {filteredMatches.map((match) => {
                    const otherUser = isPlanOwner
                      ? match.initiator
                      : match.receiver
                    const isPending = match.status === 'PENDING'

                    console.log('otherUser', otherUser)

                    return (
                      <Card key={match.id} className="card-hover">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start gap-6">
                            {/* User Info */}
                            <div className="flex items-start gap-4 flex-1">
                              <Avatar className="h-16 w-16">
                                <AvatarImage
                                  src={otherUser?.profile?.profileImage ?? undefined}
                                />
                                <AvatarFallback className="text-lg">
                                  {otherUser?.profile?.fullName
                                    ?.charAt(0)
                                    .toUpperCase() || 'T'}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {otherUser?.profile?.fullName ||
                                        'Traveler'}
                                    </h3>
                                    {otherUser?.profile?.currentLocation && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {otherUser.profile.currentLocation}
                                      </div>
                                    )}
                                    {otherUser?.averageRating && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-medium">
                                          {otherUser.averageRating.toFixed(1)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          ({otherUser.reviewCount} reviews)
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {getStatusBadge(match.status)}
                                </div>

                                {/* Message */}
                                {/* {match.message && (
                                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                    <p className="text-sm text-muted-foreground italic">
                                      &quot;{match.message}&quot;
                                    </p>
                                  </div>
                                )} */}

                                {/* Interests */}
                                {otherUser?.profile?.travelInterests &&
                                  otherUser.profile.travelInterests.length >
                                    0 && (
                                    <div className="mt-3">
                                      <p className="text-sm font-medium mb-1">
                                        Interests:
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {otherUser.profile.travelInterests.map(
                                          (interest, index) => (
                                            <Badge
                                              key={index}
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {interest}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                <div className="text-xs text-muted-foreground mt-2">
                                  Requested{' '}
                                  {new Date(
                                    match.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              {isPlanOwner && isPending && (
                                <>
                                  <Button
                                    className="gap-2"
                                    onClick={() =>
                                      handleMatchStatusUpdate(
                                        match.id,
                                        'ACCEPTED'
                                      )
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="gap-2 text-destructive hover:text-destructive"
                                    onClick={() =>
                                      handleMatchStatusUpdate(
                                        match.id,
                                        'REJECTED'
                                      )
                                    }
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Decline
                                  </Button>
                                </>
                              )}

                              {/* match.status === 'ACCEPTED' && (                                                                
                                <QuickChat
                                  otherUser={otherUser}
                                  matchId={match.id}
                                  variant="outline"
                                  size="sm"
                                  triggerText="Message"
                                />                                
                              ) */}

                              {!isPlanOwner && (
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  disabled
                                >
                                  {match.status === 'PENDING'
                                    ? 'Awaiting Response'
                                    : match.status}
                                </Button>
                              )}

                              <Link
                                href={`/profile/${otherUser?.profile?.userId}`}
                              >
                                <Button variant="ghost" className="w-full">
                                  View Profile
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                      {activeTab === 'all' && (
                        <Users className="h-8 w-8 text-muted-foreground" />
                      )}
                      {activeTab === 'PENDING' && (
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      )}
                      {activeTab === 'ACCEPTED' && (
                        <CheckCircle className="h-8 w-8 text-muted-foreground" />
                      )}
                      {activeTab === 'REJECTED' && (
                        <XCircle className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {activeTab === 'all' && 'No Match Requests'}
                      {activeTab === 'PENDING' && 'No Pending Requests'}
                      {activeTab === 'ACCEPTED' && 'No Accepted Requests'}
                      {activeTab === 'REJECTED' && 'No Rejected Requests'}
                    </h3>
                    <p className="text-muted-foreground">
                      {isPlanOwner
                        ? 'Share your travel plan to receive match requests'
                        : 'Be the first to request joining this travel plan'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          {/* Travel Plan Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Travel Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {travelPlan.destination}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDate(travelPlan.startDate)} -{' '}
                      {formatDate(travelPlan.endDate)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Travel Type
                  </p>
                  <Badge>{travelPlan.travelType}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Budget</p>
                  <p className="font-medium">{travelPlan.budget}</p>
                </div>

                {travelPlan.description && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="text-sm line-clamp-3">
                        {travelPlan.description}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={travelPlan.user?.profile?.profileImage ?? undefined} />
                    <AvatarFallback>
                      {travelPlan.user?.profile?.fullName
                        ?.charAt(0)
                        .toUpperCase() || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {travelPlan.user?.profile?.fullName || 'Plan Owner'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Trip Organizer
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/travel-plans/${travelPlanId}`}>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  View Plan Details
                </Button>
              </Link>

              <Link href="/explore">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Users className="h-4 w-4" />
                  Find More Travelers
                </Button>
              </Link>

              {isPlanOwner && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Manage Plan Settings
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
