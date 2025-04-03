"use client"

import { useEffect, useState } from "react"
// import Image from "next/image"
import { Trophy, Medal, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeedbackStats } from "@/components/feedback-stats"

export default function LeaderboardPage() {
  type LeaderboardUser = {
    id: number
    firstname: string
    lastname: string
    donationCount: number
    totalRating: number
    ratingCount: number
    avgRating: number
    // image?: string | null
  }

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard")

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data")
        }

        const data = await response.json()
        setLeaderboard(data)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        setError("Failed to load leaderboard. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="container mx-auto py-8 mt-10 pt-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Top Donors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <p className="text-center text-gray-500 py-4">{error}</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No donors to display yet.</p>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={user.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-center h-8 w-8 mr-3">
                    {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                    {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                    {index === 2 && <Medal className="h-6 w-6 text-amber-600" />}
                    {index > 2 && <span className="font-bold text-gray-500">#{index + 1}</span>}
                  </div>

                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 border">
                    {/* <Image
                      src={user.image || "/placeholder.svg?height=40&width=40"}
                      alt={`${user.firstname} ${user.lastname}`}
                      fill
                      className="object-cover"
                    /> */}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {user.firstname} {user.lastname}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-3">{user.donationCount} donations</span>
                      {user.ratingCount > 0 && <FeedbackStats rating={user.avgRating} totalRatings={user.ratingCount} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}