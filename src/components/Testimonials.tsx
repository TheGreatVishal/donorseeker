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
    <section className="py-12 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            Hear from our community
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 border rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4">
                {testimonial.gender === "male" ? (
                  <FaMale className="text-blue-500 text-2xl" />
                ) : (
                  <FaFemale className="text-pink-500 text-2xl" />
                )}
                <p className="text-lg font-semibold text-gray-800">{testimonial.name}</p>
              </div>
              <p className="mt-4 text-gray-600">{testimonial.feedback}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;