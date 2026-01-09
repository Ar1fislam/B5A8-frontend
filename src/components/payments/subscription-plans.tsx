
'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { paymentAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Check, Star, Crown, Sparkles } from 'lucide-react'

const monthlySubs = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
const yearlySubs = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY

const plans = [
  {
    id: 'free',
    name: 'Explorer',
    price: '$0',
    period: 'forever',
    description: 'Browse and plan at your own pace.',
    icon: Star,
    tone: 'muted' as const,
    features: ['Explore travel plans', 'Basic search filters', 'Community support'],
    buttonText: 'Current plan',
    buttonVariant: 'outline' as const,
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    description: 'Unlimited matching for active travelers.',
    icon: Sparkles,
    tone: 'primary' as const,
    features: [
      'Unlimited travel plans',
      'Unlimited connections',
      'Advanced filters',
      'Verified badge',
    ],
    buttonText: 'Go Premium',
    buttonVariant: 'default' as const,
    highlight: true,
    tag: 'Most chosen',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$99.99',
    period: 'year',
    description: 'Best value if you travel often.',
    icon: Crown,
    tone: 'accent' as const,
    features: [
      'Everything in Premium',
      'Lower cost vs monthly',
      'Annual travel summary',
      'Priority support',
      'Early feature access',
    ],
    buttonText: 'Choose Yearly',
    buttonVariant: 'default' as const,
    highlight: false,
    tag: 'Best value',
  },
]

interface SubscriptionPlansProps {
  currentPlan?: string
}

