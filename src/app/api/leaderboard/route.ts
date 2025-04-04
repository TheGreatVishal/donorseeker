// Description: This API route fetches the leaderboard data for top 10 donors based on their donation count and ratings. It returns the data in JSON format.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logApiActivity } from "@/utils/logApiActivity";

export async function GET(request: Request) {
  const endpoint = "/api/leaderboard"; // adjust if needed
  const section = "Leaderboard";
  const requestType = "GET";

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
    });

    // Calculate average rating for each donor
    const leaderboard = topDonors.map((donor) => {
      const avgRating = donor.ratingCount > 0 ? donor.totalRating / donor.ratingCount : 0;
      return {
        ...donor,
        avgRating: Number.parseFloat(avgRating.toFixed(1)),
      };
    });

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Fetched leaderboard data successfully",
    });

    return NextResponse.json(leaderboard);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching leaderboard:", errorMessage);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Error fetching leaderboard - ${errorMessage}`,
    });

    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 });
  }
}
