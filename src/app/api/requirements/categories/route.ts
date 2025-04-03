import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get unique categories from the database
    const categories = await prisma.requirementListing.findMany({
      where: {
        isApproved: true,
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    })

    // Extract and return just the category names
    const categoryList = categories.map((item) => item.category)

    return NextResponse.json(categoryList)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

