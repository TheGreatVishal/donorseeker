import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import bcrypt from "bcryptjs"
import { signJwtAccessToken } from "../../../../lib/jwt"

export async function POST(request: Request) {
  try {
    // console.log("=====================================")
    // console.log("api/auth/login/route.ts")
    const body = await request.json()
    const { email, password } = body

    // console.log("Email:", email)
    // console.log("Password:", password)

    const user = await prisma.user.findUnique({
      where: { email: email },
    })

    // console.log("User:", user)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    // Extract user details manually without using spread operator
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    const accessToken = signJwtAccessToken(userWithoutPassword)

    const response = NextResponse.redirect(new URL("/home", request.url)) // Use a relative path

    // console.log("Access Token:", accessToken)
    // console.log("Response:", response)

    // console.log("Setting cookies...")

    response.cookies.set({
      name: "token",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 30 days
      path: "/", // Ensure the path is root to access across the application
    })
    // console.log("Cookies set.", response.cookies)

    // console.log("=====================================")

    return response // Return the redirect response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
