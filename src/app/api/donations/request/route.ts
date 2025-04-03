import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth"
import prisma  from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "You must be logged in to request a donation" }, { status: 401 })
    }

    const { listingId, message } = await request.json()

    if (!listingId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the user ID from the email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user already has a pending request for this listing
    const existingRequest = await prisma.donationRequest.findFirst({
      where: {
        seekerId: user.id,
        listingId: Number.parseInt(listingId),
        status: "PENDING",
      },
    })

    if (existingRequest) {
      return NextResponse.json({ error: "You already have a pending request for this donation" }, { status: 400 })
    }

    // Create the donation request
    const donationRequest = await prisma.donationRequest.create({
      data: {
        message,
        seekerId: user.id,
        listingId: Number.parseInt(listingId),
        status: "PENDING",
      },
    })

    return NextResponse.json({ success: true, request: donationRequest })
  } catch (error) {
    console.error("Error creating donation request:", error)
    return NextResponse.json({ error: "Failed to create donation request" }, { status: 500 })
  }
}

