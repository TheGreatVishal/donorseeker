import { type NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(3).max(15),
  email: z.string().email().max(40),
  password: z.string()
  .min(8, "Password must be at least 8 characters long")
  .max(30, "Password cannot exceed 30 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  contact: z.string().min(7).max(15),
  isAdmin: z.boolean().default(false),
  adminKey: z.string().optional(),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const parsedData = signupSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors[0].message }, { status: 400 });
    }

    let { username, email, password, contact, isAdmin, otp, adminKey } = parsedData.data;

    // Check if username or email already exists
    const [existingUsername, existingEmail] = await Promise.all([
      prisma.user.findUnique({ where: { username }, select: { id: true } }),
      prisma.user.findUnique({ where: { email }, select: { id: true } }),
    ]);

    if (existingUsername) return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    if (existingEmail) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    // Verify OTP
    const otpRecord = await prisma.oTPVerification.findUnique({ where: { email } });

    if (!otpRecord || otpRecord.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Verify Admin Key
    if (isAdmin) {
      if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        return NextResponse.json({ error: "Invalid Admin Key" }, { status: 403 });
      }
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        contact,
        isAdmin,
        verified: true, // Email verified
      },
    });

    // Delete OTP record after use
    await prisma.oTPVerification.delete({ where: { email } }).catch(() => {});

    // Clear sensitive variables from memory
    username = email = password = contact = otp = adminKey = "";

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin },
    });

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "An error occurred while registering user" }, { status: 500 });
  }
}
