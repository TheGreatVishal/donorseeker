import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DonationSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container px-4 md:px-6 max-w-md mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Donation Listed Successfully!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your generosity. Your donation has been submitted and is pending approval.
          </p>
          <div className="flex flex-col gap-4">
            <Button
              asChild
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <Link href="/browse-donations">View All Donations</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            >
              <Link href="/home">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

