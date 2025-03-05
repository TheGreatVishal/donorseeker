// import { NextResponse } from "next/server"
// import prisma from "@/lib/prisma"
// import { getServerSession } from "next-auth/next"

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession()
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { title, description, category, urgency, imageUrls, contact } = body

//     if (!title || !description || !category || !urgency || !contact) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const requirement = await prisma.requirementListing.create({
//       data: {
//         title,
//         description,
//         category,
//         urgency,
//         imageUrls,
//         contact,
//         userId: user.id,
//       },
//     })

//     return NextResponse.json(requirement, { status: 201 })
//   } catch (error) {
//     console.error("Error creating requirement:", error)
//     return NextResponse.json({ error: "Failed to create requirement" }, { status: 500 })
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const category = searchParams.get("category")
//     const status = searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | null
//     const urgency = searchParams.get("urgency") as "LOW" | "NORMAL" | "HIGH" | "URGENT" | null

//     const filter: any = {
//       status: status || "APPROVED",
//     }

//     if (category) {
//       filter.category = category
//     }

//     if (urgency) {
//       filter.urgency = urgency
//     }

//     const requirements = await prisma.requirementListing.findMany({
//       where: filter,
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         user: {
//           select: {
//             username: true,
//             email: true,
//           },
//         },
//       },
//     })

//     return NextResponse.json(requirements)
//   } catch (error) {
//     console.error("Error fetching requirements:", error)
//     return NextResponse.json({ error: "Failed to fetch requirements" }, { status: 500 })
//   }
// }

