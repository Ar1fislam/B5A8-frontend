// frontend/components/reviews/star-rating.tsx
'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showNumber?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
  value?: number
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  className,
  showNumber = false,
  interactive = false,
  onChange,
  value = 0,
}: StarRatingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const handleClick = (starValue: number) => {
    if (interactive && onChange) {
      onChange(starValue)
    }
  }

  const displayRating = interactive ? value : rating

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1
          const filled = starValue <= displayRating
          
          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              onClick={interactive ? () => handleClick(starValue) : undefined}
              className={cn(
                'focus:outline-none transition-colors',
                interactive && 'hover:scale-110'
              )}
              disabled={!interactive}
              aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  sizes[size],
                  filled
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300 dark:text-gray-600',
                  interactive && 'cursor-pointer'
                )}
              />
            </button>
          )
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-medium ml-2">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}