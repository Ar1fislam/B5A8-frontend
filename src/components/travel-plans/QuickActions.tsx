// // frontend/app/travel-plans/[id]/components/QuickActions.tsx
// 'use client'

// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import Link from 'next/link'
// import { Users, Edit, Share2, UserPlus, MessageSquare, Heart } from 'lucide-react'

// interface QuickActionsProps {
//   isPlanOwner: boolean
//   userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
//   isUpcoming: boolean
//   travelPlanId: string
//   onRequestToJoin: () => void
// }

// export function QuickActions({
//   isPlanOwner,
//   userMatchStatus,
//   isUpcoming,
//   travelPlanId,
//   onRequestToJoin
// }: QuickActionsProps) {
//   return (
//     <Card className="mb-6">
//       <CardHeader>
//         <CardTitle>Quick Actions</CardTitle>
//       </CardHeader>
//       <CardContent className="flex flex-col space-y-3">
//         {isPlanOwner ? (
//           <>
//             <Link href={`/travel-plans/${travelPlanId}/matches`}>
//               <Button variant="outline" className="w-full justify-start gap-2">
//                 <Users className="h-4 w-4" />
//                 View Match Requests
//               </Button>
//             </Link>
//             <Link href={`/travel-plans/${travelPlanId}/edit`}>
//               <Button variant="outline" className="w-full justify-start gap-2">
//                 <Edit className="h-4 w-4" />
//                 Edit Travel Plan
//               </Button>
//             </Link>
//             <Button variant="outline" className="w-full justify-start gap-2">
//               <Share2 className="h-4 w-4" />
//               Share with Friends
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button 
//               variant="outline" 
//               className="w-full justify-start gap-2"
//               onClick={onRequestToJoin}
//               disabled={!isUpcoming || userMatchStatus === 'PENDING' || userMatchStatus === 'ACCEPTED'}
//             >
//               <UserPlus className="h-4 w-4" />
//               {userMatchStatus === 'PENDING' ? 'Request Pending' : 
//                userMatchStatus === 'ACCEPTED' ? 'Request Accepted' : 
//                userMatchStatus === 'REJECTED' ? 'Request to Join' : 
//                'Request to Join'}
//             </Button>
//             <Button variant="outline" className="w-full justify-start gap-2">
//               <MessageSquare className="h-4 w-4" />
//               Message Organizer
//             </Button>
//             <Button variant="outline" className="w-full justify-start gap-2">
//               <Heart className="h-4 w-4" />
//               Save for Later
//             </Button>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   )
// }