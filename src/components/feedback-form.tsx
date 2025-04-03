"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

type Feedback = {
  rating: number
  comment: string
}

type FeedbackFormProps = {
  transactionId: number
  onFeedbackSubmitted: (feedback: Feedback) => void
  onCancel: () => void
}

export function FeedbackForm({ transactionId, onFeedbackSubmitted, onCancel }: FeedbackFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating < 1) {
      toast({
        title: "Error",
        description: "Please select a rating",
        // variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/transactions/${transactionId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit feedback")
      }

      const data = await response.json()

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! The donor's profile has been updated.",
      })

      onFeedbackSubmitted(data.feedback)
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">How would you rate this donation?</h4>
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`mx-1 p-1 rounded-full transition-all ${rating >= value ? "scale-110" : "opacity-50"}`}
            >
              <Star className={`h-6 w-6 ${rating >= value ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            </button>
          ))}
        </div>
        <p className="text-center text-sm font-medium">
          {rating === 1 && "Poor"}
          {rating === 2 && "Fair"}
          {rating === 3 && "Good"}
          {rating === 4 && "Very Good"}
          {rating === 5 && "Excellent"}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="feedback-comment" className="text-sm font-medium">
          Share your thoughts (optional)
        </label>
        <Textarea
          id="feedback-comment"
          placeholder="What was your experience like? Was the item as described?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </div>
  )
}

