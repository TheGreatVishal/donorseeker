"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Heart, HelpCircle, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen)
    return () => document.body.classList.remove("overflow-hidden")
  }, [isMobileMenuOpen])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-sm shadow-md text-gray-900"
        : "bg-gradient-to-r from-pink-500/90 to-blue-500/90 backdrop-blur-sm text-white"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/50 shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="Donor Seeker Logo"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Donor Seeker
          </span>

        </Link>

        {/* Desktop Menu */}
        <div className={`hidden lg:flex items-center space-x-6 ${isScrolled ? "text-gray-900" : "text-white"}`}>
          <Link
            href="/"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <span>Home</span>
          </Link>
          <Link
            href="/how-it-works"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <HelpCircle className="h-4 w-4" />
            <span>How It Works</span>
          </Link>
          <Link
            href="/browse-donations"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <Gift className="h-4 w-4" />
            <span>Browse Donations</span>
          </Link>
          <Link
            href="/browse-requirements"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <Heart className="h-4 w-4" />
            <span>Browse Needs</span>
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <span>Leaderboard</span>
          </Link>

          <div className="flex items-center space-x-2 ml-4">
            <Button variant="outline"
              className="bg-gradient-to-r from-pink-400 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-black border-none shadow-md">
              <Link href="/loginSystem/login">Login</Link>
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white border-none shadow-md">
              <Link href="/loginSystem/signup">Sign Up</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`${isScrolled ? "text-gray-900 hover:bg-gray-200" : "text-white hover:bg-white/10"}`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
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
            className="lg:hidden bg-white shadow-lg rounded-b-lg p-6 text-gray-900 space-y-4"
          >
            <Link
              href="/"
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="font-medium">Home</span>
            </Link>
            <Link
              href="/how-it-works"
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HelpCircle className="h-5 w-5 text-pink-500" />
              <span className="font-medium">How It Works</span>
            </Link>
            <Link
              href="/browse-donations"
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Gift className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Browse Donations</span>
            </Link>
            <Link
              href="/browse-requirements"
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="font-medium">Browse Needs</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="font-medium">Leaderboard</span>
            </Link>

            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full border-2 border-pink-500 text-pink-500 hover:bg-pink-500/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/loginSystem/login" className="w-full">
                  Login
                </Link>
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/loginSystem/signup" className="w-full">
                  Sign Up
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

