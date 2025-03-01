import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export function CallToActionSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 py-16 text-white text-center shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl font-extrabold sm:text-5xl text-white drop-shadow-lg"
        >
          <span className="block">Ready to make a difference?</span>
          <span className="block text-yellow-300">Join our community today.</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 text-lg text-white/90 max-w-2xl mx-auto"
        >
          Start donating or receiving items effortlessly. Be a part of the change and help those in need.
        </motion.p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/loginSystem/signup"
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg text-white bg-black hover:bg-gray-900 hover:text-yellow-300 transition-all duration-300 shadow-md"
          >
            Sign Up <FaArrowRight className="ml-2" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg text-white border-2 border-white hover:bg-white hover:text-black transition-all duration-300 shadow-md"
          >
            Learn More
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}