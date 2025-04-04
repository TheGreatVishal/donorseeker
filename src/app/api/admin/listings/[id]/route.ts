import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { logApiActivity } from "@/utils/logApiActivity";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const session = await getServerSession()
	const { id: idString } = await params
	const id = Number.parseInt(idString)
	const endpoint = `/api/admin/listings/${idString}`
	const section = "Admin-Dashboard"
	const requestType = "GET"
	try {

		const user = await prisma.user.findUnique({
			where: { email: session?.user.email || "" },
			select: { isAdmin: true },
		})

		if (!session || !user?.isAdmin) {
			await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 401, description: "Unauthorized" })
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}


		if (isNaN(id)) {
			await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 400, description: "Invalid ID" })
			return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
		}

		// Get the listing type from query params
		const { searchParams } = new URL(request.url)
		const listingType = searchParams.get("type")

		let listing

		if (listingType === "donation") {
			// Fetch donation listing
			listing = await prisma.donationListing.findUnique({
				where: { id },
				include: {
					user: {
						select: {
							id: true,
							firstname: true,
							lastname: true,
							email: true,
							contact: true,
							donationCount: true,
							totalRating: true,
							ratingCount: true,
						},
					},
				},
			})

			if (listing) {
				listing = { ...listing, listingType: "donation" }
			}
		} else if (listingType === "requirement") {
			// Fetch requirement listing
			listing = await prisma.requirementListing.findUnique({
				where: { id },
				include: {
					user: {
						select: {
							id: true,
							firstname: true,
							lastname: true,
							email: true,
							contact: true,
							donationCount: true,
							totalRating: true,
							ratingCount: true,
						},
					},
				},
			})

			if (listing) {
				listing = { ...listing, listingType: "requirement" }
			}
		} else {
			// If no type specified, try both
			const donationListing = await prisma.donationListing.findUnique({
				where: { id },
				include: {
					user: {
						select: {
							id: true,
							firstname: true,
							lastname: true,
							email: true,
							contact: true,
							donationCount: true,
							totalRating: true,
							ratingCount: true,
						},
					},
				},
			})

			if (donationListing) {
				listing = { ...donationListing, listingType: "donation" }
			} else {
				const requirementListing = await prisma.requirementListing.findUnique({
					where: { id },
					include: {
						user: {
							select: {
								id: true,
								firstname: true,
								lastname: true,
								email: true,
								contact: true,
								donationCount: true,
								totalRating: true,
								ratingCount: true,
							},
						},
					},
				})

				if (requirementListing) {
					listing = { ...requirementListing, listingType: "requirement" }
				}
			}
		}

		if (!listing) {
			await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 404, description: "Listing not found" })
			return NextResponse.json({ error: "Listing not found" }, { status: 404 })
		}
		await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 200, description: "Listing fetched for Admin dashboard" })
		return NextResponse.json({ listing })
	} catch (error) {
		await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 500, description: "Internal Server Error" })
		console.error("Error fetching listing:", error)
		return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
	}
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	// Check if user is authenticated and is an admin
	const session = await getServerSession()
	const { id: idString } = await params
	const id = Number.parseInt(idString)
	const endpoint = `/api/admin/listings/${idString}`
	const section = "Admin-Dashboard"
	const requestType = "PATCH"
	try {

		const user = await prisma.user.findUnique({
			where: { email: session?.user.email || "" },
			select: { isAdmin: true },
		})

		if (!session || !user?.isAdmin) {
			await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 401, description: "Unauthorized" })
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		if (isNaN(id)) {
			await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 400, description: "Invalid ID" })
			return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
		}

		const { listingType, action } = await request.json()

		if (!["donation", "requirement"].includes(listingType)) {
			await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 400, description: "Invalid listing type" })
			return NextResponse.json({ error: "Invalid listing type" }, { status: 400 })
		}

		if (!["approve", "reject"].includes(action)) {
			await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 400, description: "Invalid action" })
			return NextResponse.json({ error: "Invalid action" }, { status: 400 })
		}

		const isApproved = action === "approve"
		const status = isApproved ? "APPROVED" : "PENDING"

		let updatedListing

		if (listingType === "donation") {
			// Update donation listing
			updatedListing = await prisma.donationListing.update({
				where: { id },
				data: {
					isApproved,
					status,
				},
			})
		} else {
			// Update requirement listing
			updatedListing = await prisma.requirementListing.update({
				where: { id },
				data: {
					isApproved,
					status,
				},
			})
		}

		await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 200, description: `Listing ${action}d successfully` })

		return NextResponse.json({
			message: `Listing ${isApproved ? "approved" : "unapproved"} successfully`,
			listing: updatedListing,
		})
	} catch (error) {
		console.error("Error updating listing:", error)
		await logApiActivity({ request, session, section, endpoint, requestType, statusCode: 500, description: "Internal Server Error" })
		return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
	}
}

