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
    <section className="py-16 bg-gradient-to-br from-yellow-100 via-orange-200 to-red-300">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 3, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-semibold text-orange-700 uppercase tracking-wide">Features</h2>
          <p className="mt-2 text-4xl font-bold text-gray-900">A Smarter Way to Give & Receive</p>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform simplifies the process of donating and receiving items, making it easier for everyone to contribute.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, ) => (
            <motion.div
              key={feature.name}
              className={`relative p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-r ${feature.color}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.5, zIndex: 10 }}
            >
              <div className="absolute -top-6 left-6 flex items-center justify-center h-14 w-14 rounded-lg bg-white text-gray-900 shadow-md">
                <feature.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white">{feature.name}</h3>
                <p className="mt-2 text-white text-lg leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
