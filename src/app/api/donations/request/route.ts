import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { logApiActivity } from "@/utils/logApiActivity";

export async function POST(request: NextRequest) {
  const endpoint = "/api/donations/request"; 
  const section = "Donations";
  const requestType = "POST";

  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized: not logged in while requesting donation",
      });
      return NextResponse.json({ error: "You must be logged in to request a donation" }, { status: 401 });
    }

    const { listingId, message } = await request.json();

    if (!listingId || !message) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Missing required fields: listingId or message",
      });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get the user ID from the email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "User not found while requesting donation",
      });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing pending request
    const existingRequest = await prisma.donationRequest.findFirst({
      where: {
        seekerId: user.id,
        listingId: Number.parseInt(listingId),
        status: "PENDING",
      },
    });

    if (existingRequest) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Duplicate request for listingId ${listingId}`,
      });
      // return console.error("You already have a pending request for this donation")
      return NextResponse.json({ error: "You already have a pending request for this donation" }, { status: 400 });
    }

    // Create the donation request
    const donationRequest = await prisma.donationRequest.create({
      data: {
        message,
        seekerId: user.id,
        listingId: Number.parseInt(listingId),
        status: "PENDING",
      },
    });

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: `Successfully created donation request for listingId ${listingId}`,
    });

    return NextResponse.json({ success: true, request: donationRequest });
  } catch (error) {
    console.error("Error creating donation request:", error);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Server error while creating donation request - ${error instanceof Error ? error.message : "unknown error"}`
    });

    return NextResponse.json({ error: "Failed to create donation request" }, { status: 500 });
  }
}
