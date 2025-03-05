import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = params.id

    console.log("=================================================")
    console.log("(donations/[id]/route.ts) Fetching donation details...")
    console.log("Donation ID:", id)

    const donation = await prisma.donationListing.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      )
    }

    console.log("Donation details fetched successfully")

    return NextResponse.json(donation)
  } catch (error) {
    console.error("Error fetching donation details:", error)
    return NextResponse.json(
      { error: "Failed to fetch donation details" },
      { status: 500 }
    )
  }
}


export async function PATCH(request: Request, { params }: { params: { id: number } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Optional: Check authorization
    // const session = await getServerSession()
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const donation = await prisma.donationListing.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(donation)
  } catch (error) {
    console.error("Error updating donation:", error)
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
  try {
    const id = params.id

    // Optional: Check authorization
    // const session = await getServerSession()
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    await prisma.donationListing.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting donation:", error)
    return NextResponse.json({ error: "Failed to delete donation" }, { status: 500 })
  }
}

