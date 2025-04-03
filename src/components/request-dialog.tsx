"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface RequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingId: number
  onRequestComplete: () => void
}

export function RequestDialog({ open, onOpenChange, listingId, onRequestComplete }: RequestDialogProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please provide a message to the donor explaining why you need this item.",
        // variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/donations/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request")
      }

      toast({
        title: "Request Sent",
        description: "Your request has been sent to the donor. You'll be notified when they respond.",
      })

      onRequestComplete()
      onOpenChange(false)
      setMessage("")
    } catch (error) {
      console.error("Error submitting request:", error)
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Failed to submit your request. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request This Donation</DialogTitle>
            <DialogDescription>
              Send a message to the donor explaining why you need this item and how it will help you.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6">
            <Textarea
              placeholder="I would like to request this item because..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

