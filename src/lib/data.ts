import  prisma  from "./prisma"

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
      include: {
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

    return requests
  } catch (error) {
    console.error("Error fetching donation requests:", error)
    throw new Error("Failed to fetch donation requests")
  }
}

