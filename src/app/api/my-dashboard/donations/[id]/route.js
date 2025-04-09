import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { logApiActivity } from "@/utils/logApiActivity";

export async function DELETE(request, { params }) {
  const { id } = params;
  const listingId = Number(id)
  const endpoint = `/api/donations/${listingId}`;
  const section = "Donation Listing";
  const requestType = "DELETE";
  const session = await getServerSession()
  try {


    if (!session?.user?.email) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized delete attempt",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("Delete request for Listing ID:", listingId)

    if (!listingId) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Listing ID not provided",
      });

      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    const listing = await prisma.donationListing.findUnique({
      where: { id: listingId },
    })

    // console.log("Listing found:", listing)

    if (!listing) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "Listing not found",
      });

      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Ensure only the owner can delete their listing
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || listing.userId !== user.id) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 403,
        description: "Forbidden: Not the owner of the listing",
      });

      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // console.log("User deleting the listing is same as the owner:")

    await prisma.donationListing.delete({
      where: { id: listingId },
    })
    // console.log("Listing deleted successfully:", listingId)

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Listing deleted successfully",
    });

    return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting listing:", error)
    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to delete listing - ${errorMessage}`,
    });
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
  }
}
