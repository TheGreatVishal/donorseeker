import  prisma  from "./prisma"
import { batchScoreNeediness } from "./groq"

export async function getDonationListing(id: number) {
  try {
    const listing = await prisma.donationListing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            contact: true,
          },
        },
      },
    })

    return listing
  } catch (error) {
    console.error("Error fetching donation listing:", error)
    throw new Error("Failed to fetch donation listing")
  }
}

export async function getDonationRequests(listingId: number) {
  try {
    const requests = await prisma.donationRequest.findMany({
      where: { listingId },
      select: {
        id: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        seekerId: true,
        listingId: true,
        seeker: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            contact: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    console.log("From lib/data.ts: ", requests)

    // Extract messages with their IDs for batch scoring
    const messagesToScore = requests.map((request) => ({
      id: request.id,
      message: request.message,
    }))

    // Score all messages at once
    const scores = await batchScoreNeediness(messagesToScore)

    // Merge scores back with the original requests
    const scoredRequests = requests.map((request) => {
      const scoreEntry = scores.find((score: { id: number; score: number }) => score.id === request.id)
      return {
        ...request,
        needinessScore: scoreEntry ? scoreEntry.score : 5, // Default to 5 if not found
      }
    })

    // Sort by neediness score (highest first)
    scoredRequests.sort((a, b) => b.needinessScore - a.needinessScore)
    console.log("Scored Requests: ", scoredRequests)

    return scoredRequests
  } catch (error) {
    console.error("Error fetching donation requests:", error)
    throw new Error("Failed to fetch donation requests")
  }
}



