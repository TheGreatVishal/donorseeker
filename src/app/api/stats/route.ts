import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logApiActivity } from "@/utils/logApiActivity"; // Adjust the import path if needed
import { getServerSession } from "next-auth/next"

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const section = "Stats";
  const endpoint = "/api/stats";
  const requestType = "GET";
  const session = await getServerSession();
  try {
    console.log("Reaching here at stats ....");
    
    const totalDonations = await prisma.transaction.count();

    const activeDonors = await prisma.user.count({
      where: {
        donations: {
          some: {},
        },
      },
    });

    const itemsRequested = await prisma.donationRequest.count({
      where: {
        status: "PENDING",
      },
    });

    const recentListings = await prisma.donationListing.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Successfully fetched stats",
    });

    return NextResponse.json({
      totalDonations,
      activeDonors,
      itemsRequested,
      recentListings,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Server error while fetching stats - ${error instanceof Error ? error.message : "unknown error"
        }`,
    });

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
