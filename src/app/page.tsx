"use client"

import { useEffect } from "react"
import Head from "next/head"
import HeroCarousel from "../components/HeroCarousel"
import Features from "../components/Features"
import { motion, useAnimation, useScroll, useSpring } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Navbar } from "@/components/Navbar"
import Testimonials from "@/components/Testimonials"
import { CallToActionSection } from "@/components/CallToActionSection"
import { StatsDisplay } from "@/components/StatsDisplay"
import { StatsProvider } from "@/components/StatsProvider"

export default function Home() {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="bg-gray-100 text-gray-800">
      <Head>
        <title>Donation Platform - Connect, Give, Receive</title>
        <meta name="description" content="A platform for donating and requesting items in your community" />
        <link rel="icon" href="/logo.ico" />
      </Head>

      <Navbar />
      <motion.div className="fixed top-16 left-0 right-0 h-1 bg-blue-500 z-50" style={{ scaleX }} />
      <HeroCarousel />
      <Features />

      <motion.section
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
        transition={{ duration: 0.5 }}
        className="bg-white text-gray-900"
      >
        <Testimonials />
      </motion.section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
              Our Impact
            </h2>
            <p className="max-w-[900px] mx-auto text-gray-600 md:text-xl/relaxed">
              Real-time statistics from our growing community
            </p>
          </div>
          <StatsProvider>
            <StatsDisplay />
          </StatsProvider>
        </div>
      </section>

      <CallToActionSection />
    </div>
  )
}
