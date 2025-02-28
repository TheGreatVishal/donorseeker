import NextAuth from "next-auth"

declare module "next-auth" {

  interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean; // Add isAdmin property
  }
  interface Session {
    user: User; // Use the extended User interface
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}