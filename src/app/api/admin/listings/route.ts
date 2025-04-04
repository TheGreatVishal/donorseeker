// Description: This API route handles the retrieval of all donation and requirement listings for admin-dashboard. It checks if the user is authenticated and has admin privileges before fetching the listings from the database.

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { logApiActivity } from "@/utils/logApiActivity"

export async function GET(request: Request) {
  const session = await getServerSession()
  const endpoint = `/api/admin/listings`
  const section = "Admin-Dashboard"
  const requestType = "GET"
  try {

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email || "" },
      select: { isAdmin: true },
    })

    if (!session || !user?.isAdmin) {
      await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 401, description: "Unauthorized" })
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
    
    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Successfully fetched all listings for admin-dashboard",
    })

    return NextResponse.json({ listings: allListings })
  } catch (error) {
    console.error("Error fetching listings:", error)
    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: "Failed to fetch listings for admin-dashboard",
    })
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

