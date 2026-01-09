import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import UnauthorizedContent from "./unauthorized-content"

function UnauthorizedSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="py-12">
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto" />
            <div className="h-8 bg-muted rounded mx-auto w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<UnauthorizedSkeleton />}>
      <UnauthorizedContent />
    </Suspense>
  )
}
