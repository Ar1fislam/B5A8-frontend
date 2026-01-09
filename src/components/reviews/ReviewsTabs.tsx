// frontend/components/reviews/ReviewsTabs.tsx
'use client'

import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Star } from 'lucide-react'

interface ReviewsTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  receivedCount: number
  givenCount: number
}

export function ReviewsTabs({
  activeTab,
  onTabChange,
  receivedCount,
  givenCount,
}: ReviewsTabsProps) {
  return (
    <TabsList className="grid grid-cols-2 mb-8">
      <TabsTrigger 
        value="received" 
        onClick={() => onTabChange('received')}
        className="gap-2"
      >
        <User className="h-4 w-4" />
        Received ({receivedCount})
      </TabsTrigger>
      <TabsTrigger 
        value="given" 
        onClick={() => onTabChange('given')}
        className="gap-2"
      >
        <Star className="h-4 w-4" />
        Given ({givenCount})
      </TabsTrigger>
    </TabsList>
  )
}