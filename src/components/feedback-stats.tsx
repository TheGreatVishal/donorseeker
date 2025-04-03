import { Star } from "lucide-react"

type FeedbackStatsProps = {
  rating: number
  totalRatings: number
}

export function FeedbackStats({ rating, totalRatings }: FeedbackStatsProps) {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1
  const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0)

  return (
    <div className="flex items-center">
      <div className="flex">
        {/* Full stars */}
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-current" />
          ))}

        {/* Partial star */}
        {partialStar > 0 && (
          <div className="relative">
            <Star className="h-4 w-4 text-gray-300 fill-current" />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
          ))}
      </div>

      <span className="ml-2 text-sm font-medium text-gray-700">
        {rating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
      </span>
    </div>
  )
}