export function SubscriptionPlans({ currentPlan = 'free' }: SubscriptionPlansProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return

    const priceId = planId === 'premium' ? monthlySubs : yearlySubs
    if (!priceId) {
      toast.error('Missing Stripe Price ID (env not set)')
      return
    }

    setIsLoading(planId)
    try {
      const result = await paymentAPI.createSubscription(priceId)
      if (result.data?.url) window.location.href = result.data.url
      else toast.error('No checkout URL returned')
    } catch (error) {
      toast.error('Failed to initiate subscription')
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => {
        const Icon = plan.icon
        const isCurrent = plan.id === currentPlan
        const isBusy = isLoading === plan.id

        return (
          <Card
            key={plan.id}
            className={[
              'relative overflow-hidden rounded-3xl border bg-card/60 backdrop-blur transition',
              'hover:shadow-lg hover:-translate-y-0.5',
              plan.highlight ? 'border-primary/40 shadow-md' : '',
            ].join(' ')}
          >
            {/* soft glow */}
            {plan.highlight && (
              <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
            )}

            {/* top tags */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {plan.tag && (
                <Badge className="rounded-full" variant={plan.highlight ? 'default' : 'secondary'}>
                  {plan.tag}
                </Badge>
              )}
              {isCurrent && (
                <Badge variant="outline" className="rounded-full bg-green-50 text-green-700 border-green-200">
                  Current
                </Badge>
              )}
            </div>

            <CardHeader className="pt-8">
              <div className="flex items-start gap-3">
                <div
                  className={[
                    'h-11 w-11 rounded-2xl border flex items-center justify-center',
                    plan.tone === 'primary' ? 'bg-primary/10 border-primary/20 text-primary' : '',
                    plan.tone === 'accent' ? 'bg-amber-500/10 border-amber-500/20 text-amber-700' : '',
                    plan.tone === 'muted' ? 'bg-muted border-border text-muted-foreground' : '',
                  ].join(' ')}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </div>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-semibold">{plan.price}</span>
                <span className="pb-1 text-sm text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-2 pb-7">
              <Button
                className="w-full rounded-2xl gap-2"
                variant={isCurrent ? 'outline' : plan.buttonVariant}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent || isBusy}
              >
                {isBusy ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Processing…
                  </>
                ) : (
                  plan.buttonText
                )}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}







// 'use client'

// import { useState } from 'react'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { paymentAPI } from '@/lib/api'
// import { toast } from 'sonner'
// import { Check, Star, Crown, Zap } from 'lucide-react'

// const monthlySubs = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
// const yearlySubs  = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY



// const plans = [
//   {
//     id: 'free',
//     name: 'Free',
//     price: '$0',
//     period: 'forever',
//     description: 'Basic features for casual travelers',
//     features: [
//       // 'Create up to 3 travel plans',
//       // 'Connect with 10 travelers per month',
//       'Explore travel plans',
//       'Basic search filters',
//       // 'Profile verification',
//       'Community support',
//     ],
//     buttonText: 'Current Plan',
//     buttonVariant: 'outline' as const,
//     popular: false,
//   },
//   {
//     id: 'premium',
//     name: 'Premium',
//     price: '$9.99',
//     period: 'month',
//     description: 'Perfect for frequent travelers',
//     features: [
//       'Unlimited travel plans',
//       'Unlimited connections',
//       'Advanced search filters',
//       'Verified badge',
//       'Priority support',
//       'Early access to new features',
//       'Travel insights & analytics',
//     ],
//     buttonText: 'Upgrade to Premium',
//     buttonVariant: 'default' as const,
//     popular: true,
//   },
//   {
//     id: 'yearly',
//     name: 'Yearly',
//     price: '$99.99',
//     period: 'year',
//     description: 'Best value for serious travelers',
//     features: [
//       'Everything in Premium',
//       'Save 16% vs monthly',
//       'Annual travel report',
//       'Exclusive travel guides',
//       'Dedicated account manager',
//       'Offline trip planning',
//     ],
//     buttonText: 'Choose Yearly',
//     buttonVariant: 'default' as const,
//     popular: false,
//   },
// ]

// interface SubscriptionPlansProps {
//   currentPlan?: string
// }

// export function SubscriptionPlans({
//   currentPlan = 'free',
// }: SubscriptionPlansProps) {
//   const [isLoading, setIsLoading] = useState<string | null>(null)

//   console.log('current plan', currentPlan)

//   const handleSubscribe = async (planId: string) => {
//     // Plan ID can be premium or yearly

//     if (planId === 'free') return

//      const priceId =
//     planId === 'premium' ? monthlySubs : yearlySubs

//   if (!priceId) {
//     toast.error('Missing Stripe Price ID (env not set)')
//     return
//   }

//     setIsLoading(planId)
//     try {      
    

//        const result = await paymentAPI.createSubscription(priceId)
//      if (result.data?.url) window.location.href = result.data.url
//       }
//     catch (error) {
//       toast.error('Failed to initiate subscription')
//       console.error('Subscription error:', error)
//     } finally {
//       setIsLoading(null)
//     }
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//       {plans.map((plan) => (
//         <Card
//           key={plan.id}
//           className={`relative ${
//             plan.popular ? 'border-primary shadow-lg' : ''
//           }`}
//         >
//           {plan.popular && (
//             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//               <Badge className="bg-primary text-white px-3 py-1">
//                 <Crown className="h-3 w-3 mr-1" />
//                 Most Popular
//               </Badge>
//             </div>
//           )}

//           <CardHeader>
//             <div className="flex items-center justify-between mb-2">
//               <CardTitle className="text-2xl">{plan.name}</CardTitle>
//               {plan.id === currentPlan && (
//                 <Badge variant="outline" className="bg-green-50 text-green-700">
//                   Current
//                 </Badge>
//               )}
//             </div>
//             <div className="flex items-baseline gap-1">
//               <span className="text-4xl font-bold">{plan.price}</span>
//               <span className="text-muted-foreground">/{plan.period}</span>
//             </div>
//             <CardDescription>{plan.description}</CardDescription>
//           </CardHeader>

//           <CardContent>
//             <ul className="space-y-3">
//               {plan.features.map((feature, index) => (
//                 <li key={index} className="flex items-start gap-3">
//                   <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
//                   <span className="text-sm">{feature}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>

//           <CardFooter>
//             <Button
//               className="w-full gap-2"
//               variant={plan.id === currentPlan ? 'outline' : plan.buttonVariant}
//               onClick={() => handleSubscribe(plan.id)}
//               disabled={plan.id === currentPlan || isLoading === plan.id}
//             >
//               {isLoading === plan.id ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   {plan.popular && <Zap className="h-4 w-4" />}
//                   {plan.id === currentPlan ? plan.buttonText : plan.buttonText}
//                 </>
//               )}
//             </Button>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   )
// }
