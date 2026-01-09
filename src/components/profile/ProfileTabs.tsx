// frontend/components/profile/ProfileTabs.tsx
'use client'

import { TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  travelPlansCount: number
  reviewsCount: number
}

export function ProfileTabs({
  activeTab,
  onTabChange,
  travelPlansCount = 0,
  reviewsCount = 0,
}: ProfileTabsProps) {
  return (
    <TabsList className="grid grid-cols-3 w-full max-w-md">
      <TabsTrigger value="about" onClick={() => onTabChange('about')}>
        About
      </TabsTrigger>
      <TabsTrigger value="plans" onClick={() => onTabChange('plans')}>
        Travel Plans ({travelPlansCount})
      </TabsTrigger>
      <TabsTrigger value="reviews" onClick={() => onTabChange('reviews')}>
        Reviews ({reviewsCount})
      </TabsTrigger>
    </TabsList>
  )
}