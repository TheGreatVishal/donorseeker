"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  User,
  Heart,
  Gift,
  MessageSquare,
  Trophy,
  LogOut,
  Settings,
  PlusCircle,
  Clock,
  Star,
  HelpCircle,
  ShieldCheck,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function HomePageNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const isAdmin = session?.user?.isAdmin as boolean | undefined

  // Get user's first name for the avatar fallback
  const userFirstName = session?.user?.firstname || ""
  const userInitial = userFirstName.charAt(0).toUpperCase()

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen)
    return () => document.body.classList.remove("overflow-hidden")
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

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
        <Link href="/home" className="flex items-center space-x-2 group">
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
            href="/home"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <span>Home</span>
          </Link>
          <Link
            href="/browse-donations"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <Gift className="h-4 w-4" />
            <span>Donations</span>
          </Link>
          <Link
            href="/browse-requirements"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <Heart className="h-4 w-4" />
            <span>Needs</span>
          </Link>
          {/* <Link
            href="/my-dashboard"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <Package className="h-4 w-4" />
            <span>My-Dashboard</span>
          </Link> */}
          <Link
            href="/my-requests"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <MessageSquare className="h-4 w-4" />
            <span>My Requests</span>
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
              {/* <Badge variant="outline" className="ml-1 bg-pink-500/20 text-xs">
                Admin
              </Badge> */}
            </Link>
          )}
          <Link
            href="/how-it-works"
            className="flex items-center space-x-1 text-lg font-medium px-3 py-2 rounded-md transition-colors duration-300 hover:bg-white/10"
          >
            <HelpCircle className="h-4 w-4" />
            <span>How It Works</span>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`flex items-center space-x-2 rounded-full p-1 ${isScrolled ? "hover:bg-gray-200" : "hover:bg-white/10"
                  }`}
              >
                <Avatar className="h-9 w-9 border-2 border-white/50">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.firstname || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-blue-500 text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-6">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {session?.user?.firstname} {session?.user?.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link href="/profile" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/my-dashboard" className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Create New</DropdownMenuLabel>

              <DropdownMenuItem>
                <Link href="/donate" className="flex items-center w-full">
                  <PlusCircle className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Donation Listing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/requirements" className="flex items-center w-full">
                  <PlusCircle className="mr-2 h-4 w-4 text-pink-500" />
                  <span>Requirement Listing</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link href="/transactions" className="flex items-center w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>My Transactions</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/feedback" className="flex items-center w-full">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Feedback</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center space-x-3">
          {/* User Avatar for Mobile */}
          <Avatar className="h-8 w-8 border-2 border-white/50">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.firstname || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-blue-500 text-white text-xs">
              {userInitial}
            </AvatarFallback>
          </Avatar>

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
            className="lg:hidden bg-white shadow-lg rounded-b-lg p-6 text-gray-900 space-y-4 max-h-[80vh] overflow-y-auto"
          >
            {/* User Info for Mobile */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
              <Avatar className="h-12 w-12 border-2 border-pink-200">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.firstname || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-blue-500 text-white">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {session?.user?.firstname} {session?.user?.lastname}
                </p>
                <p className="text-sm text-muted-foreground truncate">{session?.user?.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Navigation</p>
              <Link
                href="/home"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/browse-donations"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Gift className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Donations</span>
              </Link>
              <Link
                href="/browse-requirements"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5 text-pink-500" />
                <span className="font-medium">Needs</span>
              </Link>
              {/* <Link
                href="/my-listings"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Package className="h-5 w-5 text-blue-500" />
                <span className="font-medium">My Listings</span>
              </Link> */}
              <Link
                href="/my-requests"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquare className="h-5 w-5 text-pink-500" />
                <span className="font-medium">My Requests</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Leaderboard</span>
              </Link>
              <Link
                href="/how-it-works"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-yellow-500" />
                <span>How It Works</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShieldCheck className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Admin Dashboard</span>
                  <Badge variant="outline" className="ml-1 bg-pink-500/20 text-xs">
                    Admin
                  </Badge>
                </Link>
              )}

            </div>

            <div className="space-y-1 pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Account</p>
              <Link
                href="/profile"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Profile</span>
              </Link>
              <Link
                href="/my-dashboard"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </div>

            <div className="space-y-1 pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Create New</p>
              <Link
                href="/donate"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PlusCircle className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Donation Listing</span>
              </Link>
              <Link
                href="/requirements"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PlusCircle className="h-5 w-5 text-pink-500" />
                <span className="font-medium">Requirement Listing</span>
              </Link>
            </div>

            <div className="space-y-1 pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Activity</p>
              <Link
                href="/transactions"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="font-medium">My Transactions</span>
              </Link>
              <Link
                href="/feedback"
                className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Feedback</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

