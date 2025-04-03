import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();

    // console.log("(Requirement) Session: ", session);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    // console.log("User Email: ", userEmail);

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
    

    return NextResponse.json(requirementListings);
  } catch (error) {
    console.error("Error fetching requirement listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch requirement listings" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
