// frontend/components/reviews/ReviewsHeader.tsx
interface ReviewsHeaderProps {
  title?: string
  description?: string
}

export function ReviewsHeader({
  title = "Reviews",
  description = "See what others say about you and manage your reviews"
}: ReviewsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  )
}