import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { logApiActivity } from "@/utils/logApiActivity"

export async function GET(request: Request) {
	const section = "Logs Section"
	const endpoint = "/api/admin/logs/sections"
	const requestType = "GET"

	try {
		const session = await getServerSession()

		const user = await prisma.user.findUnique({
			where: { email: session?.user.email || "" },
			select: { isAdmin: true },
		})

		if (!session || !user?.isAdmin) {
			console.log("Not Authorized user tried to access the logs...")

			await logApiActivity({
				request,
				session,
				section,
				endpoint,
				requestType,
				statusCode: 401,
				description: `Unauthorized access to logs sections by: ${session?.user.email ?? "Unknown user"}`,
			})

			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const sections = await prisma.logging.findMany({
			select: {
				section: true,
			},
			distinct: ["section"],
			orderBy: {
				section: "asc",
			},
		})

		const sectionNames = sections.map((item) => item.section)

		await logApiActivity({
			request,
			session,
			section,
			endpoint,
			requestType,
			statusCode: 200,
			description: `Fetched distinct log sections successfully by: ${session?.user.email}`,
		})

		return NextResponse.json(sectionNames)
	} catch (error) {
		console.error("Error fetching sections:", error)

		const session = await getServerSession()

		await logApiActivity({
			request,
			session,
			section,
			endpoint,
			requestType,
			statusCode: 500,
			description: `Error fetching distinct log sections: ${error instanceof Error ? error.message : "Unknown error"}`,
		})

		return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 })
	}
}
