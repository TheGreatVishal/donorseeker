import { logApiActivity } from "@/utils/logApiActivity";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const section = "profile";
  const endpoint = "/api/user/profile";
  const requestType = "GET";

  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized access attempt to profile data",
      });

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        donationListings: { orderBy: { createdAt: "desc" }, take: 5 },
        requirementListings: { orderBy: { createdAt: "desc" }, take: 5 },
        sentRequests: {
          include: { listing: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        receivedFeedback: {
          include: {
            giver: { select: { firstname: true, lastname: true } },
            transaction: {
              include: {
                listing: { select: { title: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        givenFeedback: {
          include: {
            transaction: {
              include: {
                listing: { select: { title: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        donations: {
          include: {
            listing: true,
            receiver: { select: { firstname: true, lastname: true } },
          },
          orderBy: { completedAt: "desc" },
          take: 5,
        },
        receivedDonations: {
          include: {
            listing: true,
            donor: { select: { firstname: true, lastname: true } },
          },
          orderBy: { completedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "User not found while fetching profile data",
      });

      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const averageRating =
      user.ratingCount > 0 ? user.totalRating / user.ratingCount : 0;

    const donationSuccessRate =
      user.donationListings.length > 0
        ? (user.donationCount / user.donationListings.length) * 100
        : 0;

    let userWithoutPassword = {};
    for (let key in user) {
      if (key !== "password") {
        userWithoutPassword[key] = user[key];
      }
    }

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "User profile data fetched successfully",
    });

    return NextResponse.json({
      ...userWithoutPassword,
      averageRating,
      donationSuccessRate,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Server error while fetching profile data - ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    });

    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
