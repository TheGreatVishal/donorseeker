"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Check, X, ArrowLeft, Gift, FileQuestion, Mail, Phone, Calendar, Star, Tag, Info, Loader2, CheckCircle, XCircle, Clock, User, ChevronLeft, ChevronRight, Shield, AlertTriangle, Eye, MessageCircle, Share2, Heart } from 'lucide-react'
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
// import { toast } from "@/components/ui/use-toast"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"

type Listing = {
  id: number
  title: string
  description: string
  category: string
  condition?: string
  urgency?: string
  imageUrls: string[]
  contact: string
  status: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  listingType: "donation" | "requirement"
  user: {
    id: number
    firstname: string
    lastname: string
    email: string
    contact: string
    donationCount: number
    totalRating: number
    ratingCount: number
  }
}

export default function ListingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [, setActiveTab] = useState("details")

  const id = params.id as string
  const listingType = searchParams.get("type") || ""

  // Redirect if not admin
  useEffect(() => {
    if (status === "authenticated" && !session?.user?.isAdmin) {
      router.push("/")
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        // variant: "destructive",
      })
    }
  }, [session, status, router])

  // Fetch listing details
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`/api/admin/listings/${id}?type=${listingType}`)
        if (!response.ok) {
          throw new Error("Failed to fetch listing details")
        }

        const data = await response.json()
        setListing(data.listing)
      } catch (error) {
        console.error("Error fetching listing details:", error)
        toast({
          title: "Error",
          description: "Failed to fetch listing details",
          // variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.isAdmin && id) {
      fetchListingDetails()
    }
  }, [id, listingType, session, status])

  // Handle approve/reject
  const handleAction = async (action: "approve" | "reject") => {
    if (!listing) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingType: listing.listingType,
          action,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} listing`)
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: data.message,
      })

      // Update local state
      setListing({
        ...listing,
        isApproved: action === "approve",
        status: action === "approve" ? "APPROVED" : "REJECTED",
      })
    } catch (error) {
      console.error(`Error ${action}ing listing:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} listing`,
        // variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // const getInitials = (name: string) => {
  //   return name
      // .split(" ")
      // .map((part) => part[0])
      // .join("")
      // .toUpperCase()
      // .substring(0, 2)
  // }

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!listing?.imageUrls?.length) return;
    
    if (direction === 'next') {
      setActiveImageIndex((prev) => 
        prev === listing.imageUrls.length - 1 ? 0 : prev + 1
      );
    } else {
      setActiveImageIndex((prev) => 
        prev === 0 ? listing.imageUrls.length - 1 : prev - 1
      );
    }
  }

  if (status === "loading" || (status === "authenticated" && !session?.user?.isAdmin)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading listing details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Listing not found</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            The listing you are looking for does not exist or has been removed.
          </p>
          <Button variant="default" className="mt-6" onClick={() => router.push('/admin/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Calculate average rating
  const averageRating =
    listing.user.ratingCount > 0 ? (listing.user.totalRating / listing.user.ratingCount).toFixed(1) : "N/A"
  
  // Calculate rating as percentage for progress bar
  const ratingPercentage = 
    listing.user.ratingCount > 0 
      ? (listing.user.totalRating / listing.user.ratingCount) * 20 
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-10">
      {/* Header with background */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge
                variant={listing.isApproved ? "default" : "outline"}
                className="flex items-center gap-1 px-3 py-1 text-sm"
              >
                {listing.isApproved ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Approved
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Pending Approval
                  </>
                )}
              </Badge>
              
              {listing.isApproved ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isProcessing}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Unapprove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unapprove this listing?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the listing from public view. Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleAction("reject")}>
                        Unapprove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm" disabled={isProcessing}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve this listing?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will make the listing visible to all users. Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleAction("approve")}>
                        Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content - Left side */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                {listing.listingType === "donation" ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200">
                    <Gift className="mr-1 h-3 w-3" />
                    Donation
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200">
                    <FileQuestion className="mr-1 h-3 w-3" />
                    Request
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {listing.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Posted {format(new Date(listing.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Image Gallery */}
            {listing.imageUrls && listing.imageUrls.length > 0 && (
              <Card className="mb-6 overflow-hidden border-none shadow-md">
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={listing.imageUrls[activeImageIndex] || "/placeholder.svg?height=400&width=600"}
                    alt={listing.title}
                    fill
                    className="object-contain"
                  />
                  
                  {listing.imageUrls.length > 1 && (
                    <>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                        onClick={() => navigateImage('prev')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                        onClick={() => navigateImage('next')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                
                {listing.imageUrls.length > 1 && (
                  <div className="flex gap-2 p-2 overflow-x-auto bg-muted/30">
                    {listing.imageUrls.map((url, index) => (
                      <button
                        key={index}
                        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                          index === activeImageIndex 
                            ? "ring-2 ring-primary scale-105" 
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={url || "/placeholder.svg?height=64&width=64"}
                          alt={`${listing.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Tabs for Details and Actions */}
            <Tabs defaultValue="details" className="mb-6" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="actions">Admin Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Info className="mr-2 h-5 w-5 text-primary" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{listing.description}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Tag className="mr-2 h-5 w-5 text-primary" />
                      Listing Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Category</span>
                        <span className="text-muted-foreground">{listing.category}</span>
                      </div>
                      
                      {listing.listingType === "donation" && listing.condition && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">Condition</span>
                          <span className="text-muted-foreground">{listing.condition}</span>
                        </div>
                      )}
                      
                      {listing.listingType === "requirement" && listing.urgency && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">Urgency</span>
                          <Badge 
                            variant="outline" 
                            className={
                              listing.urgency === "HIGH" 
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200" 
                                : listing.urgency === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200"
                            }
                          >
                            {listing.urgency}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Posted Date</span>
                        <span className="text-muted-foreground">{format(new Date(listing.createdAt), "PPP")}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Contact</span>
                        <span className="text-muted-foreground">{listing.contact}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Status</span>
                        <Badge 
                          variant={listing.isApproved ? "default" : "outline"}
                          className={listing.isApproved ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" : ""}
                        >
                          {listing.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Listing ID</span>
                        <span className="text-muted-foreground">#{listing.id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="actions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-primary" />
                      Admin Actions
                    </CardTitle>
                    <CardDescription>
                      Manage this listings approval status and visibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                      <div>
                        <h3 className="font-medium">Current Status</h3>
                        <p className="text-sm text-muted-foreground">
                          {listing.isApproved 
                            ? "This listing is approved and visible to users" 
                            : "This listing is pending approval and not visible to users"}
                        </p>
                      </div>
                      <Badge 
                        variant={listing.isApproved ? "default" : "outline"}
                        className="px-3 py-1"
                      >
                        {listing.isApproved ? (
                          <>
                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                            Approved
                          </>
                        ) : (
                          <>
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-4 rounded-lg border border-dashed">
                        <h3 className="font-medium flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Approve Listing
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          Make this listing visible to all users on the platform
                        </p>
                        <Button 
                          className="w-full" 
                          disabled={listing.isApproved || isProcessing}
                          onClick={() => handleAction("approve")}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="p-4 rounded-lg border border-dashed">
                        <h3 className="font-medium flex items-center">
                          <XCircle className="mr-2 h-4 w-4 text-red-600" />
                          Unapprove Listing
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          Hide this listing from users and mark it as pending
                        </p>
                        <Button 
                          variant="destructive" 
                          className="w-full" 
                          disabled={!listing.isApproved || isProcessing}
                          onClick={() => handleAction("reject")}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <X className="mr-2 h-4 w-4" />
                              Unapprove
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - Right side */}
          <div className="w-full md:w-80 space-y-6">
            {/* User Card */}
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  User Information
                </CardTitle>
                <CardDescription>Details about the listing creator</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                    {listing.user.firstname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{listing.user.firstname + " " + listing.user.lastname}</p>
                    <p className="text-sm text-muted-foreground">User ID: {listing.user.id}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{listing.user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{listing.user.contact}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{listing.user.donationCount} donations made</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">User Rating</span>
                    <span className="text-sm font-medium flex items-center">
                      <Star className="h-3.5 w-3.5 text-yellow-500 mr-1 fill-yellow-500" />
                      {averageRating}
                    </span>
                  </div>
                  <Progress value={ratingPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    Based on {listing.user.ratingCount} reviews
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center border-t pt-4">
                <div className="grid grid-cols-3 gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex items-center justify-center">
                    <MessageCircle className="h-4 w-4" />
                    <span className="sr-only">Message</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center justify-center">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Profile</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center justify-center">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Quick Actions */}
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {!listing.isApproved ? (
                  <Button 
                    className="w-full" 
                    onClick={() => handleAction("approve")}
                    disabled={isProcessing}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Listing
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={() => handleAction("reject")}
                    disabled={isProcessing}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Unapprove Listing
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
            
            {/* Listing Stats */}
            <Card className="bg-primary/5 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Listing Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-3 bg-background rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Posted</span>
                    <span className="font-medium">{format(new Date(listing.createdAt), "MMM d")}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-3 bg-background rounded-lg">
                    <Heart className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Interested</span>
                    <span className="font-medium">0 Users</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-3 bg-background rounded-lg">
                    <Eye className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Views</span>
                    <span className="font-medium">0</span>
                  </div>
                  
                  {/* <div className="flex flex-col items-center justify-center p-3 bg-background rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Messages</span>
                    <span className="font-medium">0</span>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
