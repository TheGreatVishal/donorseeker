import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {
      isApproved: true,
      status: "APPROVED",
    };

    if (category) {
      where.category = category;
    }

    if (urgency) {
      where.urgency = urgency;
    }

    // Fetch requirements with pagination
    const requirements = await prisma.requirementListing.findMany({
      where,
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
            email: true,
            contact: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.requirementListing.count({ where });

    return NextResponse.json({
      requirements,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching requirements:", error);
    return NextResponse.json({ error: "Failed to fetch requirements" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail || "" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const requirementListing = await prisma.requirementListing.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        urgency: data.urgency || "NORMAL",
        imageUrls: data.imageUrls || [],
        contact: data.contact,
        status: "PENDING",
        isApproved: false,
        userId: user.id,
      },
    });

    return NextResponse.json(requirementListing, { status: 201 });
  } catch (error) {
    console.error("Error creating requirement listing:", error);
    return NextResponse.json(
      { error: "Failed to create requirement listing" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
