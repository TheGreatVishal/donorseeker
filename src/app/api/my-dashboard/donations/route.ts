import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { logApiActivity } from "@/utils/logApiActivity";

export async function GET(request: Request) {
  const endpoint = "/api/my-dashboard/donations";
  const section = "Dashboard Donations";
  const requestType = "GET";

  try {
    const session = await getServerSession();

    if (!session || !session.user || !session.user.email) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized access to dashboard donations",
      });

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const donations = await prisma.donationListing.findMany({
      where: {
        user: {
          email: userEmail,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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
      description: "Fetched dashboard donation listings successfully",
    });

    return NextResponse.json(donations);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Error fetching donations:", errorMessage);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to fetch dashboard donations - ${errorMessage}`,
    });

    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}
