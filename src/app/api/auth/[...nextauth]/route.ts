// api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import prisma from '../../../../lib/prisma'

const handler = NextAuth({
	// debug:true,
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email }
				})

				if (!user) {
					return null
				}

				const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
				if (!isPasswordValid) {
					return null
				}

				return {
					id: user.id.toString(),
					email: user.email,
					name: user.username,
					isAdmin: user.isAdmin
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.isAdmin = user.isAdmin
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string
				session.user.isAdmin = token.isAdmin as boolean
			}
			return session
		},
	},
	pages: {
		signIn: '/loginSystem/login',
	},
	secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }