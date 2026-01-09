// frontend/components/layout/navbar/Notifications.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Bell, Star, MessageSquare, Calendar } from 'lucide-react'

interface NotificationsProps {
  pendingReviews: number
}

export function Notifications({ pendingReviews }: NotificationsProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingReviews > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {pendingReviews > 9 ? '9+' : pendingReviews}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {pendingReviews > 0 && (
            <Badge variant="destructive">{pendingReviews} new</Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto">
          {pendingReviews > 0 ? (
            <>
              <DropdownMenuItem
                className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                onClick={() => {
                  router.push('/reviews')
                  setIsOpen(false)
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium">Review Opportunities</p>
                    <p className="text-sm text-muted-foreground">
                      You have {pendingReviews} pending reviews
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : (
            <div className="py-6 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          )}

          {/* Quick Links */}
          {/* <DropdownMenuItem
            className="flex items-center gap-2 py-3 cursor-pointer"
            onClick={() => router.push('/messages')}
          >
            <MessageSquare className="h-4 w-4" />
            <div>
              <p className="font-medium">Messages</p>
              <p className="text-sm text-muted-foreground">
                Check your conversations
              </p>
            </div>
          </DropdownMenuItem> */}

          <DropdownMenuItem
            className="flex items-center gap-2 py-3 cursor-pointer"
            onClick={() => router.push('/reviews')}
          >
            <Star className="h-4 w-4" />
            <div>
              <p className="font-medium">My Reviews</p>
              <p className="text-sm text-muted-foreground">View all reviews</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 py-3 cursor-pointer"
            onClick={() => router.push('/travel-plans')}
          >
            <Calendar className="h-4 w-4" />
            <div>
              <p className="font-medium">Upcoming Trips</p>
              <p className="text-sm text-muted-foreground">
                Manage your travel plans
              </p>
            </div>
          </DropdownMenuItem>
        </div>

        {/* <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-center justify-center py-2"
          onClick={() => router.push('/notifications')}
        >
          View All Notifications
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}