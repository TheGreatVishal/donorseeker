"use client";

import { useEffect } from "react";
import Head from "next/head";
import HeroCarousel from "../components/HeroCarousel";
import Features from "../components/Features";
import { motion, useAnimation, useScroll, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Navbar } from "@/components/Navbar";
import Testimonials  from "@/components/Testimonials";
import {CallToActionSection} from "@/components/CallToActionSection";

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
        className="bg-white text-gray-900"
      >

      <Testimonials />
      </motion.section>

      <CallToActionSection/>
    </div>
  );
}
