import { motion } from "framer-motion";
import { GiftIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "Easy Donations",
    description: "Quickly list your items for donation with our user-friendly interface.",
    icon: GiftIcon,
    color: "from-pink-500 to-red-500",
  },
  {
    name: "Efficient Requests",
    description: "Find and request the items you need with our advanced search system.",
    icon: GiftIcon,
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Community Impact",
    description: "Track your contributions and see the difference you're making.",
    icon: ChartBarIcon,
    color: "from-green-500 to-teal-500",
  },
];

const Features = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            className="text-primary font-semibold tracking-wide uppercase text-orange-600 text-xl"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Features
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            A better way to give and receive
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            Our platform makes it easy to donate items you no longer need and find items you are looking for.
          </motion.p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className={`relative p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer bg-gradient-to-r ${feature.color}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }} // Staggered appearance
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <dt>
                  <motion.div
                    className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-white text-gray-900 shadow-md"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.2 }} // No delay in hover effect
                  >
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
