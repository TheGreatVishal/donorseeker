import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { logApiActivity } from "@/utils/logApiActivity";

const prisma = new PrismaClient();

export async function GET(request, { params }) {

  const id = Number.parseInt(params.id);
  const section = "Requirement Listing (Detail)";
  const endpoint = `/api/requirement/${id}`;
  const requestType = "GET";
  try {

    if (isNaN(id)) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Invalid ID format in GET",
      });
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const session = await getServerSession();

    if (!session || !session.user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized access attempt in GET",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.requirementListing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
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
        description: "Requirement listing not found in GET",
      });
      return NextResponse.json({ error: "Requirement listing not found" }, { status: 404 });
    }

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Fetched requirement listing successfully",
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching requirement listing:", error);
    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to fetch requirement listing - ${errorMessage}`,
    });

    return NextResponse.json({ error: "Failed to fetch requirement listing" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  const id = Number.parseInt(params.id);
  const section = "Requirement Listing (Detail)";
  const endpoint = `/api/requirement/${id}`;
  const requestType = "DELETE";
  try {

    if (isNaN(id)) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Invalid ID format in DELETE",
      });
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const session = await getServerSession();

    if (!session || !session.user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized access attempt in DELETE",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.requirementListing.findUnique({
      where: { id },
    });

    if (!listing) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "Requirement listing not found in DELETE",
      });
      return NextResponse.json({ error: "Requirement listing not found" }, { status: 404 });
    }


    if (listing.userId !== Number(session.user.id) && !session.user.isAdmin) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 403,
        description: "Forbidden DELETE request: user is not owner or admin",
      });

      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.requirementListing.delete({
      where: { id },
    });

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Requirement listing deleted successfully",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting requirement listing:", error);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to delete requirement listing - ${errorMessage}`,
    });
    return NextResponse.json({ error: "Failed to delete requirement listing" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
