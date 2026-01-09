// frontend/components/profile/ProfileAboutTab.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Calendar, Globe, Users, MapPin, Sparkles } from 'lucide-react'
import type { ProfileUser } from '@/types'

interface ProfileAboutTabProps {
  profileUser: ProfileUser
  isOwnProfile: boolean
}

export function ProfileAboutTab({ profileUser, isOwnProfile }: ProfileAboutTabProps) {
  const countries = profileUser.profile?.visitedCountries || []
  const plans = profileUser.travelPlans || []

  return (
    <div className="space-y-6">
      {/* Two cards side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries */}
        <Card className="rounded-3xl overflow-hidden border bg-card/60 backdrop-blur">
          <CardHeader className="bg-linear-to-r from-primary/10 via-background to-secondary/10">
            <CardTitle className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-muted flex items-center justify-center">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              Countries visited
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-5">
            {countries.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {countries.map((country, idx) => (
                    <Badge
                      key={`${country}-${idx}`}
                      variant="outline"
                      className="rounded-full px-3 py-1 text-sm"
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  {countries.length} place{countries.length === 1 ? '' : 's'} explored.
                </p>
              </>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-4">
                <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No countries added yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add visited countries to make your profile more credible.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick snapshot (small, unique) */}
        <Card className="rounded-3xl overflow-hidden border bg-card/60 backdrop-blur">
          <CardHeader className="bg-linear-to-r from-secondary/10 via-background to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-muted flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
              Travel snapshot
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">Countries</p>
                <p className="text-2xl font-semibold">{countries.length}</p>
              </div>
              <div className="rounded-2xl border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">Plans</p>
                <p className="text-2xl font-semibold">{plans.length}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Keep your trips and interests updated to get better matches.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plans */}
      {plans.length > 0 && (
        <Card className="rounded-3xl overflow-hidden border bg-card/60 backdrop-blur">
          <CardHeader className="bg-linear-to-r from-primary/10 via-background to-secondary/10">
            <CardTitle className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-muted flex items-center justify-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              Upcoming travel plans
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.slice(0, 3).map((plan) => (
                <div
                  key={plan.id}
                  className="group rounded-3xl border bg-background/40 p-4 transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{plan.destination}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                        </span>
                      </div>
                    </div>

                    <Badge className="rounded-full" variant="secondary">
                      {plan.travelType}
                    </Badge>
                  </div>

                  {plan.description && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {plan.description}
                    </p>
                  )}

                  {!isOwnProfile && (
                    <Button size="sm" className="mt-4 rounded-2xl gap-2">
                      <Users className="h-4 w-4" />
                      Request to join
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
