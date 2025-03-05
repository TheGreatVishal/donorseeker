'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [, setScrolled] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-70"></div>
            </div>
        );
    }

    const quickAccessCards = [
        {
            title: "Donate Items",
            icon: "🎁",
            description: "List items you want to donate",
            gradient: "from-green-500 to-green-600",
            page: "/donate"
        },
        {
            title: "Find Donations",
            icon: "🔍",
            description: "Browse available donations",
            gradient: "from-blue-500 to-blue-600",
            page: "/browse-donations"
        },
        {
            title: "Leaderboard",
            icon: "🏆",
            description: "See top donors",
            gradient: "from-yellow-500 to-yellow-600",
            page: "/leaderboard"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-300 dark:from-gray-900 dark:to-gray-800">
            
            {/* Hero Section */}
            <section className="relative py-20 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                <div className="container mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl font-extrabold drop-shadow-lg"
                    >
                        Welcome, {session?.user?.name || 'Guest'}! 🎉
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg mt-4 opacity-90"
                    >
                        Connect with donors and seekers to make a real impact.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8"
                    >
                        <Link
                            href="/donate"
                            className="inline-block px-8 py-3 text-lg font-semibold bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-110"
                        >
                            Start Donating 🚀
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Quick Access Cards */}
            <section className="py-12 px-4">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickAccessCards.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all"
                        >
                            <div className={`w-14 h-14 flex items-center justify-center text-3xl rounded-full bg-gradient-to-r ${item.gradient} mb-4 shadow-md`}>
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                            <Link href={item.page} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 font-medium">
                                Learn More →
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
