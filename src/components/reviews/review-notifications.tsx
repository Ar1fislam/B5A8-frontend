// frontend/components/reviews/review-notifications.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LeaveReviewDialog } from './leave-review-dialog'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Bell, Star, Calendar, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

interface ReviewNotification {
  id: string
  subjectId: string
  subjectName: string
  subjectImage?: string
  travelPlanId: string
  travelPlanDestination: string
  tripDate: string
}

export function ReviewNotifications() {
  const [notifications, setNotifications] = useState<ReviewNotification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    fetchReviewOpportunities()
  }, [])

  const fetchReviewOpportunities = async () => {
    setIsLoading(true)
    try {
      // This would call a new API endpoint that returns users you can review
      // For now, using a mock implementation
      const response = await fetch('/api/reviews/opportunities')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching review opportunities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }

  if (!isOpen || notifications.length === 0) {
    return null
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Review Opportunities</h3>
            <Badge variant="outline" className="ml-2">
              {notifications.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {notification.subjectImage ? (
                    <Image
                      src={notification.subjectImage}
                      alt={notification.subjectName}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <span className="font-semibold">
                      {notification.subjectName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{notification.subjectName}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{notification.travelPlanDestination}</span>
                    <span>•</span>
                    <span>{formatDate(notification.tripDate)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <LeaveReviewDialog
                  subjectId={notification.subjectId}
                  subjectName={notification.subjectName}
                  subjectImage={notification.subjectImage}
                  travelPlanId={notification.travelPlanId}
                  travelPlanDestination={notification.travelPlanDestination}
                  trigger={
                    <Button size="sm" className="gap-2">
                      <Star className="h-3 w-3" />
                      Review
                    </Button>
                  }
                  onReviewSubmitted={() => removeNotification(notification.id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {notifications.length > 2 && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Navigate to reviews page or show all
              }}
            >
              View All Opportunities ({notifications.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
