import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { logApiActivity } from "@/utils/logApiActivity";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const section = "Requirement Listing";
  const endpoint = "/api/my-dashboard/requirements";
  const requestType = "GET";

  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized request for requirement listings",
      });

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const requirementListings = await prisma.requirementListing.findMany({
      where: {
        user: {
          email: userEmail ?? "",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Fetched requirement listings successfully",
    });

    return NextResponse.json(requirementListings);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Error fetching requirement listings:", errorMessage);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to fetch requirement listings - ${errorMessage}`,
    });

    return NextResponse.json(
      { error: "Failed to fetch requirement listings" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
