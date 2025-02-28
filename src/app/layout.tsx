'use client';
import "./globals.css";
import { SessionProvider } from "next-auth/react";
// import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';


export default function RootLayout({ children }: { children: ReactNode }) {
  // const router = useRouter();

  return (
    <html>
       <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
      </head>
      <SessionProvider>
        <body className="bg-gray-100 dark:bg-gray-900 min-h-screen">
          {children}
          {/* <Footer /> */}
        </body>
      </SessionProvider>
    </html>
  );
}
