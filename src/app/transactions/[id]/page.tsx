"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Check, Download, MessageSquare, Star, Truck, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ReceiveConfirmationDialog } from "@/components/receive-confirmation-dialog"
import { FeedbackForm } from "@/components/feedback-form"
import Image from "next/image"

interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  contact: string
  donationCount?: number
  totalRating?: number
  ratingCount?: number
}

interface Listing {
  id: number
  title: string
  description: string
  category: string
  condition: string
  imageUrls: string[]
  status: string
}

interface Request {
  id: number
  message: string
  status: string
  createdAt: string
}

interface Feedback {
  id: number
  rating: number
  comment?: string
  createdAt: string
}

interface Transaction {
  id: number
  completedAt: string
  isReceived: boolean
  listingId: number
  requestId: number
  donorId: number
  receiverId: number
  listing: Listing
  donor: User
  receiver: User
  request: Request
  feedback?: Feedback
}

export default function TransactionPage() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/transactions/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch transaction details")
        }

        const data = await response.json()
        setTransaction(data.transaction)
        
        // Show feedback form if item is received but no feedback yet
        if (data.transaction.isReceived && !data.transaction.feedback) {
          setShowFeedbackForm(true)
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching transaction details:", error)
        setError("Failed to load transaction details. Please try again later.")
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTransactionDetails()
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

  const handleReceiveConfirmed = () => {
    // Update the transaction in the UI
    if (transaction) {
      setTransaction({
        ...transaction,
        isReceived: true,
      })
      setShowFeedbackForm(true)
    }
  }

  const handleFeedbackSubmitted = () => {
    // Refresh the page to show the submitted feedback
    router.refresh()
  }

  const calculateAverageRating = (user: User) => {
    if (!user.ratingCount || user.ratingCount === 0) return 0
    return user.totalRating! / user.ratingCount
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-20 px-4">
        <h1 className="text-2xl font-bold text-red-500">{error || "Transaction not found"}</h1>
        <Button onClick={handleGoBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  // Determine if the current user is the receiver
  const isReceiver = true // This would be determined by comparing the user's ID with transaction.receiverId

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={handleGoBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Transaction Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Transaction Details</CardTitle>
                    <CardDescription>
                      Transaction #{transaction.id} • Created on {formatDate(transaction.completedAt)}
                    </CardDescription>
                  </div>
                  <Badge variant={transaction.isReceived ? "default" : "secondary"}>
                    {transaction.isReceived ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{transaction.listing.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-square relative rounded-md overflow-hidden border">
                      <Image
                        src={transaction.listing.imageUrls[0] || "/placeholder.svg?height=300&width=300"}
                        alt={transaction.listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Category</p>
                        <p>{transaction.listing.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Condition</p>
                        <p>{transaction.listing.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <p>{transaction.listing.status}</p>
                      </div>
                    </div>
                  </div>
                  </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Request Sent</p>
                        <p className="text-sm text-muted-foreground">{formatDate(transaction.request.createdAt)}</p>
                        <p className="mt-1 text-sm">{transaction.request.message}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Request Accepted</p>
                        <p className="text-sm text-muted-foreground">{formatDate(transaction.completedAt)}</p>
                      </div>
                    </div>
                    
                    {transaction.isReceived && (
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Item Received</p>
                          <p className="text-sm text-muted-foreground">
                            The recipient has confirmed receipt of this donation
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {transaction.feedback && (
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Feedback Provided</p>
                          <p className="text-sm text-muted-foreground">{formatDate(transaction.feedback.createdAt)}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < transaction.feedback!.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {transaction.feedback.comment && (
                            <p className="mt-1 text-sm">{transaction.feedback.comment}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Feedback Form */}
            {showFeedbackForm && !transaction.feedback && isReceiver && (
              <FeedbackForm 
                transactionId={transaction.id} 
                onFeedbackSubmitted={handleFeedbackSubmitted} 
                onCancel={() => setShowFeedbackForm(false)} 
              />
            )}
          </div>
          
          {/* Right Column - Contact Information */}
          <div className="space-y-6">
            {/* Donor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Donor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{`${transaction.donor.firstname[0]}${transaction.donor.lastname[0]}`}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{`${transaction.donor.firstname} ${transaction.donor.lastname}`}</p>
                    {transaction.donor.ratingCount && transaction.donor.ratingCount > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>
                          {calculateAverageRating(transaction.donor).toFixed(1)} ({transaction.donor.ratingCount} reviews)
                        </span>
                      </div>
                    )}
                    {transaction.donor.donationCount && transaction.donor.donationCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {transaction.donor.donationCount} donations
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{transaction.donor.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{transaction.donor.contact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Receiver Information */}
            <Card>
              <CardHeader>
                <CardTitle>Receiver Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{`${transaction.receiver.firstname[0]}${transaction.receiver.lastname[0]}`}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{`${transaction.receiver.firstname} ${transaction.receiver.lastname}`}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{transaction.receiver.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{transaction.receiver.contact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            {isReceiver && !transaction.isReceived && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => setReceiveDialogOpen(true)}
                  >
                    <Check className="mr-2 h-4 w-4" /> Confirm Receipt
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Download Receipt */}
            {transaction.isReceived && (
              <Card>
                <CardHeader>
                  <CardTitle>Receipt</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Receipt
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Receive Confirmation Dialog */}
      <ReceiveConfirmationDialog 
        open={receiveDialogOpen} 
        onOpenChange={setReceiveDialogOpen} 
        transactionId={transaction.id} 
        onConfirmComplete={handleReceiveConfirmed} 
      />
    </div>
  )
}

