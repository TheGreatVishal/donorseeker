import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logApiActivity } from "@/utils/logApiActivity";

const section = "Requirement Categories";
const endpoint = "/api/requirement/categories";

export async function GET(request: Request) {
  const requestType = "GET";

  try {
    // Fetch unique categories from the database where listings are approved
    const categories = await prisma.requirementListing.findMany({
      where: {
        isApproved: true,
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    // Extract category names
    const categoryList = categories.map((item) => item.category);

    await logApiActivity({
      request,
      session: null, // No authentication required here
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Fetched requirement categories successfully",
    });

    return NextResponse.json(categoryList);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Error fetching categories:", errorMessage);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to fetch requirement categories - ${errorMessage}`,
    });

    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
