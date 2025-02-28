"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function HomePageNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between text-gray-700">
        <Link href="/home" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Donor Seeker Logo" width={150} height={50} className="h-12 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link href="/home" className="text-sm font-medium px-3 py-2 hover:text-orange-500">Home</Link>
          <Link href="/how-it-works" className="text-sm font-medium px-3 py-2 hover:text-orange-500">How It Works</Link>
          <Link href="/browse" className="text-sm font-medium px-3 py-2 hover:text-orange-500">Browse Donations</Link>
          <Link href="/list-item" className="text-sm font-medium px-3 py-2 hover:text-orange-500">List an Item</Link>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 ">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/dashboard" className="text-gray-700">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/logout" className="text-gray-700">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white shadow-lg rounded-b-lg mt-4 p-4"
          >
            <Link href="/home" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/how-it-works" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>How It Works</Link>
            <Link href="/browse" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Browse Donations</Link>
            <Link href="/list-item" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>List an Item</Link>
            <hr className="my-2" />
            <Link href="/dashboard" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="/logout" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Logout</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}