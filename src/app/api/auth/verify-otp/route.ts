import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import { logApiActivity } from "@/utils/logApiActivity"

export async function POST(request: NextRequest) {
  const endpoint = "/api/auth/verify-otp"
  const section = "Auth"
  const requestType = "POST"

  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Email or OTP missing in request",
      })
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    // Check OTP record
    const otpVerification = await prisma.oTPVerification.findUnique({
      where: { email },
    })

    if (!otpVerification) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "No OTP found for this email",
      })
      return NextResponse.json({ error: "No OTP found for this email" }, { status: 400 })
    }

    // Expiry check
    if (new Date() > otpVerification.expiresAt) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "OTP expired",
      })
      return NextResponse.json({ error: "OTP has expired. Please request a new one" }, { status: 400 })
    }

    // Match check
    if (otpVerification.otp !== otp) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Invalid OTP provided",
      })
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid
    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "OTP verified successfully",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying OTP:", error)

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Internal error while verifying OTP - ${error instanceof Error ? error.message : "unknown error"}`,
    })

    return NextResponse.json({ error: "An error occurred while verifying OTP" }, { status: 500 })
  }
}
