'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import { travelPlanAPI } from '@/lib/api'
import type { CreateTravelPlanInput } from '@/types'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

import {
  ArrowLeft,
  Plane,
  Route,
  CalendarRange,
  Wallet,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Loader2,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react'

const travelPlanSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.string().min(1, 'Budget is required'),
  travelType: z.enum(['SOLO', 'FAMILY', 'FRIENDS'] as const),
  description: z.string().optional(),
  isPublic: z.boolean(),
})

type TravelPlanFormData = z.infer<typeof travelPlanSchema>

export default function NewTravelPlanPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState<'basics' | 'schedule' | 'share'>('basics')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<TravelPlanFormData>({
    resolver: zodResolver(travelPlanSchema),
    defaultValues: {
      destination: '',
      startDate: '',
      endDate: '',
      budget: '',
      travelType: 'SOLO',
      description: '',
      isPublic: true,
    },
  })

  const destination = watch('destination')
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const isPublic = watch('isPublic')
  const budget = watch('budget')
  const travelType = watch('travelType')
  const description = watch('description')

  const invalidDateRange = useMemo(() => {
    if (!startDate || !endDate) return false
    return new Date(startDate) > new Date(endDate)
  }, [startDate, endDate])

  const travelTypes = [
    { value: 'SOLO', label: 'Solo' },
    { value: 'FAMILY', label: 'Family' },
    { value: 'FRIENDS', label: 'Friends' },
  ] as const

  const budgetOptions = [
    'Budget ($500-1000)',
    'Moderate ($1000-2000)',
    'Luxury ($2000-5000)',
    'Flexible',
  ]

  const preview = useMemo(() => {
    const safeDestination = destination?.trim() ? destination.trim() : 'Your destination'
    const safeBudget = budget?.trim() ? budget : 'Budget not set'
    const safeDates =
      startDate && endDate
        ? `${startDate} → ${endDate}`
        : startDate
          ? `${startDate} → (pick end date)`
          : 'Pick dates'

    const safeType = travelTypes.find((t) => t.value === travelType)?.label ?? 'Solo'

    return {
      title: safeDestination,
      dates: safeDates,
      type: safeType,
      budget: safeBudget,
      description: description?.trim() ? description.trim() : 'Add a short note to attract better matches.',
      visibility: isPublic ? 'Public' : 'Private',
    }
  }, [destination, startDate, endDate, travelType, budget, description, isPublic])

  const onSubmit = async (data: TravelPlanFormData): Promise<void> => {
    setIsLoading(true)

    const allowed = user?.role === 'ADMIN' || user?.isPremium === true
    if (!allowed) {
      toast.error('You need a premium subscription to create travel plans')
      setIsLoading(false)
      router.push('/payments')
      return
    }

    try {
      const response = await travelPlanAPI.create(data as CreateTravelPlanInput)
      toast.success('Travel plan created successfully!')

      const travelPlanId = (response as unknown as { data: { travelPlan: { id: string } } }).data
        .travelPlan.id

      router.push(`/travel-plans/${travelPlanId}`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create travel plan'
      toast.error(message)
      console.error('Create travel plan error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,theme(colors.primary/12),transparent_55%),radial-gradient(ellipse_at_bottom,theme(colors.accent/14),transparent_55%)]">
      <div className="container py-10">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" className="w-fit gap-2 rounded-2xl" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              New plan builder
            </Badge>
            <Badge variant={isPublic ? 'default' : 'outline'} className="rounded-full">
              {isPublic ? (
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  Public
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <EyeOff className="h-3.5 w-3.5" />
                  Private
                </span>
              )}
            </Badge>
          </div>
        </div>

        {/* Main split */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: steps */}
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-muted-foreground" />
                  Build your trip
                </CardTitle>
                <CardDescription>
                  Fill the steps below—your preview updates instantly.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs
                    value={activeStep}
                    onValueChange={(v) => setActiveStep(v as typeof activeStep)}
                  >
                    <TabsList className="grid grid-cols-3 w-full rounded-2xl">
                      <TabsTrigger value="basics" className="rounded-xl gap-2">
                        <Plane className="h-4 w-4" />
                        Basics
                      </TabsTrigger>
                      <TabsTrigger value="schedule" className="rounded-xl gap-2">
                        <CalendarRange className="h-4 w-4" />
                        Schedule
                      </TabsTrigger>
                      <TabsTrigger value="share" className="rounded-xl gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Share
                      </TabsTrigger>
                    </TabsList>

                    {/* BASICS */}
                    <TabsContent value="basics" className="mt-6 space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination *</Label>
                        <Input
                          id="destination"
                          placeholder="City, Country (e.g., Kyoto, Japan)"
                          className="rounded-2xl"
                          {...register('destination')}
                          disabled={isLoading}
                        />
                        {errors.destination && (
                          <p className="text-sm text-destructive">{errors.destination.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Travel type *</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {travelTypes.map((t) => {
                            const selected = travelType === t.value
                            return (
                              <button
                                key={t.value}
                                type="button"
                                disabled={isLoading}
                                onClick={() =>
                                  setValue('travelType', t.value, {
                                    shouldDirty: true,
                                    shouldValidate: isSubmitted,
                                  })
                                }
                                className={[
                                  'rounded-2xl border px-4 py-3 text-left transition',
                                  selected
                                    ? 'border-primary bg-primary/10'
                                    : 'bg-background/50 hover:bg-accent/20',
                                ].join(' ')}
                              >
                                <p className="font-medium">{t.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {t.value === 'SOLO' && 'Meet new people safely.'}
                                  {t.value === 'FAMILY' && 'Kid-friendly & relaxed.'}
                                  {t.value === 'FRIENDS' && 'Group vibes & activities.'}
                                </p>
                              </button>
                            )
                          })}
                        </div>
                        {errors.travelType && (
                          <p className="text-sm text-destructive">{errors.travelType.message}</p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          className="rounded-2xl"
                          onClick={() => setActiveStep('schedule')}
                          disabled={isLoading}
                        >
                          Continue
                        </Button>
                      </div>
                    </TabsContent>

                    {/* SCHEDULE */}
                    <TabsContent value="schedule" className="mt-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            className="rounded-2xl"
                            {...register('startDate')}
                            disabled={isLoading}
                            min={new Date().toISOString().split('T')[0]}
                          />
                          {errors.startDate && (
                            <p className="text-sm text-destructive">{errors.startDate.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endDate">End date *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            className="rounded-2xl"
                            {...register('endDate')}
                            disabled={isLoading}
                            min={startDate || new Date().toISOString().split('T')[0]}
                          />
                          {errors.endDate && (
                            <p className="text-sm text-destructive">{errors.endDate.message}</p>
                          )}
                        </div>
                      </div>

                      {invalidDateRange && (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
                          <p className="text-sm text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            End date must be after start date.
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Budget *</Label>
                        <Select
                          value={budget}
                          onValueChange={(v) =>
                            setValue('budget', v, { shouldDirty: true, shouldValidate: isSubmitted })
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="rounded-2xl">
                            <SelectValue placeholder="Choose budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetOptions.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                <div className="flex items-center gap-2">
                                  <Wallet className="h-4 w-4" />
                                  <span>{opt}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.budget && (
                          <p className="text-sm text-destructive">{errors.budget.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          className="min-h-[120px] rounded-2xl"
                          placeholder="What’s the vibe? Activities? Pace? What kind of travel buddy fits?"
                          {...register('description')}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() => setActiveStep('basics')}
                          disabled={isLoading}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          className="rounded-2xl"
                          onClick={() => setActiveStep('share')}
                          disabled={isLoading}
                        >
                          Continue
                        </Button>
                      </div>
                    </TabsContent>

                    {/* SHARE */}
                    <TabsContent value="share" className="mt-6 space-y-5">
                      <div className="rounded-3xl border bg-background/50 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-semibold">Visibility</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {isPublic
                                ? 'Public plans appear in Explore and can receive requests.'
                                : 'Private plans are only visible to you.'}
                            </p>
                          </div>
                          <Switch
                            checked={isPublic}
                            onCheckedChange={(checked) =>
                              setValue('isPublic', checked, {
                                shouldDirty: true,
                                shouldValidate: isSubmitted,
                              })
                            }
                            disabled={isLoading}
                          />
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-wrap gap-2">
                          <Badge className="rounded-full" variant="secondary">
                            Tip: Add 1–2 activities in the description.
                          </Badge>
                          <Badge className="rounded-full" variant="secondary">
                            Tip: Clear dates = faster matches.
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() => router.back()}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>

                        <Button type="submit" className="rounded-2xl gap-2" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <PlusCircle className="h-4 w-4" />
                              Create plan
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: live preview */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="rounded-3xl border bg-card/70 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-base">Live preview</CardTitle>
                  <CardDescription>How your plan will look to others.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="rounded-3xl border bg-background/50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-semibold truncate">{preview.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{preview.dates}</p>
                      </div>
                      <Badge className="rounded-full" variant="secondary">
                        {preview.type}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-full">
                        <Wallet className="h-3.5 w-3.5 mr-1" />
                        {preview.budget}
                      </Badge>
                      <Badge variant={isPublic ? 'default' : 'outline'} className="rounded-full">
                        {isPublic ? (
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <EyeOff className="h-3.5 w-3.5" />
                            Private
                          </span>
                        )}
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                      {preview.description}
                    </p>

                    {invalidDateRange && (
                      <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3">
                        <p className="text-xs text-destructive flex items-center gap-2">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Fix your dates to continue.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border bg-background/50 p-5">
                    <p className="text-sm font-semibold">Premium requirement</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Creating travel plans is available for Premium users or Admins.
                    </p>
                    <Button
      
                      type="button"
                      variant="outline"
                      className="mt-3 w-full rounded-2xl bg-green-500 relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400"

                      onClick={() => router.push('/payments')}
                    >
                      Go to subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile “sticky” action (optional feel) */}
              <div className="lg:hidden rounded-3xl border bg-card/80 backdrop-blur p-4">
                <Button
                  className="w-full rounded-2xl gap-2"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Create plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



