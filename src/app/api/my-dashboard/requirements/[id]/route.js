import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: idString } = params;
        const id = Number.parseInt(idString);
        const listingId = id;
        console.log("Delete request for Listing ID:", listingId);
        
        if (!listingId) {
            return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
        }

        const listing = await prisma.requirementListing.findUnique({
            where: { id: listingId },
        });

        console.log("Listing found:", listing);
        
        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        // Ensure only the owner can delete their listing
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || listing.userId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        console.log("User deleting the listing is same as the owner:");
        
        await prisma.requirementListing.delete({
            where: { id: listingId },
        });
        console.log("Listing deleted successfully:", listingId);
        
        return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting listing:", error);
        return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
    }
}
