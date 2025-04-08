"use client"

import Link from "next/link"
import {
  CheckCircle,
  Gift,
  Search,
  UserPlus,
  ListPlus,
  Users,
  FileSearch,
  MessageSquare,
  Truck,
  Heart,
  ThumbsUp,
  Shield,
  Award,
  Clock,
  BrainCog,
  Repeat,
  Star,
  Bell,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsDisplay } from "@/components/StatsDisplay"
import { StatsProvider } from "@/components/StatsProvider"

export default function HowItWorks() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const iconAnimation = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const floatAnimation = {
    hidden: { y: 0 },
    visible: {
      y: [-10, 0, -10] as number[], // Remove readonly modifier
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
  }

  return (
    <div className="flex flex-col items-center text-center overflow-hidden mt-10 pt-10">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 text-white">
        <motion.div
          className="container px-4 md:px-6 mx-auto max-w-7xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <motion.div className="p-2 rounded-full bg-white/20 backdrop-blur-sm" variants={floatAnimation}>
              <Heart className="h-12 w-12 text-white" fill="white" />
            </motion.div>
            <div className="space-y-3">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white drop-shadow-md"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(255,255,255,0.5)",
                    "0 0 15px rgba(255,255,255,0.5)",
                    "0 0 5px rgba(255,255,255,0.5)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                How Donor Seeker Works
              </motion.h1>
              <motion.p className="max-w-[900px] text-white/90 md:text-xl lg:text-2xl" variants={fadeIn}>
                Connecting generous donors with those in need through a secure, transparent platform
              </motion.p>
            </div>
            <motion.div
              className="flex flex-wrap justify-center gap-3 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Badge className="bg-white/30 hover:bg-white/40 text-white text-sm py-1.5">Verified Users</Badge>
              <Badge className="bg-white/30 hover:bg-white/40 text-white text-sm py-1.5">Secure Platform</Badge>
              <Badge className="bg-white/30 hover:bg-white/40 text-white text-sm py-1.5">Community Ratings</Badge>
              <Badge className="bg-white/30 hover:bg-white/40 text-white text-sm py-1.5">100% Free</Badge>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Platform Overview */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                Our Platform at a Glance
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Donor Seeker simplifies the donation process with a transparent, community-driven approach
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: "Verified Users",
                description: "All users verify their email and build reputation through community ratings",
                color: "bg-teal-500",
              },
              {
                icon: Award,
                title: "Leaderboard System",
                description: "Active donors are recognized on our leaderboard based on donation count and ratings",
                color: "bg-cyan-500",
              },
              {
                icon: ThumbsUp,
                title: "Feedback System",
                description: "Recipients provide ratings and comments after receiving donations",
                color: "bg-sky-500",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn} className="h-full">
                <Card className="h-full border-t-4 border-t-teal-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${feature.color} text-white`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-sky-50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                How the Process Works
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Four simple steps to connect donors with recipients
              </p>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-500 to-sky-500 hidden md:block"></div>

            <motion.div
              className="space-y-12 relative"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                {
                  icon: UserPlus,
                  title: "Create an Account",
                  description: "Sign up using your email, verify your account, and set up your profile.",
                  details: "Your donation and feedback history will build your trust and reputation on the platform.",
                  color: "bg-teal-500",
                },
                {
                  icon: ListPlus,
                  title: "List an Item for Donation",
                  description: "Donors can list items they wish to donate with relevant details and images.",
                  details: "All listings are reviewed by admins before being visible to seekers.",
                  color: "bg-cyan-500",
                },
                {
                  icon: MessageSquare,
                  title: "Seekers Send Requests",
                  description: "Interested seekers can send a request message explaining why they need the item.",
                  details: "Multiple seekers can request the same item before it's accepted by a donor.",
                  color: "bg-sky-500",
                },
                {
                  icon: BrainCog, // Replace with an actual AI/insight-related icon you're using
                  title: "AI Assists Selection",
                  description: "An AI system scores the request messages based on neediness.",
                  details: "This helps donors make fair decisions without reading all messages manually.",
                  color: "bg-indigo-500",
                },
                {
                  icon: CheckCircle,
                  title: "Request Accepted",
                  description: "Once the donor selects a recipient, an email notification is sent.",
                  details: "The donation is now marked as 'in progress' and no more requests can be made.",
                  color: "bg-emerald-500",
                },
                {
                  icon: Repeat,
                  title: "Complete the Transaction",
                  description: "Receiver confirms item receipt and shares their experience.",
                  details: "This confirmation logs the transaction and allows the receiver to provide a rating.",
                  color: "bg-orange-500",
                },
                {
                  icon: Star,
                  title: "Rate the Donor",
                  description: "Receivers give feedback and rate their experience with the donor.",
                  details: "This rating is used to update the donor's overall platform reputation.",
                  color: "bg-yellow-500",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className={`relative w-full mb-10 flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                  variants={fadeIn}
                >
                  {/* Box */}
                  <div className="w-full md:w-1/2 px-4 z-10">
                    <motion.div
                      className="bg-white rounded-xl shadow-lg p-6 md:p-8 break-words"
                      whileHover={{ scale: 1.02 }}
                      variants={iconAnimation}
                    >
                      {/* Icon */}
                      <div
                        className={`flex items-center justify-center h-14 w-14 rounded-full ${step.color} text-white shadow-lg mb-4`}
                      >
                        <step.icon className="h-7 w-7" />
                      </div>

                      {/* Text */}
                      <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-700 mb-2">{step.description}</p>
                      <p className="text-gray-500 text-sm">{step.details}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Donors Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-50 to-sky-50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <Badge className="bg-teal-100 text-teal-700 mb-2">FOR DONORS</Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                How to Donate Items
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Make a difference by sharing items you no longer need
              </p>
            </div>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: FileSearch,
                title: "Create a Donation Listing",
                description: "Share details about your item",
                steps: [
                  "Take clear photos of the item",
                  "Describe condition accurately (New, Used, Good, Fair, Bad)",
                  "Select the appropriate category",
                  "Provide contact information",
                ],
                color: "text-teal-500",
              },
              {
                icon: Bell,
                title: "Review Requests",
                description: "Choose who receives your donation",
                steps: [
                  "Receive notifications when someone requests your item",
                  "Review recipient profiles and request messages",
                  "Accept the most suitable request",
                  "Decline other requests with optional feedback",
                ],
                color: "text-cyan-500",
              },
              {
                icon: Truck,
                title: "Complete the Donation",
                description: "Finalize the donation process",
                steps: [
                  "Coordinate pickup or delivery details",
                  "Mark the transaction as completed",
                  "Receive feedback and rating from the recipient",
                  "Improve your donor ranking on the leaderboard",
                ],
                color: "text-sky-500",
              },
            ].map((card, index) => (
              <motion.div key={index} variants={fadeIn} className="h-full">
                <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 border-t-4 border-t-teal-500 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-teal-50 to-sky-50">
                    <div className="flex items-center space-x-2">
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                      <CardTitle className="bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                        {card.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-left">
                      {card.steps.map((step, stepIndex) => (
                        <motion.li
                          key={stepIndex}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: stepIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className={`mr-2 h-4 w-4 mt-1 flex-shrink-0 ${card.color}`} />
                          <span className="text-gray-700">{step}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Button
              asChild
              className="group bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 hover:scale-105 text-white shadow-lg transition-all duration-300"
              size="lg"
            >
              <Link href="/donate" className="text-lg">
                Start Donating
                <motion.span
                  animate={{ rotate: [-10, 0, 10] }}
                  transition={{ duration: 1.0, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Gift className="ml-2 h-5 w-5" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* For Recipients Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <Badge className="bg-sky-100 text-sky-700 mb-2">FOR RECIPIENTS</Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                How to Request Items
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Find and request the items you need from generous donors
              </p>
            </div>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Search,
                title: "Browse Available Donations",
                description: "Find items you need",
                steps: [
                  "Search by category or keyword",
                  "Filter by condition and other criteria",
                  "View detailed item descriptions and photos",
                  "Check donor profiles and ratings",
                ],
                color: "text-teal-500",
              },
              {
                icon: ListPlus,
                title: "Create Requirement Listing",
                description: "Let donors know what you need",
                steps: [
                  "Describe the item you're looking for",
                  "Set the urgency level (Low, Normal, High, Urgent)",
                  "Add photos for reference if available",
                  "Provide your contact information",
                ],
                color: "text-cyan-500",
              },
              {
                icon: MessageSquare,
                title: "Request and Receive",
                description: "Complete the process",
                steps: [
                  "Send a personalized request message",
                  "Coordinate pickup or delivery with the donor",
                  "Confirm when you receive the item",
                  "Provide feedback and rating for the donor",
                ],
                color: "text-sky-500",
              },
            ].map((card, index) => (
              <motion.div key={index} variants={fadeIn} className="h-full">
                <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 border-t-sky-500 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-sky-50 to-teal-50">
                    <div className="flex items-center space-x-2">
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                      <CardTitle className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                        {card.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-left">
                      {card.steps.map((step, stepIndex) => (
                        <motion.li
                          key={stepIndex}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: stepIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className={`mr-2 h-4 w-4 mt-1 flex-shrink-0 ${card.color}`} />
                          <span className="text-gray-700">{step}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Button
              asChild
              className="group bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 hover:scale-105 text-white shadow-lg transition-all duration-300"
              size="lg"
            >
              <Link href="/browse-donations" className="text-lg">
                Browse Donations
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Search className="ml-2 h-5 w-5" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-teal-50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                Trust & Safety
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                How we ensure a safe and trustworthy donation experience
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: "User Verification",
                description:
                  "All users must verify their email address before using the platform. This helps ensure that only legitimate users can create listings and make requests.",
              },
              {
                icon: Users,
                title: "Community Ratings",
                description:
                  "After each donation, recipients provide feedback and ratings for donors. This builds a reputation system that helps users make informed decisions.",
              },
              {
                icon: Clock,
                title: "Admin Approval",
                description:
                  "All donation and requirement listings are reviewed by our admin team before being published to ensure they meet our community guidelines.",
              },
              {
                icon: Award,
                title: "Donor Leaderboard",
                description:
                  "Active donors are recognized on our leaderboard based on donation count and ratings, encouraging positive community participation.",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full border-l-4 border-l-teal-500 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-teal-100 text-teal-700">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                Our Impact
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Real-time statistics from our growing community
              </p>
            </div>
          </motion.div>

          {/* Real-time stats display */}
          <StatsProvider>
            <StatsDisplay />
          </StatsProvider>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-50 to-sky-50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Common questions about our donation platform
              </p>
            </div>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                question: "Is this service completely free?",
                answer:
                  "Yes, our platform is 100% free to use for both donors and recipients. We believe in removing barriers to giving and receiving help.",
              },
              {
                question: "How do you verify users?",
                answer:
                  "Users verify their email address during registration. Additionally, our rating system helps build trust within the community as users receive feedback after each donation.",
              },
              {
                question: "What types of items can be donated?",
                answer:
                  "Almost any physical item in usable condition can be donated. Items are categorized and must be approved by our admin team before listings go live.",
              },
              {
                question: "How is item condition determined?",
                answer:
                  "Donors select from five condition levels: New, Used, Good, Fair, or Bad. They must provide accurate descriptions and photos to help recipients make informed decisions.",
              },
              {
                question: "What if I can't arrange pickup?",
                answer:
                  "You can specify delivery options in your listing. Some donors offer delivery, or you can arrange third-party delivery services. This should be discussed in the request messages.",
              },
              {
                question: "How does the urgency level work for requirements?",
                answer:
                  "When creating a requirement listing, recipients can set urgency levels (Low, Normal, High, Urgent) to indicate how quickly they need the item. This helps donors prioritize requests.",
              },
            ].map((faq, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-l-4 border-l-teal-500">
                  <CardHeader className="bg-gradient-to-r from-teal-50 to-sky-50">
                    <CardTitle className="text-lg bg-gradient-to-r from-teal-700 to-sky-700 bg-clip-text text-transparent">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 text-white">
        <motion.div
          className="container px-4 md:px-6 mx-auto max-w-7xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <motion.h2
                className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white drop-shadow-md"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(255,255,255,0.3)",
                    "0 0 15px rgba(255,255,255,0.3)",
                    "0 0 5px rgba(255,255,255,0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                Ready to Get Started?
              </motion.h2>
              <p className="max-w-[900px] text-white/90 md:text-xl/relaxed">
                Join our community today and start giving or receiving help
              </p>
            </div>
            <motion.div className="flex flex-col gap-3 min-[400px]:flex-row" variants={staggerContainer}>
              <motion.div variants={fadeIn}>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="group bg-white text-teal-600 hover:bg-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Link href="/loginSystem/signup">
                    Create Account
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      <UserPlus className="ml-2 h-5 w-5" />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Link href="/donate">
                    Donate Now
                    <motion.span
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      <Gift className="ml-2 h-5 w-5" />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
