import { notFound } from "next/navigation";
import Image from "next/image";
import { getDonationListing, getDonationRequests } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RequestsList from "./request-list";

export default async function DonationListingPage({ params }) {
    const { id: idString } = params;
    const listingId = Number.parseInt(idString);

    if (isNaN(listingId)) {
        return notFound();
    }

    const listing = await getDonationListing(listingId);

    if (!listing) {
        return notFound();
    }

    const requests = await getDonationRequests(listingId);

    return (
        <div className="container py-6 space-y-6 mt-10 pt-10 p-5">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
                <div className="flex items-center gap-2">
                    <Badge variant={listing.isApproved ? "default" : "secondary"}>
                        {listing.isApproved ? "Approved" : "Pending Approval"}
                    </Badge>
                    <Badge variant="outline">{listing.status}</Badge>
                    <Badge variant="outline">{listing.condition}</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{listing.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {listing.imageUrls.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                                        <Image
                                            src={url || "/placeholder.svg?height=200&width=200"}
                                            alt={`${listing.title} image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                {listing.imageUrls.length === 0 && (
                                    <div className="relative aspect-square rounded-md overflow-hidden border">
                                        <Image
                                            src="/placeholder.svg?height=200&width=200"
                                            alt="No image available"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm font-medium">Category</div>
                                <div className="text-sm">{listing.category}</div>

                                <div className="text-sm font-medium">Condition</div>
                                <div className="text-sm">{listing.condition}</div>

                                <div className="text-sm font-medium">Contact</div>
                                <div className="text-sm">{listing.contact}</div>

                                <div className="text-sm font-medium">Created</div>
                                <div className="text-sm">{new Date(listing.createdAt).toLocaleDateString()}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Donation Requests</CardTitle>
                            <CardDescription>
                                {requests.length} {requests.length === 1 ? "request" : "requests"} received
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {requests.length > 0 ? (
                                <RequestsList
                                    requests={requests.map((request) => ({
                                        ...request,
                                        createdAt: request.createdAt.toISOString(),
                                        updatedAt: request.updatedAt.toISOString(),
                                    }))}
                                    listingId={listingId}
                                />
                            ) : (
                                <p className="text-muted-foreground text-center py-6">No requests yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}