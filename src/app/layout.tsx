'use client';
import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { HomePageNavbar } from "@/components/HomePageNavbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Public paths where unauthenticated users should see the default Navbar
const publicRoutes = ["/",
  "/loginSystem/login",
  "/loginSystem/signup",
  "/loginSystem/forgot-password",
  "/loginSystem/reset-password",
  "/how-it-works",
  "/browse-donations",
];

function NavbarWrapper() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return null; // avoid flickering

  const isPublic = publicRoutes.includes(pathname);

  if (session && !isPublic) {
    return <HomePageNavbar />;
  } else if (session && isPublic) {
    return <HomePageNavbar />;
  } else if (!session && isPublic) {
    return <Navbar />;
  } else {
    return <Navbar />;
  }

  return null; // no navbar if unauthenticated user visits a protected route
}

function AuthRedirect() {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && pathname === "/") {
      router.push("/home");
    }
  }, [status, pathname, router]);

  return null;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/logo.ico?v=2" sizes="any" />
      </head>
      <SessionProvider>
        <AuthRedirect />
        <body className="bg-gray-100 dark:bg-gray-900 min-h-screen">
          <NavbarWrapper />
          {children}
          <Footer />
        </body>
      </SessionProvider>
    </html>
  );
}