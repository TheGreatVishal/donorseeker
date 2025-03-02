import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, password } = await request.json()

    if (!email || !otp || !password) {
      return NextResponse.json({ error: "Email, OTP, and password are required" }, { status: 400 })
    }

    // Validate password strength
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return NextResponse.json({
        error: "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character"
      }, { status: 400 });
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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Delete the OTP verification record
    await prisma.oTPVerification.delete({
      where: { email },
    })

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ error: "An error occurred while resetting password" }, { status: 500 })
  }
}

