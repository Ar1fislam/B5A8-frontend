// frontend/components/reviews/review-card.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from './star-rating'
import { formatDate, getInitials } from '@/lib/utils'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Review } from '@/types'

interface ReviewCardProps {
  review: Review

  type?: 'received' | 'given'
  currentUserId?: string
  onEdit?: (reviewId: string) => void
  onDelete?: (reviewId: string) => void
  showAuthor?: boolean
  showSubject?: boolean
}

export function ReviewCard({
  review,
  type = 'received',
  currentUserId,
  onEdit,
  onDelete,
  showAuthor = true,
}: ReviewCardProps) {
  const isOwner = currentUserId === review.author?.id
  const canEdit = isOwner && onEdit
  const canDelete = isOwner && onDelete

  const getDisplayUser = () => {
    if (type === 'received') {
      return review.author
    }
    return review.subject
  }

  const user = getDisplayUser()
  const userName = user?.profile?.fullName || 'Traveler'
  const userImage = user?.profile?.profileImage

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={userImage ?? undefined} />
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{userName}</h4>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {(canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(review.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Review
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(review.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Review
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {review.comment && (
          <p className="text-muted-foreground mb-4">{review.comment}</p>
        )}

        {review.travelPlan && (
          <div className="text-sm bg-muted/50 rounded-lg p-3">
            <div className="font-medium mb-1">Trip Review</div>
            <div className="text-muted-foreground">
              Destination: {review.travelPlan.destination}
            </div>
            {review.travelPlan.startDate && (
              <div className="text-muted-foreground">
                Trip date: {formatDate(review.travelPlan.startDate)}
              </div>
            )}
          </div>
        )}

        {showAuthor && review.author && type === 'given' && (
          <div className="text-xs text-muted-foreground mt-3">
            Review by {review.author.profile?.fullName || 'you'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
