"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
// import { useSession } from "next-auth/react"
import { ArrowLeft, Calendar, MapPin, Tag, User, Mail, Phone, Heart, Share2, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

interface Donation {
  id: string
  title: string
  description: string
  category: string
  condition: string
  location?: string
  imageUrls: string[]
  contact: string
  status: string
  createdAt: string
  user: {
    id: string
    username: string
    email: string
    image?: string
  }
}

export default function DonationDetailPage() {
  const params = useParams()
  const router = useRouter()
  // const { data: session } = useSession()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/donations/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch donation details")
        }

        const data = await response.json()
        setDonation(data)
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                {donation.imageUrls && donation.imageUrls.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {donation.imageUrls.map((imageUrl, index) => (
                        <CarouselItem key={index}>
                          <div className="h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                            {/* <img
                              // src={imageUrl || "/placeholder.svg"}
                              // alt={`${donation.title} - Image ${index + 1}`}
                              // className="object-contain max-h-full max-w-full"
                              onError={(e) => {
                                ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=600"
                              }}
                            /> */}

                            <Image
                              src={imageUrl || "/placeholder.svg"}
                              alt={`${donation.title} - Image ${index + 1}`}
                              width={300}
                              height={200}
                              className="object-contain max-h-full max-w-full"
                              onError={() => console.log("Image failed to load")}
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
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold">{donation.title}</h1>
                  <Button variant="outline" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="capitalize">
                    <Tag className="h-3 w-3 mr-1" /> {donation.category}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    Condition: {donation.condition}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Posted on {formatDate(donation.createdAt)}</span>
                  </div>
                  {donation.location && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{donation.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      Status: <span className="font-medium capitalize">{donation.status.toLowerCase()}</span>
                    </span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Donor Information</h2>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={donation.user.image || ""} />
                      <AvatarFallback>{donation.user.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{donation.user.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{donation.user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full">Request This Item</Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description and Details Tabs */}
        <Card className="mt-8">
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
                  {donation.location && (
                    <div className="space-y-2">
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600 dark:text-gray-400">{donation.location}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="font-medium">Posted Date</p>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(donation.createdAt)}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="contact">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-gray-600 dark:text-gray-400">{donation.user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600 dark:text-gray-400">{donation.user.email}</p>
                    </div>
                  </div>
                  {donation.contact && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-500" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600 dark:text-gray-400">{donation.contact}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

