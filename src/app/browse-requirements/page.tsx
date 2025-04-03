import type { Metadata } from "next"
import RequirementsList from "./requirements-list"

export const metadata: Metadata = {
  title: "Browse Requirements | Donor Seeker",
  description: "Browse requirements posted by people in need",
}

export default function BrowseRequirementsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Requirements</h1>
      <RequirementsList />
    </main>
  )
}

