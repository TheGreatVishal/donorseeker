import nodemailer from "nodemailer"

interface EmailOptions {
	to: string
	subject: string
	html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {


	// Create a transporter using SMTP settings
	const transporter = nodemailer.createTransport({
		service: "gmail", // Use your email provider (e.g., Gmail, Outlook, SMTP)
		auth: {
			user: process.env.EMAIL_USER, // Your email address
			pass: process.env.EMAIL_PASS, // Your email password or app password
		},
	})

	try {
		// Send the email
		const info = await transporter.sendMail({
			from: "Donation Platform Donor-Seeker",
			to,
			subject,
			html,
		})

		// console.log("Email sent:", info.messageId)
		return { success: true, messageId: info.messageId }
	} catch (error) {
		console.error("Error sending email:", error)
		throw new Error("Failed to send email notification")
	}
}

