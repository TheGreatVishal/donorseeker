"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image";
import { motion } from "framer-motion"
import {
  Gift,
  Search,
  Trophy,
  ArrowRight,
  Heart,
  Calendar,
  Users,
  TrendingUp,
  MapPin,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [stats,] = useState({
    totalDonations: 1245,
    activeDonors: 328,
    itemsRequested: 89,
    upcomingEvents: 3,
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-70"></div>
      </div>
    )
  }

  const quickAccessCards = [
    {
      title: "Donate Items",
      icon: <Gift className="h-6 w-6 text-white" />,
      description: "List items you want to donate to those in need",
      gradient: "from-green-500 to-green-600",
      page: "/donate",
    },
    {
      title: "Find Donations",
      icon: <Search className="h-6 w-6 text-white" />,
      description: "Browse available donations and request items",
      gradient: "from-blue-500 to-blue-600",
      page: "/browse-donations",
    },
    {
      title: "Leaderboard",
      icon: <Trophy className="h-6 w-6 text-white" />,
      description: "See top donors and most active community members",
      gradient: "from-yellow-500 to-yellow-600",
      page: "/leaderboard",
    },
  ]

  const recentDonations = [
    {
      id: 1,
      title: "Winter Jacket",
      category: "Clothing",
      condition: "Good",
      donor: "Alex Johnson",
      location: "Downtown",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      title: "Children's Books",
      category: "Books",
      condition: "New",
      donor: "Maria Garcia",
      location: "Westside",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      title: "Kitchen Appliance",
      category: "Household",
      condition: "Used",
      donor: "Sam Wilson",
      location: "Northside",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 mt-10 pt-5">
      {/* Header with user greeting */}
      <header
        className={`sticky top-0 z-10 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md" : ""}`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarFallback>{session?.user?.firstname?.[0] || "G"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Welcome back</p>
              <h2 className="font-bold">
                {session?.user?.firstname ? `${session.user.firstname} ${session.user.lastname}` : "Guest"}
              </h2>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="relative mb-12 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

          <div className="relative py-16 px-8 md:px-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none">
                <Sparkles className="h-3 w-3 mr-1" /> New Feature
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-sm">Make a Difference Today</h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Your donations can change lives. Connect with people in need and share what you no longer use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => router.push("/donate")}
                >
                  Start Donating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => router.push("/requirements")}
                >
                  Start an Ask
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-black hover:bg-white/20"
                  onClick={() => router.push("/browse-donations")}
                >
                  Browse Donations
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-black hover:bg-white/20"
                  onClick={() => router.push("/my-dashboard")}
                >
                  My Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Donations</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stats.totalDonations}</span>
                  <Badge
                    variant="outline"
                    className="text-green-600 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" /> 12%
                  </Badge>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Donors</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stats.activeDonors}</span>
                  <Badge
                    variant="outline"
                    className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                  >
                    <Users className="h-3 w-3 mr-1" /> Active
                  </Badge>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Items Requested</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stats.itemsRequested}</span>
                  <Badge
                    variant="outline"
                    className="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800"
                  >
                    <Search className="h-3 w-3 mr-1" /> Pending
                  </Badge>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Upcoming Events</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stats.upcomingEvents}</span>
                  <Badge
                    variant="outline"
                    className="text-purple-600 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800"
                  >
                    <Calendar className="h-3 w-3 mr-1" /> This Week
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickAccessCards.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${item.gradient} mb-4 shadow-md`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                  <Link
                    href={item.page}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                  >
                    Get Started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Donations */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Donations</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentDonations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between">
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={500} // Set an appropriate width
                          height={500} // Set an appropriate height
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                        <CardDescription className="mb-2">
                          Condition: <span className="font-medium capitalize">{item.condition}</span>
                        </CardDescription>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" /> {item.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Donated by {item.donor}</div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Community Impact */}
        <section className="mb-12">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle>Community Impact</CardTitle>
              <CardDescription className="text-purple-100">
                See how your donations are making a difference
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top Categories</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Clothing</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Books</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Household</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "18%" }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Success Stories</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Jane donated winter clothes to a family in need</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>MR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Mark donated school supplies to local children</p>
                        <p className="text-xs text-gray-500">5 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

