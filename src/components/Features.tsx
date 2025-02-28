import { motion } from "framer-motion"
import { GiftIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "Easy Donations",
    description: "Quickly list your items for donation with our user-friendly interface.",
    icon: GiftIcon,
  },
  {
    name: "Efficient Requests",
    description: "Find and request the items you need with our advanced search system.",
    icon: GiftIcon,
  },
  {
    name: "Community Impact",
    description: "Track your contributions and see the difference you're making.",
    icon: ChartBarIcon,
  },
]

const Features = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to give and receive
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform makes it easy to donate items you no longer need and find items you are looking for.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Features

