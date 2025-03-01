"use client";

import { useEffect } from "react";
import Head from "next/head";
import HeroCarousel from "../components/HeroCarousel";
import Features from "../components/Features";
import { motion, useAnimation, useScroll, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Navbar } from "@/components/Navbar";
import Testimonials  from "@/components/Testimonials";

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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
        className="py-12 bg-white text-gray-900"
      >

      <Testimonials />
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-blue-700 py-12 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            <span className="block">Ready to make a difference?</span>
            <span className="block">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-200"
              >
                Sign Up
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
