// frontend/app/travel-plans/[id]/components/TravelPlanStats.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, Users, Clock, CheckCircle2 } from 'lucide-react'
import { calculateDaysBetween } from '@/lib/utils'

interface TravelPlanStatsProps {
  startDate: string | Date
  endDate: string | Date
  budget: string
  matchesCount: number
  isUpcoming: boolean
}

function StatTile({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: React.ReactNode
  icon: React.ReactNode
  tone: 'blue' | 'green' | 'purple' | 'amber'
}) {
  const toneClasses: Record<typeof tone, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  }

  return (
    <Card className="rounded-3xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-semibold leading-none">{value}</p>
            </div>
          </div>

          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${toneClasses[tone]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TravelPlanStats({
  startDate,
  endDate,
  budget,
  matchesCount,
  isUpcoming,
}: TravelPlanStatsProps) {
  const daysBetween = calculateDaysBetween(new Date(startDate), new Date(endDate))

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatTile
        label="Duration"
        value={`${daysBetween} days`}
        icon={<Calendar className="h-5 w-5" />}
        tone="blue"
      />

      <StatTile
        label="Budget"
        value={budget}
        icon={<DollarSign className="h-5 w-5" />}
        tone="green"
      />

      <StatTile
        label="Matches"
        value={matchesCount}
        icon={<Users className="h-5 w-5" />}
        tone="purple"
      />

      <Card className="rounded-3xl">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Status</p>
              <div className="mt-2">
                <Badge className="rounded-full" variant={isUpcoming ? 'default' : 'secondary'}>
                  {isUpcoming ? 'Active' : 'Completed'}
                </Badge>
              </div>
            </div>

            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              {isUpcoming ? (
                <Clock className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
