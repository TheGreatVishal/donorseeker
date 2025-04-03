import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Await the params object before accessing its properties
    const { id: idString } = await params
    const id = Number.parseInt(idString)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Get the listing type from query params
    const { searchParams } = new URL(request.url)
    const listingType = searchParams.get("type")

    // console.log("ID:", id)
    // console.log("Listing type:", listingType)

    let listing

    if (listingType === "donation") {
      // Fetch donation listing
      listing = await prisma.donationListing.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              contact: true,
              donationCount: true,
              totalRating: true,
              ratingCount: true,
            },
          },
        },
      })

      if (listing) {
        listing = { ...listing, listingType: "donation" }
      }
    } else if (listingType === "requirement") {
      // Fetch requirement listing
      listing = await prisma.requirementListing.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              contact: true,
              donationCount: true,
              totalRating: true,
              ratingCount: true,
            },
          },
        },
      })

      if (listing) {
        listing = { ...listing, listingType: "requirement" }
      }
    } else {
      // If no type specified, try both
      const donationListing = await prisma.donationListing.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              contact: true,
              donationCount: true,
              totalRating: true,
              ratingCount: true,
            },
          },
        },
      })

      if (donationListing) {
        listing = { ...donationListing, listingType: "donation" }
      } else {
        const requirementListing = await prisma.requirementListing.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                contact: true,
                donationCount: true,
                totalRating: true,
                ratingCount: true,
              },
            },
          },
        })

        if (requirementListing) {
          listing = { ...requirementListing, listingType: "requirement" }
        }
      }
    }

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error("Error fetching listing:", error)
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Await the params object before accessing its properties
    const { id: idString } = await params
    const id = Number.parseInt(idString)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const { listingType, action } = await request.json()

    if (!listingType || !["donation", "requirement"].includes(listingType)) {
      return NextResponse.json({ error: "Invalid listing type" }, { status: 400 })
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const isApproved = action === "approve"
    const status = isApproved ? "APPROVED" : "PENDING"

    let updatedListing

    if (listingType === "donation") {
      // Update donation listing
      updatedListing = await prisma.donationListing.update({
        where: { id },
        data: {
          isApproved,
          status,
        },
      })
    } else {
      // Update requirement listing
      updatedListing = await prisma.requirementListing.update({
        where: { id },
        data: {
          isApproved,
          status,
        },
      })
    }

    return NextResponse.json({
      message: `Listing ${isApproved ? "approved" : "unapproved"} successfully`,
      listing: updatedListing,
    })
  } catch (error) {
    console.error("Error updating listing:", error)
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}

