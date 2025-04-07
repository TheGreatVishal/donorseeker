// Fetches all distince api endpoints
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get distinct API endpoints
    const endpoints = await prisma.logging.findMany({
      select: {
        apiEndpoint: true,
      },
      distinct: ["apiEndpoint"],
      orderBy: {
        apiEndpoint: "asc",
      },
    })

    // Extract endpoint names from result
    const endpointNames = endpoints.map((item) => item.apiEndpoint)

    return NextResponse.json(endpointNames)
  } catch (error) {
    console.error("Error fetching endpoints:", error)
    return NextResponse.json({ error: "Failed to fetch endpoints" }, { status: 500 })
  }
}

