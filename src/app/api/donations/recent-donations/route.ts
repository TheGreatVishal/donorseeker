import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logApiActivity } from "@/utils/logApiActivity";
import { getServerSession } from "next-auth/next"
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const section = "donations";
  const endpoint = "/api/donations/recent";
  const requestType = "GET";
  const session = await getServerSession()

  try {
    const recentDonations = await prisma.donationListing.findMany({
      where: {
        isApproved: true,
        status: "APPROVED", 
        transactions: {
          none: {},
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
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
      description: "Successfully fetched recent approved donations",
    });

    return NextResponse.json(recentDonations);
  } catch (error) {
    console.error("Error fetching donations:", error);

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Server error while fetching donation listing - ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    });

    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
