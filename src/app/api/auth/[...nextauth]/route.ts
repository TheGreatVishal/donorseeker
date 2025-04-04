import { z } from "zod";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";
import { logApiActivity } from "@/utils/logApiActivity";

const loginSchema = z.object({
  email: z.string().email().max(40, "Email cannot exceed 40 characters"),
  password: z.string().min(8).max(30, "Password cannot exceed 30 characters"),
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const endpoint = "/api/auth/[...nextauth]";
        const section = "Auth";
        const requestType = "POST";

        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          const message = parsed.error.errors[0].message;
          console.log(message);

          await logApiActivity({
            request: req,
            session: null,
            section,
            endpoint,
            requestType,
            statusCode: 400,
            description: `Validation failed: ${message}`,
          });

          throw new Error(message);
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user) {
          await logApiActivity({
            request: req,
            session: null,
            section,
            endpoint,
            requestType,
            statusCode: 404,
            description: `Login failed: User not found (${normalizedEmail})`,
          });

          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          await logApiActivity({
            request: req,
            session: null,
            section,
            endpoint,
            requestType,
            statusCode: 401,
            description: `Login failed: Incorrect password (${normalizedEmail})`,
          });

          throw new Error("Incorrect password");
        }

        await logApiActivity({
          request: req,
          session: null,
          section,
          endpoint,
          requestType,
          statusCode: 200,
          description: `Login successful for ${normalizedEmail}`,
        });

        return {
          id: user.id.toString(),
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.firstname = token.firstname as string;
        session.user.lastname = token.lastname as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/loginSystem/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
