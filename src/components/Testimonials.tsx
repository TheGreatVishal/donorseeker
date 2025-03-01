"use client";

import { motion } from "framer-motion";
import { FaMale, FaFemale } from "react-icons/fa";

const testimonials = [
  {
    name: "John Doe",
    feedback: "This platform made it so easy for me to donate my unused items and help those in need!",
    gender: "male",
  },
  {
    name: "Sarah Lee",
    feedback: "I found exactly what I needed, and the process was seamless. Highly recommended!",
    gender: "female",
  },
  {
    name: "Michael Smith",
    feedback: "A fantastic initiative that connects donors and seekers effortlessly.",
    gender: "male",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-200 to-pink-100 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-blue-700 tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-4xl font-bold text-gray-800">What Our Users Say</p>
          <p className="mt-3 text-gray-600 text-lg">Real experiences from our community members.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4">
                {testimonial.gender === "male" ? (
                  <FaMale className="text-blue-500 text-3xl" aria-label="Male Icon" />
                ) : (
                  <FaFemale className="text-pink-500 text-3xl" aria-label="Female Icon" />
                )}
                <p className="text-xl font-semibold text-gray-900">{testimonial.name}</p>
              </div>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">{testimonial.feedback}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
