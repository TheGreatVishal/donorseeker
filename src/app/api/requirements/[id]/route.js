import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = Number.parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const session = await getServerSession();

    if (!session || !session.user) {
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
      return NextResponse.json({ error: "Requirement listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching requirement listing:", error);
    return NextResponse.json({ error: "Failed to fetch requirement listing" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = Number.parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.requirementListing.findUnique({
      where: { id },
    });

    if (!listing) {
      return NextResponse.json({ error: "Requirement listing not found" }, { status: 404 });
    }

    if (listing.userId !== Number(session.user.id) && !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.requirementListing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting requirement listing:", error);
    return NextResponse.json({ error: "Failed to delete requirement listing" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
