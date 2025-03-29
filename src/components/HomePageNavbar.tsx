"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HomePageNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.isAdmin as boolean | undefined;

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-pink-200 shadow-lg" : "bg-blue-400"
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between transition-colors duration-300 ">
        <Link href="/home" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Donor Seeker Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
           <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
            Donor Seeker
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-6">
          {[
            "Home",
            "How It Works",
            "Browse Donations",
            // "List an Item",
            "My Requests",
          ].map((item, index) => (
            <Link
              key={index}
              href={`/${item.toLowerCase().replace(/ /g, "-")}`}
              className=" font-medium px-4 py-2 relative group transition-colors duration-300 text-gray-800 hover:text-pink-500  text-lg"
            >
              {item}
              <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-0.5 bg-blue-500 transition-all"></span>
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="text-lg font-medium px-4 py-2 hover:text-pink-500 transition text-gray-800"
            >
              Admin Dashboard
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-800 hover:text-pink-500 ">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-white text-gray-800 shadow-md mt-4 p-2">
              {/* <DropdownMenuItem>
                <Link href="/dashboard" className="w-full hover:text-pink-500">
                  Dashboard
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <Link href="/profile" className="w-full hover:text-pink-500">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={handleLogout} className="w-full text-left hover:text-red-500">
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-gray-800 hover:text-pink-500"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-blue-200 text-gray-800 shadow-md p-4 rounded-b-lg"
          >
            {[
              "Home",
              "How It Works",
              "Browse Donations",
              "List an Item",
              "My Requests",
            ].map((item, index) => (
              <Link
                key={index}
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className="block py-2 hover:text-pink-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block py-2 hover:text-pink-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <hr className="my-2 border-black" />
            <Link href="/dashboard" className="block py-2 hover:text-pink-500" onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/profile" className="block py-2 hover:text-pink-500" onClick={() => setIsMobileMenuOpen(false)}>
              Profile
            </Link>
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block py-2 w-full text-left hover:text-red-500">
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}