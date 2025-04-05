import { notFound } from "next/navigation";
import Image from "next/image";
import { getDonationListing, getDonationRequests } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Tag, Info, CheckCircle2 } from 'lucide-react';
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
        <div className="flex justify-center items-start w-full bg-gray-50 min-h-screen mt-10 pt-10">
            <div className="container max-w-6xl py-8 space-y-8 px-4 sm:px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{listing.title}</h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge 
                                variant={listing.isApproved ? "default" : "secondary"}
                                className="px-3 py-1 text-xs font-medium"
                            >
                                {listing.isApproved ? "Approved" : "Pending Approval"}
                            </Badge>
                            <Badge 
                                variant="outline" 
                                className="px-3 py-1 text-xs font-medium bg-gray-100"
                            >
                                {listing.status}
                            </Badge>
                            <Badge 
                                variant="outline"
                                className="px-3 py-1 text-xs font-medium bg-gray-100"
                            >
                                {listing.condition}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card className="overflow-hidden shadow-sm">
                            <CardHeader className="bg-gray-50 border-b">
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-gray-500" />
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden shadow-sm">
                            <CardHeader className="bg-gray-50 border-b">
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-gray-500" />
                                    Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-gray-500">Category</div>
                                        <div className="font-medium">{listing.category}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-gray-500">Condition</div>
                                        <div className="font-medium">{listing.condition}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-gray-500">Contact</div>
                                        <div className="font-medium">{listing.contact}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-gray-500">Created</div>
                                        <div className="font-medium">{new Date(listing.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden shadow-sm">
                            <CardHeader className="bg-gray-50 border-b">
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    Images
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {listing.imageUrls && listing.imageUrls.length > 0 ? (
                                        listing.imageUrls.map((url, index) => (
                                            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border bg-white shadow-sm hover:shadow-md transition-all">
                                                <Image
                                                    src={url || "/placeholder.svg?height=300&width=300"}
                                                    alt={`${listing.title} image ${index + 1}`}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full flex justify-center items-center p-8 border rounded-lg bg-gray-50">
                                            <p className="text-gray-500">No images available</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="overflow-hidden shadow-sm sticky top-6">
                            <CardHeader className="bg-gray-50 border-b">
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-gray-500" />
                                    Donation Requests
                                </CardTitle>
                                <CardDescription>
                                    {requests.length} {requests.length === 1 ? "request" : "requests"} received
                                </CardDescription>
                                {requests.length > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                        <span className="font-medium">Sorted by AI-assessed need score</span>
                                        <div className="relative group">
                                            <Info className="h-3.5 w-3.5 cursor-help" />
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                Higher scores indicate greater need based on AI analysis of request messages.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="p-4">
                                {requests.length > 0 ? (
                                    <RequestsList
                                        requests={requests.map((request) => ({
                                            ...request,
                                            createdAt: request.createdAt.toISOString(),
                                            updatedAt: request.updatedAt.toISOString(),
                                            needinessScore: request.needinessScore,
                                        }))}
                                        listingId={listingId}
                                    />
                                ) : (
                                    <div className="text-center py-8 px-4">
                                        <p className="text-gray-500 mb-2">No requests yet</p>
                                        <p className="text-xs text-muted-foreground">When someone requests this donation, they will appear here</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
