// frontend/components/reviews/review-sorting.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Star, Calendar, TrendingUp } from 'lucide-react'

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'relevant'

interface ReviewSortingProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export function ReviewSorting({ sortBy, onSortChange }: ReviewSortingProps) {
  const sortOptions = [
    {
      value: 'newest' as SortOption,
      label: 'Newest First',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      value: 'oldest' as SortOption,
      label: 'Oldest First',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      value: 'highest' as SortOption,
      label: 'Highest Rated',
      icon: <Star className="h-4 w-4" />
    },
    {
      value: 'lowest' as SortOption,
      label: 'Lowest Rated',
      icon: <Star className="h-4 w-4" />
    },
    {
      value: 'relevant' as SortOption,
      label: 'Most Relevant',
      icon: <TrendingUp className="h-4 w-4" />
    }
  ]

  const currentSort = sortOptions.find(option => option.value === sortBy) || sortOptions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {currentSort.icon}
          Sort by: {currentSort.label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className="gap-2"
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}