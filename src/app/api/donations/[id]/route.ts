// It handles the API route for fetching a donation listing by its ID and displays on new page after viewing from browse donation page.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { logApiActivity } from "@/utils/logApiActivity";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idString } = await params;
  const id = Number.parseInt(idString);
  const endpoint = `/api/donations/${id}`;
  const section = "Donations";
  const requestType = "GET";

  try {
    const session = await getServerSession();

    if (!session) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized access to donation listing by ID",
      });

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    if (isNaN(id)) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Invalid donation listing ID",
      });

      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

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
            donationCount: true,
            totalRating: true,
            ratingCount: true,
          },
        },
      },
    });

    if (!listing) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: `Donation listing not found for ID ${id}`,
      });

      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: `Successfully fetched donation listing ID ${id}`,
    });

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Error fetching listing:", error);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Server error while fetching donation listing - ${error instanceof Error ? error.message : "unknown error"}`,
    });

    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}
