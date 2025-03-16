// 'use client';
// import { Footer } from "@/components/Footer";
// import "./globals.css";
// import { SessionProvider, useSession } from "next-auth/react";
// import { ReactNode } from 'react';
// import { Navbar } from "@/components/Navbar";
// import { HomePageNavbar } from "@/components/HomePageNavbar";

// function NavbarWrapper() {
//   const { data: session } = useSession();

//   return session ? <HomePageNavbar /> : <Navbar />;
// }

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html>
//       <head>
//         <link rel="icon" href="/logo.ico" sizes="any" /> 
//         <link rel="icon" href="/logo.ico?v=2" sizes="any" />
//       </head>
//       <SessionProvider>
//         <body className="bg-gray-100 dark:bg-gray-900 min-h-screen">
//           <NavbarWrapper />
//           {children}
//           <Footer />
//         </body>
//       </SessionProvider>
//     </html>
//   );
// }


'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { HomePageNavbar } from "@/components/HomePageNavbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

function NavbarWrapper() {
  const { data: session } = useSession();
  return session ? <HomePageNavbar /> : <Navbar />;
}

function AuthRedirect() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  return null;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/logo.ico" sizes="any" />
        <link rel="icon" href="/logo.ico?v=2" sizes="any" />
      </head>
      <SessionProvider>
        <AuthRedirect /> {/* Redirects user if authenticated */}
        <body className="bg-gray-100 dark:bg-gray-900 min-h-screen">
          <NavbarWrapper />
          {children}
          <Footer />
        </body>
      </SessionProvider>
    </html>
  );
}
