import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get distinct sections
    const sections = await prisma.logging.findMany({
      select: {
        section: true,
      },
      distinct: ["section"],
      orderBy: {
        section: "asc",
      },
    })

    // Extract section names from result
    const sectionNames = sections.map((item) => item.section)

    return NextResponse.json(sectionNames)
  } catch (error) {
    console.error("Error fetching sections:", error)
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 })
  }
}

