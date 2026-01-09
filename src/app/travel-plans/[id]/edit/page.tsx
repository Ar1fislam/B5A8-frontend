// // frontend/app/travel-plans/[id]/edit/page.tsx

// frontend/app/travel-plans/[id]/edit/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import { useAuth } from '@/lib/auth-context'
import { travelPlanAPI, uploadAPI } from '@/lib/api'
import { toast } from 'sonner'

import {
  ArrowLeft,
  CalendarDays,
  Globe2,
  Wallet,
  Users,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Trash2,
  AlertTriangle,
  Image as ImageIcon,
  MapPin,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import type { TravelPlan } from '@/types'
import { ImageUpload } from '@/components/upload/image-upload'

// schema (unchanged)
const travelPlanSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.string().min(1, 'Budget is required'),
  travelType: z.enum(['SOLO', 'FAMILY', 'FRIENDS', 'COUPLE', 'BUSINESS']),
  description: z.string().optional(),
  isPublic: z.boolean(),
})

export type TravelPlanFormData = z.infer<typeof travelPlanSchema>

export default function EditTravelPlanPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const travelPlanId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)
  const [tripPhotos, setTripPhotos] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<TravelPlanFormData>({
    resolver: zodResolver(travelPlanSchema),
    defaultValues: {
      travelType: 'SOLO',
      isPublic: true,
    },
  })

  const isPublic = watch('isPublic')
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  useEffect(() => {
    if (travelPlanId && user) fetchTravelPlan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelPlanId, user])

  const fetchTravelPlan = async () => {
    setIsLoading(true)
    try {
      const result = await travelPlanAPI.getById(travelPlanId)
      const plan = result.data?.travelPlan

      if (!plan) {
        toast.error('Travel plan not found')
        router.push('/travel-plans')
        return
      }

      if (user && user?.id !== plan.userId && user?.role !== 'ADMIN') {
        toast.error('You do not have permission to edit this travel plan')
        router.push(`/travel-plans/${travelPlanId}`)
        return
      }

      setTravelPlan(plan)
      setTripPhotos(plan?.tripPhotos?.map((img) => img.url) || [])

      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      reset({
        destination: plan.destination,
        startDate: formatDateForInput(plan.startDate),
        endDate: formatDateForInput(plan.endDate),
        budget: plan.budget,
        travelType: plan.travelType,
        description: plan.description || '',
        isPublic: plan.isPublic,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load travel plan'
      toast.error(message)
      console.error('Fetch travel plan error:', error)
      router.push('/travel-plans')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUploadComplete = async () => {
    try {
      const result = await travelPlanAPI.getById(travelPlanId)
      const plan = result.data?.travelPlan
      setTripPhotos(plan?.tripPhotos?.map((img) => img.url) || [])
    } catch (error) {
      console.error('Image upload completion error:', error)
    }
  }

  const handleDeleteImage = async (imageUrl: string) => {
    const photos = tripPhotos.filter((url) => url !== imageUrl)
    setTripPhotos(photos)

    try {
      await uploadAPI.deleteImage(imageUrl)
      toast.success('Image deleted successfully')
    } catch (error) {
      toast.error('Failed to delete image')
      console.error('Delete image error:', error)
    }
  }

  const onSubmit = async (data: TravelPlanFormData) => {
    setIsSaving(true)
    try {
      await travelPlanAPI.update(travelPlanId, data)
      toast.success('Travel plan updated successfully!')
      router.push(`/travel-plans/${travelPlanId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update travel plan'
      toast.error(message)
      console.error('Update travel plan error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await travelPlanAPI.delete(travelPlanId)
      toast.success('Travel plan deleted successfully!')
      router.push('/travel-plans')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete travel plan'
      toast.error(message)
      console.error('Delete travel plan error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const travelTypes = [
    { value: 'SOLO', label: 'Solo travel', icon: '' },
    { value: 'FAMILY', label: 'Family trip', icon: '' },
    { value: 'FRIENDS', label: 'Friends trip', icon: '' },
  ] as const

  const budgetOptions = [
    'Budget ($500-1000)',
    'Moderate ($1000-2000)',
    'Luxury ($2000-5000)',
    'Flexible',
    'Not Specified',
  ]

  const createdAtText = useMemo(() => {
    if (!travelPlan?.createdAt) return '—'
    try {
      return new Date(travelPlan.createdAt).toLocaleDateString()
    } catch {
      return '—'
    }
  }, [travelPlan?.createdAt])

  const updatedAtText = useMemo(() => {
    if (!travelPlan?.updatedAt) return '—'
    try {
      const d = new Date(travelPlan.updatedAt)
      return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`
    } catch {
      return '—'
    }
  }, [travelPlan?.updatedAt])

  const invalidDateRange =
    startDate && endDate ? new Date(startDate) > new Date(endDate) : false

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
        <div className="container py-10">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading travel plan...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!travelPlan) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
        <div className="container py-10">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Travel Plan Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The travel plan you&apos;re trying to edit doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push('/travel-plans')} className="rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Travel Plans
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        {/* Top nav */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            className="w-fit gap-2 rounded-xl"
            onClick={() => router.push(`/travel-plans/${travelPlanId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isDirty ? 'default' : 'secondary'} className="rounded-full">
              {isDirty ? 'Unsaved changes' : 'Up to date'}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Created {createdAtText}
            </Badge>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-6 relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-7s]" />
          </div>

          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Edit travel plan
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                {travelPlan.destination}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Update dates, visibility, budget, and photos. Save when ready.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border bg-background/60 px-4 py-3">
              {isPublic ? (
                <>
                  <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div className="leading-tight">
                    <p className="text-xs text-muted-foreground">Visibility</p>
                    <p className="text-sm font-semibold">Public</p>
                  </div>
                </>
              ) : (
                <>
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                  <div className="leading-tight">
                    <p className="text-xs text-muted-foreground">Visibility</p>
                    <p className="text-sm font-semibold">Private</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Form card */}
        <Card className="mt-8 max-w-3xl mx-auto rounded-3xl border bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-muted-foreground" />
              Plan details
            </CardTitle>
            <CardDescription>Fields marked with * are required.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <div className="relative">
                  <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="e.g., Tokyo, Japan"
                    className="pl-10 rounded-2xl"
                    {...register('destination')}
                    disabled={isSaving}
                  />
                </div>
                {errors.destination && (
                  <p className="text-sm text-destructive">{errors.destination.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Add city + country for better matches.
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date *</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      className="pl-10 rounded-2xl"
                      {...register('startDate')}
                      disabled={isSaving}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-sm text-destructive">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End date *</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      className="pl-10 rounded-2xl"
                      {...register('endDate')}
                      disabled={isSaving}
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
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

              {/* Travel type + Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Travel type *</Label>
                  <Select
                    onValueChange={(value: TravelPlanFormData['travelType']) =>
                      setValue('travelType', value, { shouldDirty: true })
                    }
                    defaultValue={travelPlan.travelType}
                  >
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select travel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.travelType && (
                    <p className="text-sm text-destructive">{errors.travelType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Budget range *</Label>
                  <Select
                    onValueChange={(value) => setValue('budget', value, { shouldDirty: true })}
                    defaultValue={travelPlan.budget}
                  >
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select your budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            <span>{option}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.budget && (
                    <p className="text-sm text-destructive">{errors.budget.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Activities, schedule, preferences, and what kind of buddy you want..."
                  className="min-h-[120px] rounded-2xl"
                  {...register('description')}
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground">
                  More details usually means better matches.
                </p>
              </div>

              {/* Photos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label>Travel plan photos</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add a few images to make your plan more attractive.
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {tripPhotos.length} photo{tripPhotos.length === 1 ? '' : 's'}
                  </Badge>
                </div>

                {tripPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tripPhotos.map((url, index) => (
                      <div key={index} className="group relative">
                        <div className="overflow-hidden rounded-2xl border bg-background/40">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </div>

                        <button
                          onClick={() => handleDeleteImage(url)}
                          type="button"
                          className="absolute top-2 right-2 rounded-full border bg-background/80 p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Delete photo"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border bg-background/40 p-6 text-center">
                    <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-muted">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No photos yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a few images to improve visibility.
                    </p>
                  </div>
                )}

                <ImageUpload
                  multiple={true}
                  type="trip"
                  travelPlanId={travelPlanId}
                  onUploadComplete={handleImageUploadComplete}
                />
              </div>

              {/* Visibility */}
              <div className="rounded-2xl border bg-background/40 p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium flex items-center gap-2">
                    {isPublic ? (
                      <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    Visibility
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isPublic
                      ? 'Other travelers can see and request to join.'
                      : 'Only you can see this plan.'}
                  </p>
                </div>

                <Switch
                  checked={isPublic}
                  onCheckedChange={(checked) =>
                    setValue('isPublic', checked, { shouldDirty: true })
                  }
                  disabled={isSaving}
                />
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="rounded-2xl gap-2"
                      disabled={isSaving || isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Delete plan
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete travel plan
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this travel plan? This action cannot be
                        undone. All match requests and associated data will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => router.push(`/travel-plans/${travelPlanId}`)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="rounded-2xl gap-2"
                    disabled={isSaving || !isDirty}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save changes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {!isDirty && (
                <p className="text-center text-sm text-muted-foreground">
                  No changes made yet.
                </p>
              )}

              <div className="rounded-2xl border bg-background/40 p-4">
                <p className="text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    
                  </span>
                  <span className="text-xs">
                    Last updated: <span className="font-medium">{updatedAtText}</span>
                  </span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
// import { useAuth } from '@/lib/auth-context'
// import { travelPlanAPI, uploadAPI } from '@/lib/api'
// import { toast } from 'sonner'
// import {
//   Calendar,
//   MapPin,
//   DollarSign,
//   Globe,
//   ArrowLeft,
//   Save,
//   Trash2,
//   Loader2,
//   AlertCircle,
//   Trash,
// } from 'lucide-react'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog'
// import type { TravelPlan } from '@/types'
// import { ImageUpload } from '@/components/upload/image-upload'

// // Reuse the same schema from new page
// const travelPlanSchema = z.object({
//   destination: z.string().min(2, 'Destination is required'),
//   startDate: z.string().min(1, 'Start date is required'),
//   endDate: z.string().min(1, 'End date is required'),
//   budget: z.string().min(1, 'Budget is required'),
//   travelType: z.enum(['SOLO', 'FAMILY', 'FRIENDS', 'COUPLE', 'BUSINESS']),
//   description: z.string().optional(),
//   isPublic: z.boolean(),
// })

// export type TravelPlanFormData = z.infer<typeof travelPlanSchema>

// export default function EditTravelPlanPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { user } = useAuth()

//   const travelPlanId = params.id as string
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)
//   const [tripPhotos, setTripPhotos] = useState<string[]>([])

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors, isDirty },
//   } = useForm<TravelPlanFormData>({
//     resolver: zodResolver(travelPlanSchema),
//     defaultValues: {
//       travelType: 'SOLO',
//       isPublic: true,
//     },
//   })

//   const isPublic = watch('isPublic')
//   const startDate = watch('startDate')
//   const endDate = watch('endDate')

//   useEffect(() => {
//     if (travelPlanId && user) {
//       fetchTravelPlan()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [travelPlanId, user])

//   const fetchTravelPlan = async () => {
//     setIsLoading(true)
//     try {
//       const result = await travelPlanAPI.getById(travelPlanId)
//       const plan = result.data?.travelPlan

//       if (!plan) {
//         toast.error('Travel plan not found')
//         router.push('/travel-plans')
//         return
//       }

//       // Check if user owns this travel plan
//       if (user && user?.id !== plan.userId && user?.role !== 'ADMIN') {
//         toast.error('You do not have permission to edit this travel plan')
//         router.push(`/travel-plans/${travelPlanId}`)
//         return
//       }

//       setTravelPlan(plan)
//       setTripPhotos(plan?.tripPhotos?.map((img) => img.url) || [])

//       // Format dates for input fields (YYYY-MM-DD)
//       const formatDateForInput = (dateString: string) => {
//         const date = new Date(dateString)
//         return date.toISOString().split('T')[0]
//       }

//       // Reset form with fetched data
//       reset({
//         destination: plan.destination,
//         startDate: formatDateForInput(plan.startDate),
//         endDate: formatDateForInput(plan.endDate),
//         budget: plan.budget,
//         travelType: plan.travelType,
//         description: plan.description || '',
//         isPublic: plan.isPublic,
//       })
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : 'Failed to load travel plan'
//       toast.error(message)
//       console.error('Fetch travel plan error:', error)
//       router.push('/travel-plans')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleImageUploadComplete = async () => {
//     try {
//       const result = await travelPlanAPI.getById(travelPlanId)
//       const plan = result.data?.travelPlan
//       setTripPhotos(plan?.tripPhotos?.map((img) => img.url) || [])
//     } catch (error) {
//       console.error('Image upload completion error:', error)
//     }
//   }

//   const handleDeleteImage = async (imageUrl: string) => {
//     const photos = tripPhotos.filter((url) => url !== imageUrl)
//     setTripPhotos(photos)

//     try {
//       await uploadAPI.deleteImage(imageUrl)
//       toast.success('Image deleted successfully')
//     } catch (error) {
//       toast.error('Failed to delete image')
//       console.error('Delete image error:', error)
//     }
//   }

//   const onSubmit = async (data: TravelPlanFormData) => {
//     setIsSaving(true)
//     try {
//       await travelPlanAPI.update(travelPlanId, data)
//       toast.success('Travel plan updated successfully!')
//       router.push(`/travel-plans/${travelPlanId}`)
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : 'Failed to update travel plan'
//       toast.error(message)
//       console.error('Update travel plan error:', error)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const handleDelete = async () => {
//     setIsDeleting(true)
//     try {
//       await travelPlanAPI.delete(travelPlanId)
//       toast.success('Travel plan deleted successfully!')
//       router.push('/travel-plans')
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : 'Failed to delete travel plan'
//       toast.error(message)
//       console.error('Delete travel plan error:', error)
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   const travelTypes = [
//     { value: 'SOLO', label: 'Solo Travel', icon: '👤' },
//     { value: 'FAMILY', label: 'Family Trip', icon: '👨‍👩‍👧‍👦' },
//     { value: 'FRIENDS', label: 'Friends Trip', icon: '👥' },
//     { value: 'COUPLE', label: 'Couple Trip', icon: '💑' },
//     { value: 'BUSINESS', label: 'Business Trip', icon: '💼' },
//   ]

//   const budgetOptions = [
//     'Budget ($500-1000)',
//     'Moderate ($1000-2000)',
//     'Luxury ($2000-5000)',
//     'Flexible',
//     'Not Specified',
//   ]

//   if (isLoading) {
//     return (
//       <div className="container py-8">
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading travel plan...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!travelPlan) {
//     return (
//       <div className="container py-8">
//         <div className="text-center py-12">
//           <h2 className="text-2xl font-bold mb-4">Travel Plan Not Found</h2>
//           <p className="text-muted-foreground mb-6">
//             The travel plan you&apos;re trying to edit doesn&apos;t exist.
//           </p>
//           <Button onClick={() => router.push('/travel-plans')}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Travel Plans
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-8">
//       <Button
//         variant="ghost"
//         className="mb-6 gap-2"
//         onClick={() => router.push(`/travel-plans/${travelPlanId}`)}
//       >
//         <ArrowLeft className="h-4 w-4" />
//         Back to Travel Plan
//       </Button>

//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-2xl flex items-center gap-2">
//                 <MapPin className="h-6 w-6 text-primary" />
//                 Edit Travel Plan
//               </CardTitle>
//               <CardDescription>Update your travel plan details</CardDescription>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <span className="px-2 py-1 bg-muted rounded">
//                 Created {new Date(travelPlan.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Destination */}
//             <div className="space-y-2">
//               <Label htmlFor="destination">Destination *</Label>
//               <div className="relative">
//                 <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="destination"
//                   placeholder="e.g., Tokyo, Japan"
//                   className="pl-10"
//                   {...register('destination')}
//                   disabled={isSaving}
//                 />
//               </div>
//               {errors.destination && (
//                 <p className="text-sm text-destructive">
//                   {errors.destination.message}
//                 </p>
//               )}
//               <p className="text-xs text-muted-foreground">
//                 Be specific about city and country for better matches
//               </p>
//             </div>

//             {/* Dates */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="startDate">Start Date *</Label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="startDate"
//                     type="date"
//                     className="pl-10"
//                     {...register('startDate')}
//                     disabled={isSaving}
//                     min={new Date().toISOString().split('T')[0]}
//                   />
//                 </div>
//                 {errors.startDate && (
//                   <p className="text-sm text-destructive">
//                     {errors.startDate.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="endDate">End Date *</Label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="endDate"
//                     type="date"
//                     className="pl-10"
//                     {...register('endDate')}
//                     disabled={isSaving}
//                     min={startDate || new Date().toISOString().split('T')[0]}
//                   />
//                 </div>
//                 {errors.endDate && (
//                   <p className="text-sm text-destructive">
//                     {errors.endDate.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {startDate &&
//               endDate &&
//               new Date(startDate) > new Date(endDate) && (
//                 <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
//                   <p className="text-sm text-destructive">
//                     End date must be after start date
//                   </p>
//                 </div>
//               )}

//             {/* Travel Type */}
//             <div className="space-y-2">
//               <Label>Travel Type *</Label>
//               <Select
//                 onValueChange={(value: TravelPlanFormData['travelType']) =>
//                   setValue('travelType', value, { shouldDirty: true })
//                 }
//                 defaultValue={travelPlan.travelType}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select travel type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {travelTypes.map((type) => (
//                     <SelectItem key={type.value} value={type.value}>
//                       <div className="flex items-center gap-2">
//                         <span>{type.icon}</span>
//                         <span>{type.label}</span>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.travelType && (
//                 <p className="text-sm text-destructive">
//                   {errors.travelType.message}
//                 </p>
//               )}
//             </div>

//             {/* Budget */}
//             <div className="space-y-2">
//               <Label>Budget Range *</Label>
//               <Select
//                 onValueChange={(value) =>
//                   setValue('budget', value, { shouldDirty: true })
//                 }
//                 defaultValue={travelPlan.budget}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select your budget" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {budgetOptions.map((option) => (
//                     <SelectItem key={option} value={option}>
//                       <div className="flex items-center gap-2">
//                         <DollarSign className="h-4 w-4" />
//                         <span>{option}</span>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.budget && (
//                 <p className="text-sm text-destructive">
//                   {errors.budget.message}
//                 </p>
//               )}
//             </div>

//             {/* Description */}
//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Tell potential travel buddies about your plans, interests, and what you're looking for..."
//                 className="min-h-[120px]"
//                 {...register('description')}
//                 disabled={isSaving}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Include activities you&apos;re interested in, accommodation
//                 preferences, or any specific requirements
//               </p>
//             </div>

//             {/* Image Upload */}
//             <div className="space-y-2">
//               <Label>Travel Plan Photos</Label>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {tripPhotos.map((url, index) => (
//                   <div key={index} className="relative group">
//                     <Card className="overflow-hidden">
//                       <CardContent className="p-0">
//                         <img
//                           src={url}
//                           alt={`Preview ${index + 1}`}
//                           className="h-32 w-full object-cover"
//                         />
//                       </CardContent>
//                     </Card>
//                     <button
//                       onClick={() => handleDeleteImage(url)}
//                       type="button"
//                       className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Trash className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <ImageUpload
//                 multiple={true}
//                 type="trip"
//                 travelPlanId={travelPlanId}
//                 onUploadComplete={handleImageUploadComplete}
//               />
//             </div>

//             {/* Visibility */}
//             <div className="flex items-center justify-between p-4 border rounded-lg">
//               <div className="space-y-0.5">
//                 <Label className="text-base">Make this plan public</Label>
//                 <p className="text-sm text-muted-foreground">
//                   {isPublic
//                     ? 'Other travelers can see and request to join your plan'
//                     : 'Only you can see this plan'}
//                 </p>
//               </div>
//               <Switch
//                 checked={isPublic}
//                 onCheckedChange={(checked) =>
//                   setValue('isPublic', checked, { shouldDirty: true })
//                 }
//                 disabled={isSaving}
//               />
//             </div>

//             {/* Form Actions */}
//             <div className="flex gap-4 pt-4">
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     type="button"
//                     variant="destructive"
//                     className="flex-1 gap-2"
//                     disabled={isSaving || isDeleting}
//                   >
//                     {isDeleting ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Deleting...
//                       </>
//                     ) : (
//                       <>
//                         <Trash2 className="h-4 w-4" />
//                         Delete Plan
//                       </>
//                     )}
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle className="flex items-center gap-2">
//                       <AlertCircle className="h-5 w-5 text-destructive" />
//                       Delete Travel Plan
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       Are you sure you want to delete this travel plan? This
//                       action cannot be undone. All match requests and associated
//                       data will be permanently removed.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction
//                       onClick={handleDelete}
//                       className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                     >
//                       Delete Plan
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1 bg-transparent"
//                 onClick={() => router.push(`/travel-plans/${travelPlanId}`)}
//                 disabled={isSaving}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="submit"
//                 className="flex-1 gap-2"
//                 disabled={isSaving || !isDirty}
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4" />
//                     Save Changes
//                   </>
//                 )}
//               </Button>
//             </div>

//             {!isDirty && (
//               <div className="text-center text-sm text-muted-foreground pt-4">
//                 <p>No changes made yet</p>
//               </div>
//             )}

//             <div className="text-center text-sm text-muted-foreground pt-4 border-t">
//               <p className="flex items-center justify-center gap-2">
//                 <span>Last updated:</span>
//                 <span className="font-medium">
//                   {new Date(travelPlan.updatedAt).toLocaleDateString()} at{' '}
//                   {new Date(travelPlan.updatedAt).toLocaleTimeString()}
//                 </span>
//               </p>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
