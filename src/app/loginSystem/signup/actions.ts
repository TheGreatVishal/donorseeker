"use server";

import prisma from "../../../lib/prisma";
import { sendEmail } from "../../../lib/mail";

export async function checkUsernameAvailability(username: string): Promise<boolean> {
	try {
		console.log(`Checking availability for username: ${username}`);

		const existingUser = await prisma.user.findUnique({
			where: { username },
			select: { id: true },
		});

		const isAvailable = !existingUser;
		console.log(`Username availability: ${isAvailable}`);
		return isAvailable;
	} catch (error) {
		console.error("Error checking username availability:", error);
		throw new Error("Failed to check username availability");
	}
}

export async function sendOTP(email: string) {
	try {
		console.log("=====================================");

		console.log(`Generating OTP for email: ${email}`);

		// Check if email already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
			select: { id: true },
		});

		if (existingUser) {
			console.warn(`Email already registered: ${email}`);
			return { success: false, error: "Email already registered" };
		}

		// Generate a 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		console.log(`Generated OTP for ${email}: ${otp}`);


		// Set expiration time (15 minutes from now)
		const expiresAt = new Date();

		expiresAt.setMinutes(expiresAt.getMinutes() + 15);

		console.log(`OTP expires at: ${expiresAt.getMinutes() + 15}`);
		console.log("storing otp in db");

		// Store OTP in database (upsert to handle existing OTP cases)
		try {
			await prisma.oTPVerification.upsert({
				where: { email },
				update: { otp, expiresAt },
				create: { email, otp, expiresAt },
			});
			console.log("OTP stored successfully.");
		} catch (error: any) {
			console.error("Database Error:", error.message);
		}
		
		
		console.log("storing otp in db done.....");

		console.log(`OTP for ${email}: ${otp}`);

		// Send OTP via email
		await sendEmail(email, otp);

		console.log(`OTP sent successfully to: ${email}`);

		return { success: true, message: "OTP sent successfully" };
	} catch (error) {
		console.error("Error sending OTP:", error);
		return { success: false, error: "Failed to send OTP" };
	}
}

export async function verifyAdminKeyRequest(adminKey: string) {
	try {
		console.log(`Verifying admin key: ${adminKey}`);

		// Using a hardcoded key for now
		const validAdminKey = process.env.ADMIN_KEY || "admin123";

		const isValid = adminKey === validAdminKey;
		console.log(`Admin key valid: ${isValid}`);

		return { success: isValid };
	} catch (error) {
		console.error("Error verifying admin key:", error);
		return { success: false, error: "Failed to verify admin key" };
	}
}
