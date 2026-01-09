'use client'

import { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { matchAPI } from '@/lib/api'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { formatDate } from '@/lib/utils'

import type { TravelPlan } from '@/types'
import {
  MapPin,
  CalendarDays,
  Sparkles,
  SendHorizonal,
  ShieldCheck,
  Lightbulb,
  Quote,
} from 'lucide-react'

interface MatchRequestDialogProps {
  travelPlan: TravelPlan
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function MatchRequestDialog({
  travelPlan,
  isOpen,
  onOpenChange,
  onSuccess,
}: MatchRequestDialogProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const defaultMessage = useMemo(() => {
    return `Hi ${travelPlan.user?.profile?.fullName || 'there'}! I'm interested in joining your trip to ${
      travelPlan.destination
    } from ${formatDate(travelPlan.startDate)} to ${formatDate(
      travelPlan.endDate
    )}. Looking forward to connecting!`
  }, [travelPlan])

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to send match requests')
      return
    }
    if (!travelPlan.user?.id) {
      toast.error('Travel user ID in travel plan is missing')
      return
    }

    setIsLoading(true)
    try {
      await matchAPI.create({
        receiverId: travelPlan.user.id,
        travelPlanId: travelPlan.id,
        message: (message || defaultMessage).trim(),
      })
      toast.success('Match request sent successfully!')
      onSuccess()
      onOpenChange(false)
      setMessage('')
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error('Failed to send match request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-3xl border bg-background p-0 shadow-lg">
        {/* Decorative header */}
        <div className="relative border-b bg-linear-to-r from-primary/10 via-background to-accent/15 px-6 py-5">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl animate-app-float" />
            <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl animate-app-float [animation-delay:-5s]" />
          </div>

          <DialogHeader className="relative">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full bg-background/60">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Request
              </Badge>
              <Badge className="rounded-full" variant="secondary">
                {travelPlan.travelType}
              </Badge>
            </div>

            <DialogTitle className="mt-3 text-xl font-semibold tracking-tight">
              Send a match request
            </DialogTitle>

            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              To {travelPlan.user?.profile?.fullName || 'this traveler'} for the trip to{' '}
              <span className="text-foreground font-medium">{travelPlan.destination}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-4 grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-2xl border bg-background/60 px-3 py-2 text-sm">
              <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="truncate">{travelPlan.destination}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border bg-background/60 px-3 py-2 text-sm">
              <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="truncate">
                {formatDate(travelPlan.startDate)} → {formatDate(travelPlan.endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setMessage(defaultMessage)}
              disabled={isLoading}
            >
              <Quote className="mr-2 h-4 w-4" />
              Use a friendly template
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() =>
                setMessage(
                  `Hi ${travelPlan.user?.profile?.fullName || 'there'}! I’d love to join your trip to ${
                    travelPlan.destination
                  }. I’m flexible and easy-going—want to chat before we commit?`
                )
              }
              disabled={isLoading}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Short & confident
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Your message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px] rounded-2xl"
              disabled={isLoading}
              placeholder="Introduce yourself, mention shared interests, and suggest a quick chat."
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Tip: Mention travel style + budget comfort + communication preference.</span>
              <span>{(message || defaultMessage).trim().length} chars</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Good request checklist
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Be respectful and clear.</li>
              <li>Suggest a time to chat.</li>
              <li>Share what you can contribute (planning, photos, hiking, etc.).</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="border-t bg-muted/20 px-6 py-4">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button className="rounded-xl" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-background border-b-transparent" />
                Sending…
              </>
            ) : (
              <>
                <SendHorizonal className="mr-2 h-4 w-4" />
                Send request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
