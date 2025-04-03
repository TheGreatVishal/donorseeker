"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Clock, Star, ChevronDown, ChevronUp, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Transaction type based on the schema
type Transaction = {
  id: number
  completedAt: string
  isReceived: boolean
  listing: {
    id: number
    title: string
    description: string
    category: string
    condition: string
    imageUrls: string[]
  }
  request: {
    id: number
    message: string
    status: string
  }
  donor: {
    id: number
    firstname: string
    lastname: string
    email: string
    contact: string
  }
  receiver: {
    id: number
    firstname: string
    lastname: string
    email: string
    contact: string
  }
  feedback?: {
    id: number
    rating: number
    comment: string | null
  }
}

export default function TransactionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [feedbackRating, setFeedbackRating] = useState<number>(5)
  const [feedbackComment, setFeedbackComment] = useState<string>("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/loginSystem/login")
    }
  }, [status, router])

  // Fetch transactions data
  useEffect(() => {
    if (status === "authenticated") {
      fetchTransactions()
    }
  }, [status])

  // Function to fetch transactions from the API
  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/transactions")
      console.log("Fetching transactions from API", response);

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch transactions")
      }

      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load transactions. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedTransaction(expandedTransaction === id ? null : id)
  }

  // Update the handleConfirmReceived function to open the feedback dialog automatically after confirming receipt
  const handleConfirmReceived = async (transactionId: number) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/transactions/${transactionId}/receive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to confirm receipt")
      }

      // Get the updated transaction data
      // const result = await response.json()

      // Update local state
      const updatedTransactions = transactions.map((t) => (t.id === transactionId ? { ...t, isReceived: true } : t))
      setTransactions(updatedTransactions)

      // Find the updated transaction to open feedback dialog
      const updatedTransaction = updatedTransactions.find((t) => t.id === transactionId)
      if (updatedTransaction) {
        openFeedbackDialog(updatedTransaction)
      }

      toast({
        title: "Success",
        description: "Item marked as received. Please leave feedback for the donor.",
      })
    } catch (error) {
      console.error("Error confirming receipt:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to confirm receipt. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update the handleSubmitFeedback function to properly handle the feedback submission
  const handleSubmitFeedback = async () => {
    if (!selectedTransaction) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/transactions/${selectedTransaction.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: feedbackRating,
          comment: feedbackComment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit feedback")
      }

      const data = await response.json()

      // Update local state
      setTransactions(
        transactions.map((t) =>
          t.id === selectedTransaction.id
            ? {
              ...t,
              feedback: data.feedback,
            }
            : t,
        ),
      )

      setSelectedTransaction(null)
      setFeedbackRating(5)
      setFeedbackComment("")

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! The donor's profile has been updated.",
      })

      // Refresh transactions to get updated data
      fetchTransactions()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit feedback. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openFeedbackDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setFeedbackRating(5)
    setFeedbackComment("")
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true
    if (activeTab === "donated") {
      console.log("Donated Tab: ", session?.user?.id, transaction.donor.id, transaction.receiver.id);
      return Number(session?.user?.id) === transaction.donor.id

    }
    if (activeTab === "received") return Number(session?.user?.id) === transaction.receiver.id
    if (activeTab === "pending") return !transaction.isReceived
    if (activeTab === "completed") return transaction.isReceived
    return true
  })

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
          My Transactions
        </h1>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="donated">Donated</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
                <p className="mt-2 text-gray-500">
                  {activeTab === "all"
                    ? "You don't have any transactions yet."
                    : `You don't have any ${activeTab} transactions.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => {
                  const isExpanded = expandedTransaction === transaction.id
                  const isUserDonor = Number(session?.user?.id) === transaction.donor.id
                  const otherParty = isUserDonor ? transaction.receiver : transaction.donor
                  const formattedDate = new Date(transaction.completedAt).toLocaleDateString()

                  return (
                    <Card key={transaction.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{transaction.listing.title}</CardTitle>
                            <CardDescription>
                              {isUserDonor ? "Donated to" : "Received from"}: {otherParty.firstname}{" "}
                              {otherParty.lastname}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge
                              className={
                                transaction.isReceived ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {transaction.isReceived ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" /> Completed
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 mr-1" /> Pending
                                </>
                              )}
                            </Badge>
                            <span className="text-sm text-gray-500 mt-1">{formattedDate}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 rounded-md overflow-hidden">
                            <Image
                              src={transaction.listing.imageUrls[0] || "/placeholder.svg?height=80&width=80"}
                              alt={transaction.listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 line-clamp-2">{transaction.listing.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{transaction.listing.category}</Badge>
                              <Badge variant="outline">{transaction.listing.condition}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      {/* Update the CardFooter section to improve the feedback button visibility */}
                      <CardFooter className="flex justify-between pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(transaction.id)}
                          className="text-gray-500"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" /> Less details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" /> More details
                            </>
                          )}
                        </Button>

                        <div className="flex gap-2">
                          {!isUserDonor && !transaction.isReceived && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmReceived(transaction.id)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Processing..." : "Confirm Receipt"}
                            </Button>
                          )}

                          {transaction.isReceived && !transaction.feedback && !isUserDonor && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openFeedbackDialog(transaction)}
                              className="border-pink-500 text-pink-600 hover:bg-pink-50"
                            >
                              <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" /> Leave Feedback
                            </Button>
                          )}

                          {/* View Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            onClick={() => router.push(`/transactions/${transaction.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardFooter>

                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 bg-gray-50">
                          <Separator className="mb-4" />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium mb-2">Request Details</h3>
                              <div className="bg-white p-3 rounded-md border">
                                <div className="flex items-start gap-2">
                                  <MessageSquare className="h-4 w-4 mt-1 text-gray-400" />
                                  <p className="text-sm text-gray-700">{transaction.request.message}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                              <div className="bg-white p-3 rounded-md border">
                                <p className="text-sm">
                                  <span className="font-medium">
                                    {otherParty.firstname} {otherParty.lastname}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-600">{otherParty.email}</p>
                                <p className="text-sm text-gray-600">{otherParty.contact}</p>
                              </div>
                            </div>
                          </div>

                          {transaction.feedback && (
                            <div className="mt-6">
                              <h3 className="text-sm font-medium mb-2">Feedback</h3>
                              <div className="bg-white p-3 rounded-md border">
                                <div className="flex items-center mb-2">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < transaction.feedback!.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                      />
                                    ))}
                                  <span className="ml-2 text-sm font-medium">{transaction.feedback.rating}/5</span>
                                </div>
                                {transaction.feedback.comment && (
                                  <p className="text-sm text-gray-700">{transaction.feedback.comment}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {/* Update the feedback dialog to make it more user-friendly */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              Share your experience with the donation you received from {selectedTransaction?.donor.firstname}. Your
              feedback helps build trust in our community.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">How would you rate this donation?</h4>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFeedbackRating(rating)}
                    className={`mx-1 p-1 rounded-full transition-all ${feedbackRating >= rating ? "scale-110" : "opacity-50"
                      }`}
                  >
                    <Star
                      className={`h-8 w-8 ${feedbackRating >= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-medium">
                {feedbackRating === 1 && "Poor"}
                {feedbackRating === 2 && "Fair"}
                {feedbackRating === 3 && "Good"}
                {feedbackRating === 4 && "Very Good"}
                {feedbackRating === 5 && "Excellent"}
              </p>
            </div>

            <div>
              <Label htmlFor="comment" className="text-sm font-medium">
                Share your thoughts (optional)
              </Label>
              <Textarea
                id="comment"
                placeholder="What was your experience like? Was the item as described?"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setSelectedTransaction(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

