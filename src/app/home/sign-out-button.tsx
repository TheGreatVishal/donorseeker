"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <Button onClick={handleSignOut} variant="outline" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50">
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  )
}

