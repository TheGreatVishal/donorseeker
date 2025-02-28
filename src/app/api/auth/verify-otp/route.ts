import { type NextRequest, NextResponse } from "next/server"
import prisma from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    // Find the OTP verification record
    const otpVerification = await prisma.oTPVerification.findUnique({
      where: { email },
    })

    if (!otpVerification) {
      return NextResponse.json({ error: "No OTP found for this email" }, { status: 400 })
    }

    // Check if OTP has expired
    if (new Date() > otpVerification.expiresAt) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one" }, { status: 400 })
    }

    // Verify OTP
    if (otpVerification.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "An error occurred while verifying OTP" }, { status: 500 })
  }
}

