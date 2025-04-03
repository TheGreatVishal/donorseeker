import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get top donors based on donation count and ratings
    const topDonors = await prisma.user.findMany({
      where: {
        donationCount: {
          gt: 0,
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        donationCount: true,
        totalRating: true,
        ratingCount: true,
        // image: true,
      },
      orderBy: [{ donationCount: "desc" }, { totalRating: "desc" }],
      take: 10,
    })

    // Calculate average rating for each donor
    const leaderboard = topDonors.map((donor) => {
      const avgRating = donor.ratingCount > 0 ? donor.totalRating / donor.ratingCount : 0

      return {
        ...donor,
        avgRating: Number.parseFloat(avgRating.toFixed(1)),
      }
    })

    return NextResponse.json(leaderboard)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error fetching leaderboard:", errorMessage)

    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 })
  }
}

