// frontend/components/matches/match-request.tsx
'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { matchAPI } from '@/lib/api'
import { toast } from 'sonner'
import { MapPin, Calendar, Users, MessageSquare, Check, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Match } from '@/types'
import Link from 'next/link'

interface MatchRequestProps {
  match: Match
  type: 'received' | 'sent'
  onUpdate?: () => void
}

export function MatchRequest({ match, type, onUpdate }: MatchRequestProps) {
  const [isLoading, setIsLoading] = useState(false)
  const otherUser = type === 'received' ? match.initiator : null

  const handleStatusUpdate = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!otherUser) return

    setIsLoading(true)
    try {
      await matchAPI.updateStatus(match.id, status)
      toast.success(`Match ${status.toLowerCase()} successfully`)
      onUpdate?.()
    } catch (error) {
      toast.error('Failed to update match status')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (match.status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        )
      case 'ACCEPTED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Accepted
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{match.status}</Badge>
    }
  }

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* User Info */}
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={otherUser?.profile?.profileImage ?? undefined}
              />
              <AvatarFallback className="text-lg">
                {otherUser?.profile?.fullName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    {otherUser?.profile?.fullName || 'Traveler'}
                  </h3>
                  {otherUser?.profile?.currentLocation && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {otherUser.profile.currentLocation}
                    </div>
                  )}
                </div>
                {getStatusBadge()}
              </div>

              {/* Travel Plan Info */}
              {match.travelPlan && (
                <div className="space-y-2 mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {match.travelPlan.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(match.travelPlan.startDate)} -{' '}
                      {formatDate(match.travelPlan.endDate)}
                    </div>
                  </div>

                  {/* View Travel Plan Link */}
                  <div className="mt-2">
                    <Link
                      href={`/travel-plans/${match.travelPlan.id}`}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      View Travel Plan
                    </Link>
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-2">
                Sent {new Date(match.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 min-w-[200px]">
            {match.status === 'PENDING' && type === 'received' && (
              <>
                <Button
                  className="gap-2"
                  onClick={() => handleStatusUpdate('ACCEPTED')}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4" />
                  Accept Match
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleStatusUpdate('REJECTED')}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                  Decline
                </Button>
              </>
            )}

            {match.status === 'ACCEPTED' && (
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
            )}

            {match.status === 'REJECTED' && (
              <Button variant="outline" className="gap-2" disabled>
                Match Declined
              </Button>
            )}

            {type === 'sent' && (
              <Button variant="outline" className="gap-2" disabled>
                {match.status === 'PENDING'
                  ? 'Awaiting Response'
                  : match.status}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
