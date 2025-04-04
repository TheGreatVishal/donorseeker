import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { logApiActivity } from "@/utils/logApiActivity";

export async function POST(request: Request) {
  const endpoint = "/api/donations"; // adjust if needed
  const section = "Donations";
  const requestType = "POST";

  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized attempt to post a donation",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, condition, imageUrls, contact } = body;

    if (!title || !description || !category || !condition || !contact) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Missing required fields for donation submission",
      });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "User not found while posting donation",
      });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const donation = await prisma.donationListing.create({
      data: {
        title,
        description,
        category,
        condition,
        imageUrls,
        contact,
        userId: user.id,
      },
    });

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 201,
      description: `Donation created successfully: ${donation.id}`,
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Error creating donation:", error);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Server error while creating donation - ${error instanceof Error ? error.message : "unknown error"}`,
    });

    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 });
  }
}

export async function GET() {
  const endpoint = "/api/donations"; // same path as POST
  const section = "Donations";
  const requestType = "GET";

  try {
    const donations = await prisma.donationListing.findMany({
      where: {
        isApproved: true,
        status: {
          not: "COMPLETED",
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
            email: true,
          },
        },
      },
    });

    await logApiActivity({
      request: null, // No request object available in standard GET method signature
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Fetched active donation listings",
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);

    await logApiActivity({
      request: null,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Server error while fetching donations - ${error instanceof Error ? error.message : "unknown error"}`,
    });

    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}
