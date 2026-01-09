// "use client"

// import { useEffect, useState } from "react"
// import { useSearchParams, useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { CheckCircle, Home, UserCheck, CreditCard } from "lucide-react"
// import { paymentAPI } from "@/lib/api"
// import { toast } from "sonner"
// import Link from "next/link"

// export default function PaymentSuccessContent() {
//   const [isLoading, setIsLoading] = useState(true)
//   const [paymentType, setPaymentType] = useState<"subscription" | "badge" | "unknown">("unknown")
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const sessionId = searchParams.get("session_id")

//   useEffect(() => {
//     if (!sessionId) {
//       router.push("/")
//       return
//     }

//     // Verify payment with backend
//     const verifyPayment = async () => {
//       try {
//         // You can make an API call to verify the payment
//         const subscription = await paymentAPI.getSubscription()

//         if (subscription.data?.subscription) {
//           setPaymentType("subscription")
//           toast.success("Premium subscription activated!")
//         }
//       } catch (error) {
//         console.error("Payment verification failed:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     verifyPayment()
//   }, [sessionId, router])

//   return (
//     <div className="container max-w-md py-16">
//       <Card className="text-center">
//         <CardHeader>
//           <div className="mx-auto mb-4">
//             <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
//               <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl">Payment Successful!</CardTitle>
//           <CardDescription>
//             {paymentType === "subscription"
//               ? "Your premium subscription is now active"
//               : "Your purchase was completed successfully"}
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {paymentType === "subscription" ? (
//             <div className="space-y-4">
//               <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <UserCheck className="h-5 w-5 text-green-600" />
//                   <div className="text-left">
//                     <p className="font-medium">Verified Badge Unlocked</p>
//                     <p className="text-sm text-muted-foreground">Your profile now shows a verified badge</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3 text-sm">
//                 <p className="font-medium">What&apos;s Next:</p>
//                 <ul className="space-y-2 text-left">
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
//                     <span>Create unlimited travel plans</span>
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
//                     <span>Connect with unlimited travelers</span>
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
//                     <span>Access advanced search filters</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           ) : (
//             <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <CreditCard className="h-5 w-5 text-blue-600" />
//                 <div className="text-left">
//                   <p className="font-medium">Purchase Complete</p>
//                   <p className="text-sm text-muted-foreground">Receipt has been sent to your email</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex flex-col gap-3 pt-4">
//             <Button asChild>
//               <Link href="/dashboard">Go to Dashboard</Link>
//             </Button>
//             <Button variant="outline" asChild>
//               <Link href="/">
//                 <Home className="h-4 w-4 mr-2" />
//                 Back to Home
//               </Link>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

//newc1
// 'use client'

// import { useEffect, useState } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { toast } from 'sonner'
// import { CheckCircle, Home, CreditCard } from 'lucide-react'

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// import { authAPI, paymentAPI } from '@/lib/api'
// import { useAuth } from '@/lib/auth-context'

// export default function PaymentSuccessContent() {
//   const [isLoading, setIsLoading] = useState(true)
//   const [paymentType, setPaymentType] = useState<'subscription' | 'badge' | 'unknown'>('unknown')

//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const sessionId = searchParams.get('session_id')

//   const { updateUser } = useAuth()

//   useEffect(() => {
//     if (!sessionId) {
//       router.push('/')
//       return
//     }

//     const verifyAndRefreshUser = async () => {
//       try {
//         const subscriptionRes = await paymentAPI.getSubscription()

//         if (subscriptionRes.data?.subscription) {
//           setPaymentType('subscription')
//           toast.success('Premium subscription activated!')
//         } else {
//           setPaymentType('unknown')
//         }

//         // Refresh auth user so isPremium updates immediately in UI
//         const meRes = await authAPI.getMe()
//         updateUser(meRes.data.user)
//       } catch (error) {
//         console.error('Payment verification failed:', error)
//         toast.error('Payment verification failed. Please contact support.')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     verifyAndRefreshUser()
//   }, [sessionId, router, updateUser])

//   if (isLoading) {
//     return (
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle>Verifying payment…</CardTitle>
//           <CardDescription>Please wait while the subscription is activated.</CardDescription>
//         </CardHeader>
//         <CardContent />
//       </Card>
//     )
//   }

//   return (
//     <Card className="max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <CheckCircle className="h-6 w-6 text-green-600" />
//           Payment successful
//         </CardTitle>
//         <CardDescription>
//           {paymentType === 'subscription'
//             ? 'Your premium subscription is now active.'
//             : 'Your payment was received.'}
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {paymentType === 'subscription' && (
//           <div className="rounded-md border p-4 flex items-start gap-3">
//             <CreditCard className="h-5 w-5 mt-0.5" />
//             <div>
//               <div className="font-medium">Premium is enabled</div>
//               <div className="text-sm text-muted-foreground">
//                 You can now access premium-only features (travel plans, advanced filters, etc.).
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-2">
//           <Button asChild variant="default">
//             <Link href="/dashboard">
//               <Home className="h-4 w-4 mr-2" />
//               Go to dashboard
//             </Link>
//           </Button>

//           <Button variant="outline" onClick={() => router.push('/travel-plans/new')}>
//             Create travel plan
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { CheckCircle, Home, CreditCard } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { authAPI, paymentAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function PaymentSuccessContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [paymentType, setPaymentType] = useState<'subscription' | 'badge' | 'unknown'>('unknown')

  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const { updateUser } = useAuth()

  // Guard against repeated effect runs (Strict Mode / remounts)
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (!sessionId) {
      router.push('/')
      return
    }

    if (hasRunRef.current) return
    hasRunRef.current = true

    const verifyAndRefreshUser = async () => {
      try {
        const subscriptionRes = await paymentAPI.getSubscription()

        if (subscriptionRes.data?.subscription) {
          setPaymentType('subscription')
          toast.success('Premium subscription activated!')
        } else {
          setPaymentType('unknown')
        }

        const meRes = await authAPI.getMe()
        updateUser(meRes.data.user)
      } catch (error) {
        console.error('Payment verification failed:', error)
        toast.error('Payment verification failed. Please contact support.')
      } finally {
        setIsLoading(false)
      }
    }

    verifyAndRefreshUser()
  }, [sessionId, router, updateUser])

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Verifying payment…</CardTitle>
          <CardDescription>Please wait while the subscription is activated.</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Payment successful
        </CardTitle>
        <CardDescription>
          {paymentType === 'subscription'
            ? 'Your premium subscription is now active.'
            : 'Your payment was received.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {paymentType === 'subscription' && (
          <div className="rounded-md border p-4 flex items-start gap-3">
            <CreditCard className="h-5 w-5 mt-0.5" />
            <div>
              <div className="font-medium">Premium is enabled</div>
              <div className="text-sm text-muted-foreground">
                You can now access premium-only features (travel plans, advanced filters, etc.).
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to dashboard
            </Link>
          </Button>

          <Button variant="outline" onClick={() => router.push('/travel-plans/new')}>
            Create travel plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
