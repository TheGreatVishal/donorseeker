"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Phone,
  Calendar,
  Gift,
  Award,
  Star,
  CheckCircle,
  Edit,
  ChevronRight,
  MessageSquare,
  ArrowUpRight,
  Inbox,
  Send,
  Settings,
  Shield,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Define types based on our Prisma schema
type UserProfile = {
  id: number
  firstname: string
  lastname: string
  email: string
  contact: string
  isAdmin: boolean
  verified: boolean
  createdAt: string
  donationCount: number
  totalRating: number
  ratingCount: number
  averageRating: number
  donationSuccessRate: number
  donationListings: DonationListing[]
  requirementListings: RequirementListing[]
  sentRequests: DonationRequest[]
  receivedFeedback: Feedback[]
  givenFeedback: Feedback[]
  donations: Transaction[]
  receivedDonations: Transaction[]
}

type DonationListing = {
  id: number
  title: string
  description: string
  category: string
  condition: string
  imageUrls: string[]
  status: string
  isApproved: boolean
  createdAt: string
}

type RequirementListing = {
  id: number
  title: string
  description: string
  category: string
  urgency: string
  imageUrls: string[]
  status: string
  isApproved: boolean
  createdAt: string
}

type DonationRequest = {
  id: number
  message: string
  status: string
  createdAt: string
  listing: {
    id: number
    title: string
    imageUrls: string[]
  }
}

type Feedback = {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  giver: {
    firstname: string
    lastname: string
  }
  transaction: {
    listing: {
      title: string
    }
  }
}

