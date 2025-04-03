"use client"

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
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { markDonationReceived } from "@/lib/action"

interface ReceiveConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionId: number
  onConfirmComplete: () => void
}

export function ReceiveConfirmationDialog({
  open,
  onOpenChange,
  transactionId,
  onConfirmComplete,
}: ReceiveConfirmationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)

      await markDonationReceived(transactionId)

      toast({
        title: "Donation Received",
        description: "You've confirmed receipt of this donation. Please provide feedback on your experience.",
      })

      onConfirmComplete()
      onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Receipt</DialogTitle>
          <DialogDescription>
            Please confirm that you have received this donation. This will mark the transaction as complete.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <p className="text-sm text-muted-foreground">By confirming receipt, you acknowledge that:</p>
          <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
            <li>You have physically received the donated item</li>
            <li>The item matches the description provided by the donor</li>
            <li>The transaction is now complete</li>
          </ul>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Receipt"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

