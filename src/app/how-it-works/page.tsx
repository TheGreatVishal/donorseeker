"use client"

import Link from "next/link"
import {
  CheckCircle,
  Gift,
  Search,
  UserPlus,
  ListPlus,
  Users,
  CheckSquare,
  FileSearch,
  MessageSquare,
  Truck,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

  return (
    <div className="flex flex-col items-center text-center overflow-hidden">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white">
        <motion.div
          className="container px-4 md:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
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
                Our platform connects donors with recipients in a simple, transparent process.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: UserPlus,
                title: "Create an Account",
                description: "Sign up for a free account to start donating or requesting items.",
                color: "bg-pink-500",
              },
              {
                icon: ListPlus,
                title: "List or Browse",
                description: "List items you want to donate or browse available donations.",
                color: "bg-purple-500",
              },
              {
                icon: Users,
                title: "Connect",
                description: "Donors and recipients connect through our secure platform.",
                color: "bg-indigo-500",
              },
              {
                icon: CheckSquare,
                title: "Complete the Transaction",
                description: "Arrange pickup or delivery and confirm when complete.",
                color: "bg-blue-500",
              },
            ].map((step, index) => (
              <motion.div key={index} className="flex flex-col items-center space-y-4 group" variants={fadeIn}>
                <motion.div
                  className={`flex h-20 w-20 items-center justify-center rounded-full ${step.color} text-white shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  variants={iconAnimation}
                >
                  <step.icon className="h-10 w-10" />
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {step.title}
                </h3>
                <p className="text-center text-gray-700">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* For Donors Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                For Donors
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                How to donate items on our platform.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: FileSearch,
                title: "List Your Item",
                description: "Create a listing with details",
                steps: ["Take clear photos", "Describe condition accurately", "Set pickup/delivery options"],
                color: "text-pink-500",
              },
              {
                icon: MessageSquare,
                title: "Review Requests",
                description: "Choose who receives your donation",
                steps: ["View recipient profiles", "Read request messages", "Select the best match"],
                color: "text-purple-500",
              },
              {
                icon: Truck,
                title: "Complete Donation",
                description: "Finalize the donation process",
                steps: ["Coordinate handover", "Mark as completed", "Receive feedback"],
                color: "text-indigo-500",
              },
            ].map((card, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 border-t-4 border-t-purple-500 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center space-x-2">
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                      <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {card.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {card.steps.map((step, stepIndex) => (
                        <motion.li
                          key={stepIndex}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: stepIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className={`mr-2 h-4 w-4 ${card.color}`} />
                          <span>{step}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Button
              asChild
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all duration-300"
            >
              <Link href="/donate">
                Start Donating
                <motion.span
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Gift className="ml-2 h-4 w-4" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* For Recipients Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-indigo-50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                For Recipients
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                How to request and receive items on our platform.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Search,
                title: "Browse Listings",
                description: "Find items you need",
                steps: ["Search by category", "Filter by location", "View item details"],
                color: "text-indigo-500",
              },
              {
                icon: MessageSquare,
                title: "Request Items",
                description: "Express your need",
                steps: ["Send a request message", "Explain your situation", "Suggest pickup options"],
                color: "text-purple-500",
              },
              {
                icon: Star,
                title: "Receive Donation",
                description: "Complete the process",
                steps: ["Coordinate with donor", "Confirm receipt", "Leave feedback"],
                color: "text-pink-500",
              },
            ].map((card, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 border-t-4 border-t-indigo-500 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center space-x-2">
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                      <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {card.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {card.steps.map((step, stepIndex) => (
                        <motion.li
                          key={stepIndex}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: stepIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className={`mr-2 h-4 w-4 ${card.color}`} />
                          <span>{step}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Button
              asChild
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300"
            >
              <Link href="/browse">
                Browse Donations
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Search className="ml-2 h-4 w-4" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Common questions about our donation platform.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                question: "Is this service free?",
                answer:
                  "Yes, our platform is completely free to use for both donors and recipients. We believe in removing barriers to giving and receiving help.",
              },
              {
                question: "How do you verify users?",
                answer:
                  "We verify users through email confirmation and maintain a rating system to build trust in our community. Admins also review listings before they go live.",
              },
              {
                question: "Can I donate services?",
                answer: "Currently, our platform focuses on physical items. We may expand to services in the future.",
              },
              {
                question: "What if I can't arrange pickup?",
                answer:
                  "You can specify delivery options in your listing. Some donors offer delivery, or you can arrange third-party delivery services.",
              },
            ].map((faq, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 border-l-4 border-l-purple-500 h-full">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <motion.div
          className="container px-4 md:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
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
              <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community today and start giving or receiving help.
              </p>
            </div>
            <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" variants={staggerContainer}>
              <motion.div variants={fadeIn}>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="group bg-white text-purple-600 hover:bg-gray-100 shadow-lg transition-all duration-300"
                >
                  <Link href="/register">
                    Create Account
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      <UserPlus className="ml-2 h-4 w-4" />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group border-white text-white hover:bg-white/20 shadow-lg transition-all duration-300"
                >
                  <Link href="/browse">
                    Browse Donations
                    <motion.span
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      <Search className="ml-2 h-4 w-4" />
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

