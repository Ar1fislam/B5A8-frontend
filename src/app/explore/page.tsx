import { Suspense } from 'react'
import ExploreContent from '@/components/explore/explore-content'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Explore - Travel Buddy',
  description: 'Find your travel buddy and join amazing travel plans',
}

function ExploreLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/30">
      <div className="container py-10">
        <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl animate-app-float" />
            <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-accent/18 blur-3xl animate-app-float [animation-delay:-6s]" />
          </div>

          <div className="relative space-y-4">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-10 w-[min(560px,90%)] rounded-2xl" />
            <Skeleton className="h-4 w-[min(520px,85%)] rounded-full" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreLoading />}>
      <ExploreContent />
    </Suspense>
  )
}
