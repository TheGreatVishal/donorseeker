import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import { sendEmail } from "../../../../lib/mail"
import { logApiActivity } from "@/utils/logApiActivity"

export async function POST(request: NextRequest) {
  const endpoint = "/api/auth/send-otp"
  const section = "Auth"
  const requestType = "POST"

  try {
    const { email } = await request.json()

    if (!email) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Email not provided",
      })
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Invalid email format: ${email}`,
      })
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Email already registered: ${email}`,
      })
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiration time (15 minutes from now)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    // Store OTP in the database
    await prisma.oTPVerification.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    })

    // Send OTP via email
    await sendEmail(email, otp)

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: `OTP sent to ${email}`,
    })

    return NextResponse.json({ success: true, message: "OTP sent successfully" })
  } catch (error) {
    console.error("Error sending OTP:", error)

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Internal error sending OTP - ${error instanceof Error ? error.message : "unknown error"}`,
    })

    return NextResponse.json({ error: "An error occurred while sending OTP" }, { status: 500 })
  }
}
