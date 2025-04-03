"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Tag, User, Mail, Phone, Heart, Share2, AlertTriangle, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { RequestDialog } from "@/components/request-dialog"
import Image from "next/image"

interface UserType {
  id: number
  firstname: string
  lastname: string
  email: string
  contact: string
  donationCount: number
  totalRating: number
  ratingCount: number
}

interface Donation {
  id: number
  title: string
  description: string
  category: string
  condition: string
  imageUrls: string[]
  contact: string
  status: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  userId: number
  user: UserType
  listingType: string
}

export default function DonationDetailPage() {
  const params = useParams()

  const router = useRouter()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [, setHasExistingRequest] = useState(false)

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/donations/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch donation details")
        }

        const data = await response.json()
        setDonation(data.listing)

        // Check if user has already requested this item
        if (data.userHasRequested) {
          setHasExistingRequest(true)
          setRequestSent(true)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching donation details:", error)
        setError("Failed to load donation details. Please try again later.")
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDonationDetails()
    }
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleRequestItem = () => {
    setRequestDialogOpen(true)
  }

  const handleRequestComplete = () => {
    setRequestSent(true)
    setHasExistingRequest(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: donation?.title,
          text: `Check out this donation: ${donation?.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Donation link copied to clipboard",
      })
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "used":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "good":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "fair":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "bad":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "donated":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const calculateAverageRating = (user: UserType) => {
    if (user.ratingCount === 0) return 0
    return user.totalRating / user.ratingCount
  }

  // Check if the donation is available for request
  const canRequest = donation && donation.status !== "DONATED" && donation.status !== "COMPLETED" && donation.isApproved

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !donation) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-20 px-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-500">{error || "Donation not found"}</h1>
        <Button onClick={handleGoBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={handleGoBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Donations
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-6">
                {donation.imageUrls && donation.imageUrls.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {donation.imageUrls.map((imageUrl, index) => (
                        <CarouselItem key={index}>
                          <div className="h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                            <Image
                              src={imageUrl || "/placeholder.svg?height=400&width=600"}
                              alt={`${donation.title} - Image ${index + 1}`}
                              width={600}
                              height={400}
                              className="object-contain max-h-full max-w-full"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No images available</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold">{donation.title}</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="capitalize">
                    <Tag className="h-3 w-3 mr-1" /> {donation.category}
                  </Badge>
                  <Badge className={`capitalize ${getConditionColor(donation.condition)}`}>
                    Condition: {donation.condition}
                  </Badge>
                  <Badge className={`capitalize ${getStatusColor(donation.status)}`}>{donation.status}</Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Posted on {formatDate(donation.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Last updated: {formatDate(donation.updatedAt)}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Donor Information</h2>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{`${donation.user.firstname[0]}${donation.user.lastname[0]}`}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${donation.user.firstname} ${donation.user.lastname}`}</p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>
                          {calculateAverageRating(donation.user).toFixed(1)} ({donation.user.ratingCount} reviews)
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {donation.user.donationCount} donations
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full" onClick={handleRequestItem} disabled={requestSent || !canRequest}>
                    {requestSent
                      ? "Request Sent"
                      : !canRequest
                        ? donation.status === "DONATED"
                          ? "Already Donated"
                          : "Not Available"
                        : "Request This Item"}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description and Details Tabs */}
        <Card className="mt-8 shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="description">
              <TabsList className="mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>{donation.description}</p>
              </TabsContent>
              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium">Category</p>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">{donation.category}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Condition</p>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">{donation.condition}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Status</p>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">{donation.status}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Posted Date</p>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(donation.createdAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Last Updated</p>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(donation.updatedAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Approval Status</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {donation.isApproved ? "Approved" : "Pending Approval"}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="contact">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-gray-600 dark:text-gray-400">{`${donation.user.firstname} ${donation.user.lastname}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600 dark:text-gray-400">{donation.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600 dark:text-gray-400">{donation.user.contact}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Similar Donations - This would be implemented with actual data */}
        <Card className="mt-8 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Similar Donations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
                <h3 className="font-medium">Similar Item 1</h3>
                <p className="text-sm text-gray-500">Category: {donation.category}</p>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
                <h3 className="font-medium">Similar Item 2</h3>
                <p className="text-sm text-gray-500">Category: {donation.category}</p>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
                <h3 className="font-medium">Similar Item 3</h3>
                <p className="text-sm text-gray-500">Category: {donation.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Dialog */}
      <RequestDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        listingId={donation.id}
        onRequestComplete={handleRequestComplete}
      />
    </div>
  )
}

