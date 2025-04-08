"use client";

import { useStats } from "./StatsProvider";
import { motion } from "framer-motion";
import { Users, Gift, Clock, ListPlus } from 'lucide-react';

export function StatsDisplay() {
  const { stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-gray-200 animate-pulse h-12 w-12"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded w-20"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Unable to load statistics. Please try again later.
      </div>
    );
  }

  const statItems = [
    { label: "Active Donors", value: stats?.activeDonors || 0, icon: Users },
    { label: "Total Donations", value: stats?.totalDonations || 0, icon: Gift },
    { label: "Items Requested", value: stats?.itemsRequested || 0, icon: Clock },
    { label: "Recent Listings", value: stats?.recentListings || 0, icon: ListPlus },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {statItems.map((stat, index) => (
        <motion.div 
          key={index} 
          className="flex flex-col items-center space-y-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            },
          }}
        >
          <div className="p-3 rounded-full bg-teal-100 text-teal-700">
            <stat.icon className="h-6 w-6" />
          </div>
          <motion.h3 
            className="text-3xl font-bold text-gray-900"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {stat.value.toLocaleString()}
          </motion.h3>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