type Transaction = {
  id: number
  completedAt: string
  isReceived: boolean
  listing: {
    id: number
    title: string
    imageUrls: string[]
  }
  donor?: {
    firstname: string
    lastname: string
  }
  receiver?: {
    firstname: string
    lastname: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/user/profile")

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error:", errorText)
          throw new Error(`Failed to fetch profile: ${response.status}`)
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchProfile()
    }
  }, [status, router])

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-70"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-4">We could not find your profile information.</p>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get initials for avatar
  const getInitials = () => {
    return `${profile.firstname.charAt(0)}${profile.lastname.charAt(0)}`
  }

  // Generate star rating display
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "DONATED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "ACCEPTED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Replace the safeArray function with this typed version
  const safeArray = <T,>(arr: T[] | undefined): T[] => {
    return Array.isArray(arr) ? arr : []
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ">
      <div className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-300/20 via-transparent to-transparent"></div>
            </div>

            {/* Profile Info Card */}
            <div className="relative -mt-16 md:-mt-24 px-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white dark:border-gray-800 shadow-md">
                      <AvatarFallback className="text-2xl md:text-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {profile.verified && (
                      <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                          {profile.firstname} {profile.lastname}
                          {profile.isAdmin && (
                            <Badge className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                              <Shield className="h-3 w-3 mr-1" /> Admin
                            </Badge>
                          )}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Member since {formatDate(profile.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="h-4 w-4" /> Edit Profile
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Settings className="h-4 w-4" /> Settings
                        </Button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{profile.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Joined {new Date(profile.createdAt).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Donation Count</p>
                  <h3 className="text-3xl font-bold mt-1">{profile.donationCount}</h3>
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Items donated to others</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Rating</p>
                  <div className="mt-1">{renderStarRating(profile.averageRating)}</div>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Based on {profile.ratingCount} ratings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</p>
                  <h3 className="text-3xl font-bold mt-1">{profile.donationSuccessRate.toFixed(0)}%</h3>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={profile.donationSuccessRate} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Items Received</p>
                  <h3 className="text-3xl font-bold mt-1">{safeArray(profile.receivedDonations).length}</h3>
                </div>
                <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                  <Inbox className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Items received from others</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 md:w-auto w-full mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Summary */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Activity Summary</CardTitle>
                        <CardDescription>Your recent donation platform activity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          {/* Recent Donations */}
                          {safeArray(profile.donationListings).length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Gift className="h-5 w-5 mr-2 text-purple-500" />
                                Recent Donations
                              </h3>
                              <div className="space-y-3">
                                {safeArray(profile.donationListings)
                                  .slice(0, 3)
                                  .map((listing) => (
                                    <div
                                      key={listing.id}
                                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                                    >
                                      <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                        <Image
                                          src={listing.imageUrls?.[0] || "/placeholder.svg?height=48&width=48"}
                                          alt={listing.title}
                                          width={48}
                                          height={48}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{listing.title}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Badge className={`${getStatusColor(listing.status)} text-xs`}>
                                            {listing.status}
                                          </Badge>
                                          <span className="mx-2">•</span>
                                          <span>{formatDate(listing.createdAt)}</span>
                                        </div>
                                      </div>
                                      <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/browse-donations/${listing.id}`}>
                                          <ChevronRight className="h-5 w-5" />
                                        </Link>
                                      </Button>
                                    </div>
                                  ))}
                              </div>
                              {safeArray(profile.donationListings).length > 3 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-3 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                >
                                  View all donations <ArrowUpRight className="ml-1 h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}

                          {/* Recent Requirements */}
                          {safeArray(profile.requirementListings).length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Inbox className="h-5 w-5 mr-2 text-blue-500" />
                                Recent Requirements
                              </h3>
                              <div className="space-y-3">
                                {safeArray(profile.requirementListings)
                                  .slice(0, 3)
                                  .map((listing) => (
                                    <div
                                      key={listing.id}
                                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                                    >
                                      <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                        <Image
                                          src={listing.imageUrls?.[0] || "/placeholder.svg?height=48&width=48"}
                                          alt={listing.title}
                                          width={48}
                                          height={48}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{listing.title}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Badge className={`${getStatusColor(listing.status)} text-xs`}>
                                            {listing.status}
                                          </Badge>
                                          <span className="mx-2">•</span>
                                          <span>Urgency: {listing.urgency}</span>
                                        </div>
                                      </div>
                                      <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/browse-requirements/${listing.id}`}>
                                          <ChevronRight className="h-5 w-5" />
                                        </Link>
                                      </Button>
                                    </div>
                                  ))}
                              </div>
                              {safeArray(profile.requirementListings).length > 3 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  View all requirements <ArrowUpRight className="ml-1 h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Feedback */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Feedback</CardTitle>
                        <CardDescription>What others say about you</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {safeArray(profile.receivedFeedback).length > 0 ? (
                          <div className="space-y-4">
                            {safeArray(profile.receivedFeedback)
                              .slice(0, 3)
                              .map((feedback) => (
                                <div key={feedback.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs">
                                          {feedback.giver.firstname[0]}
                                          {feedback.giver.lastname[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium text-sm">
                                        {feedback.giver.firstname} {feedback.giver.lastname}
                                      </span>
                                    </div>
                                    <div>{renderStarRating(feedback.rating)}</div>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    For: <span className="font-medium">{feedback.transaction.listing.title}</span>
                                  </p>
                                  {feedback.comment && (
                                    <p className="text-sm italic text-gray-500 dark:text-gray-400">
                                      {feedback.comment}
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-400 mt-2">{formatDate(feedback.createdAt)}</p>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">No Feedback Yet</h3>
                            <p className="text-sm text-gray-500">You have not received any feedback yet.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Donations Tab */}
                <TabsContent value="donations" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Donation Listings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Donation Listings</CardTitle>
                        <CardDescription>Items you have offered to donate</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {safeArray(profile.donationListings).length > 0 ? (
                          <div className="space-y-4">
                            {safeArray(profile.donationListings).map((listing) => (
                              <div
                                key={listing.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                              >
                                <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                  <Image
                                    src={listing.imageUrls?.[0] || "/placeholder.svg?height=64&width=64"}
                                    alt={listing.title}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{listing.title}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {listing.description}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <Badge className={`${getStatusColor(listing.status)} text-xs`}>
                                      {listing.status}
                                    </Badge>
                                    <span className="mx-2 text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-400">{formatDate(listing.createdAt)}</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/browse-donations/${listing.id}`}>
                                    <ChevronRight className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">No Donations Yet</h3>
                            <p className="text-sm text-gray-500">You have not created any donation listings yet.</p>
                            <Button className="mt-4" asChild>
                              <Link href="/donate">Create Donation</Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Requirement Listings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Requirement Listings</CardTitle>
                        <CardDescription>Items you are looking for</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {safeArray(profile.requirementListings).length > 0 ? (
                          <div className="space-y-4">
                            {safeArray(profile.requirementListings).map((listing) => (
                              <div
                                key={listing.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                              >
                                <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                  <Image
                                    src={listing.imageUrls?.[0] || "/placeholder.svg?height=64&width=64"}
                                    alt={listing.title}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{listing.title}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {listing.description}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <Badge className={`${getStatusColor(listing.status)} text-xs`}>
                                      {listing.status}
                                    </Badge>
                                    <span className="mx-2 text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-400">Urgency: {listing.urgency}</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/requirements/${listing.id}`}>
                                    <ChevronRight className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">No Requirements Yet</h3>
                            <p className="text-sm text-gray-500">You have not created any requirement listings yet.</p>
                            <Button className="mt-4" asChild>
                              <Link href="/requirements">Create Requirement</Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Requests Tab */}
                <TabsContent value="requests" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Donation Requests</CardTitle>
                      <CardDescription>Requests you have made for items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {safeArray(profile.sentRequests).length > 0 ? (
                        <div className="space-y-4">
                          {safeArray(profile.sentRequests).map((request) => (
                            <div
                              key={request.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                            >
                              <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                <Image
                                  src={request.listing.imageUrls?.[0] || "/placeholder.svg?height=64&width=64"}
                                  alt={request.listing.title}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{request.listing.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{request.message}</p>
                                <div className="flex items-center mt-1">
                                  <Badge className={`${getStatusColor(request.status)} text-xs`}>
                                    {request.status}
                                  </Badge>
                                  <span className="mx-2 text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-400">{formatDate(request.createdAt)}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/browse-donations/${request.listing.id}`}>
                                  <ChevronRight className="h-5 w-5" />
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-lg font-medium mb-1">No Requests Yet</h3>
                          <p className="text-sm text-gray-500">You have not made any donation requests yet.</p>
                          <Button className="mt-4" asChild>
                            <Link href="/browse-donations">Browse Donations</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Feedback Tab */}
                <TabsContent value="feedback" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Received Feedback */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Feedback Received</CardTitle>
                        <CardDescription>Feedback from people you have donated to</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {safeArray(profile.receivedFeedback).length > 0 ? (
                          <div className="space-y-4">
                            {safeArray(profile.receivedFeedback).map((feedback) => (
                              <div key={feedback.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs">
                                        {feedback.giver.firstname[0]}
                                        {feedback.giver.lastname[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">
                                      {feedback.giver.firstname} {feedback.giver.lastname}
                                    </span>
                                  </div>
                                  <div>{renderStarRating(feedback.rating)}</div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                  For: <span className="font-medium">{feedback.transaction.listing.title}</span>
                                </p>
                                {feedback.comment && (
                                  <p className="text-sm italic text-gray-500 dark:text-gray-400">{feedback.comment}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">{formatDate(feedback.createdAt)}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">No Feedback Received</h3>
                            <p className="text-sm text-gray-500">You have not received any feedback yet.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Given Feedback */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Feedback Given</CardTitle>
                        <CardDescription>Feedback you have given to donors</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {safeArray(profile.givenFeedback).length > 0 ? (
                          <div className="space-y-4">
                            {safeArray(profile.givenFeedback).map((feedback) => (
                              <div key={feedback.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium">{feedback.transaction.listing.title}</p>
                                  <div>{renderStarRating(feedback.rating)}</div>
                                </div>
                                {feedback.comment && (
                                  <p className="text-sm italic text-gray-500 dark:text-gray-400">{feedback.comment}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">{formatDate(feedback.createdAt)}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">No Feedback Given</h3>
                            <p className="text-sm text-gray-500">You have not given any feedback yet.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Donations Made */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Donations Made</CardTitle>
                        <CardDescription>Items you have donated to others</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {safeArray(profile.donations).length > 0 ? (
                          <div className="space-y-4">
                            {safeArray(profile.donations).map((transaction) => (
                              <div
                                key={transaction.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                              >
                                <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                  <Image
                                    src={transaction.listing.imageUrls?.[0] || "/placeholder.svg?height=64&width=64"}
                                    alt={transaction.listing.title}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{transaction.listing.title}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    To: {transaction.receiver?.firstname} {transaction.receiver?.lastname}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <Badge
                                      className={
                                        transaction.isReceived
                                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      }
                                    >
                                      {transaction.isReceived ? "Received" : "In Transit"}
                                    </Badge>
                                    <span className="mx-2 text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-400">{formatDate(transaction.completedAt)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Send className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">No Donations Made</h3>
                            <p className="text-sm text-gray-500">You have not completed any donations yet.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Donations Received */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Donations Received</CardTitle>
                        <CardDescription>Items you have received from others</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {safeArray(profile.receivedDonations).length > 0 ? (
                          <div className="space-y-4">
                            {safeArray(profile.receivedDonations).map((transaction) => (
                              <div
                                key={transaction.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                              >
                                <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                  <Image
                                    src={transaction.listing.imageUrls?.[0] || "/placeholder.svg?height=64&width=64"}
                                    alt={transaction.listing.title}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{transaction.listing.title}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    From: {transaction.donor?.firstname} {transaction.donor?.lastname}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <Badge
                                      className={
                                        transaction.isReceived
                                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      }
                                    >
                                      {transaction.isReceived ? "Received" : "In Transit"}
                                    </Badge>
                                    <span className="mx-2 text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-400">{formatDate(transaction.completedAt)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">No Donations Received</h3>
                            <p className="text-sm text-gray-500">You have not received any donations yet.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

