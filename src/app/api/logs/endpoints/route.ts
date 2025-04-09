// Fetches all distince api endpoints
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"

export async function GET() {
  try {
    const session = await getServerSession()
    
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email || "" },
      select: { isAdmin: true },
    })
    
    if (!session || !user?.isAdmin) {
      console.log("Not Authorized user tried to access the logs...");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
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

