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

  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <nav
        className={`container mx-auto px-4 py-4 flex items-center justify-between ${
          isScrolled ? "text-black" : "text-yellow-400"
        } transition-colors duration-300`}
      >
        <Link href="/home" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Donor Seeker Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden lg:flex items-center space-x-6">
          {["Home", "How It Works", "Browse Donations", "List an Item", "My Requests"].map(
            (item, index) => (
              <Link
                key={index}
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className={`text-sm font-medium px-4 py-2 relative group transition-colors duration-300 ${
                  isScrolled ? "text-black" : "text-yellow-400"
                }`}
              >
                <span className="group-hover:text-orange-500 transition">{item}</span>
                <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-0.5 bg-orange-500 transition-all"></span>
              </Link>
            )
          )}

          {isAdmin && (
            <Link
              href="/admin-dashboard"
              className={`text-sm font-medium px-4 py-2 hover:text-orange-500 transition ${
                isScrolled ? "text-black" : "text-yellow-400"
              }`}
            >
              Admin Dashboard
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/dashboard" className="text-gray-700 w-full">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/profile" className="text-gray-700 w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={handleLogout} className="text-gray-700 w-full text-left">
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
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
            className="lg:hidden bg-white shadow-md p-4 rounded-b-lg"
          >
            {["Home", "How It Works", "Browse Donations", "List an Item", "My Requests"].map(
              (item, index) => (
                <Link
                  key={index}
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="block py-2 hover:text-orange-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              )
            )}
            {isAdmin && (
              <Link
                href="/admin-dashboard"
                className="block py-2 hover:text-orange-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <hr className="my-2" />
            <Link
              href="/dashboard"
              className="block py-2 hover:text-orange-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="block py-2 hover:text-orange-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="block py-2 w-full text-left hover:text-red-500"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
