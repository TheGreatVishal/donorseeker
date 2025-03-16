import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession()

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email || "" },
      select: { isAdmin: true },
    })

    if (!session || !user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all donation listings (both approved and unapproved)
    const donationListings = await prisma.donationListing.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    })

    // Fetch all requirement listings (both approved and unapproved)
    const requirementListings = await prisma.requirementListing.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    })

    // Combine both types of listings with a type identifier
    const allListings = [
      ...donationListings.map((listing) => ({
        ...listing,
        listingType: "donation",
        // Add a short description excerpt
        description: listing.description
          ? listing.description.length > 150
            ? `${listing.description.substring(0, 150)}...`
            : listing.description
          : "",
      })),
      ...requirementListings.map((listing) => ({
        ...listing,
        listingType: "requirement",
        // Add a short description excerpt
        description: listing.description
          ? listing.description.length > 150
            ? `${listing.description.substring(0, 150)}...`
            : listing.description
          : "",
      })),
    ]

    // Sort by creation date (newest first)
    allListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ listings: allListings })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

