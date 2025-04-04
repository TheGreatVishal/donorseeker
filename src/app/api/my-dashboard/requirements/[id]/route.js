import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { logApiActivity } from "@/utils/logApiActivity";

export async function DELETE(request, { params }) {

    const { id: idString } = params;
    const id = Number.parseInt(idString);
    const listingId = id;
    const endpoint = `/api/requirement-listing/${listingId}`;
    const section = "Requirement Listing";
    const requestType = "DELETE";
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            await logApiActivity({
                request,
                session,
                section,
                endpoint,
                requestType,
                statusCode: 401,
                description: "Unauthorized delete attempt",
            });

            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // console.log("Delete request for Listing ID:", listingId);

        if (!listingId) {
            await logApiActivity({
                request,
                session,
                section,
                endpoint,
                requestType,
                statusCode: 400,
                description: "Missing or invalid listing ID",
            });

            return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
        }

        const listing = await prisma.requirementListing.findUnique({
            where: { id: listingId },
        });

        // console.log("Listing found:", listing);
        if (!listing) {
            await logApiActivity({
                request,
                session,
                section,
                endpoint,
                requestType,
                statusCode: 404,
                description: "Listing not found",
            });

            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        // Ensure only the owner can delete their listing
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || listing.userId !== user.id) {
            await logApiActivity({
                request,
                session,
                section,
                endpoint,
                requestType,
                statusCode: 403,
                description: "User not authorized to delete this listing",
            });

            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // console.log("User deleting the listing is same as the owner:");

        await prisma.requirementListing.delete({
            where: { id: listingId },
        });
        // console.log("Listing deleted successfully:", listingId);
        await logApiActivity({
            request,
            session,
            section,
            endpoint,
            requestType,
            statusCode: 200,
            description: "Requirement listing deleted successfully",
        });
        return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting listing:", error);
        await logApiActivity({
            request,
            session: null,
            section,
            endpoint,
            requestType,
            statusCode: 500,
            description: `Failed to delete listing - ${errorMessage}`,
        });
        return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
    }
}
