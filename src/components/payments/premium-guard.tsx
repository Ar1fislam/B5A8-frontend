'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Crown, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PremiumGuardProps {
  children: ReactNode
  featureName?: string
}

export function PremiumGuard({ children, featureName = 'this feature' }: PremiumGuardProps) {
  const { user } = useAuth()
  const router = useRouter()
  // const isPremium = user?.isPremium
  const isPremium = user?.role === 'ADMIN' || user?.isPremium


  if (isPremium) {
    return <>{children}</>
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-not-allowed opacity-50">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle>Premium Feature</DialogTitle>
          <DialogDescription>
            {featureName} is only available for premium members. 
            Upgrade your account to unlock this and other exclusive features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Premium Benefits:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Verified Traveler Badge</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Unlimited Travel Plans</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Advanced Search Filters</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Priority Support</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push('/payments')}>
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}