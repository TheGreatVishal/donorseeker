import type { DonationRequest } from "@prisma/client"

export type ScoredDonationRequest = DonationRequest & {
  needinessScore: number
  seeker: {
    id: string
    firstname: string
    lastname: string
    email: string
    contact: string
  }
}

