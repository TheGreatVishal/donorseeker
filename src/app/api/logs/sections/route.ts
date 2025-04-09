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
