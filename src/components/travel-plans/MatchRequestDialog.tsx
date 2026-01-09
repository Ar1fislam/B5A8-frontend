// frontend/app/travel-plans/[id]/components/MatchRequestDialog.tsx
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
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

import { useAuth } from '@/lib/auth-context'
import { matchAPI } from '@/lib/api'
import { toast } from 'sonner'

import { Calendar, CheckCircle2, MapPin, Send, Sparkles, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { TravelPlan } from '@/types'

interface MatchRequestDialogProps {
  travelPlan: TravelPlan
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function MatchRequestDialog({
  travelPlan,
  isOpen,
  onOpenChange,
  onSuccess,
}: MatchRequestDialogProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const hostName = travelPlan.user?.profile?.fullName || 'this traveler'

  const defaultMessage = useMemo(() => {
    return `Hi ${hostName}! I'm interested in joining your trip to ${travelPlan.destination} from ${formatDate(
      travelPlan.startDate
    )} to ${formatDate(travelPlan.endDate)}. Looking forward to connecting!`
  }, [hostName, travelPlan.destination, travelPlan.startDate, travelPlan.endDate])

  const suggestions = useMemo(
    () => [
      `Hi ${hostName}! I'm interested in joining. What’s your travel style (budget/pace)?`,
      `Hey ${hostName}! I can match your dates—are you open to a quick chat before the trip?`,
      `Hi ${hostName}! I’ve traveled to similar places before and would love to join.`,
    ],
    [hostName]
  )

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to send match requests')
      return
    }

    if (!travelPlan.user?.id) {
      toast.error('Travel plan user ID is missing')
      return
    }

    const finalMessage = message.trim() || defaultMessage

    setIsLoading(true)
    try {
      await matchAPI.create({
        receiverId: travelPlan.user.id,
        travelPlanId: travelPlan.id,
        message: finalMessage,
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
      <DialogContent className="sm:max-w-lg rounded-3xl overflow-hidden border bg-background/80 backdrop-blur">
        {/* Header */}
        <DialogHeader className="pb-0">
          <div className="relative rounded-3xl border bg-linear-to-r from-primary/10 via-background to-secondary/10 p-5">
            <div className="pointer-events-none absolute -top-16 -right-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <DialogTitle className="flex items-center gap-2 relative">
              <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              Request to join
            </DialogTitle>
            <DialogDescription className="relative mt-1">
              Send a short message to <span className="font-medium">{hostName}</span>.
            </DialogDescription>

            {/* Trip summary pill */}
            <div className="relative mt-4 rounded-3xl border bg-background/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="font-semibold truncate">{travelPlan.destination}</p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(travelPlan.startDate)} – {formatDate(travelPlan.endDate)}
                    </span>
                    <Badge variant="secondary" className="rounded-full">
                      {travelPlan.travelType}
                    </Badge>
                  </div>
                </div>

                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-4 px-1">
          {/* Quick suggestions */}
          <div className="rounded-3xl border bg-card/50 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm font-medium">Quick message</p>
              <span className="text-xs text-muted-foreground">Tap to use</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setMessage(s)}
                  disabled={isLoading}
                >
                  {s.length > 46 ? `${s.slice(0, 46)}…` : s}
                </Button>
              ))}
            </div>
          </div>

          {/* Message input */}
          <div className="rounded-3xl border bg-card/50 p-4 space-y-2">
            <Label htmlFor="message" className="text-sm">
              Your message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={defaultMessage}
              className="min-h-[120px] rounded-2xl"
              disabled={isLoading}
            />
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
              <p>
                Mention your travel style and confirm you’re flexible with plans. Keep it friendly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="sm:justify-between gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-2xl"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !user}
            className="gap-2 rounded-2xl"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
