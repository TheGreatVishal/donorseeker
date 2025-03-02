import { type NextRequest, NextResponse } from "next/server"
import prisma from '../../../../lib/prisma';
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, contact, isAdmin, otp, adminKey } = await request.json()

	// console.log("=====================================================");
	
	// console.log("(Register api)...");
	// console.log("username: ", username);
	// console.log("email: ", email);
	// console.log("password: ", password);
	// console.log("contact: ", contact);
	// console.log("isAdmin: ", isAdmin);
	// console.log("otp: ", otp);
	// console.log("adminKey: ", adminKey);

	
    // Validate required fields
    if (!username || !email || !password || !contact) {
		return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }
	
	// Validate Username length
	if (username.length < 3 || username.length > 15) {
	 return NextResponse.json({ error: "Username must be between 7 and 15 characters" }, { status: 400 })
   }
	
 
   // Validate Username length
	if (otp.length > 6) {
	 return NextResponse.json({ error: "OTP must be equal to 6 characters" }, { status: 400 })
   }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
		where: { username },
		select: { id: true },
    })

    if (existingUsername) {
		return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }
	
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
		where: { email },
		select: { id: true },
    })
	
    if (existingEmail) {
		return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }
	
    // Validate contact number length
    if (contact.length < 7 || contact.length > 15) {
      return NextResponse.json({ error: "Contact number must be between 7 and 15 characters" }, { status: 400 })
    }

	// Verify OTP from oTPVerification table
	const otpRecord = await prisma.oTPVerification.findUnique({
		where: { email },
	});
	
	if (!otpRecord || otpRecord.otp !== otp) {
		return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
	}
	
	// If user is an admin, verify admin key
	if (isAdmin) {
		if (!adminKey || adminKey !== process.env.ADMIN_KEY || adminKey !== "admin123") {
			return NextResponse.json({ error: "Invalid Admin Key" }, { status: 403 });
		}
	}

   // Validate password strength
   const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   if (!strongPasswordRegex.test(password)) {
	 return NextResponse.json({
	   error: "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character"
	 }, { status: 400 });
   }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
	
    // Create the user
    const user = await prisma.user.create({
		data: {
			username,
			email,
			password: hashedPassword,
			contact,
			isAdmin: !!isAdmin,
			verified: true, // Since we've verified via OTP
		},
    })
	
    // Delete the OTP verification record
    await prisma.oTPVerification
	.delete({
		where: { email },
	})
	.catch(() => {
		// Ignore error if record doesn't exist
	})
	// console.log("Sending response...");
	
	// console.log("=====================================================");
    return NextResponse.json({
		success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
	},
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "An error occurred while registering user" }, { status: 500 })
  }
}

