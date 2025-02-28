'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
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
            page: "/seek"
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
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
            <section className="pt-12 pb-10 px-4">
                <div className="container mx-auto text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        Welcome, {session?.user?.name || 'Guest'}!
                    </motion.h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
                        Connect with donors and seekers to help those in need.
                    </p>
                    <Link href="/donate" className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Start Donating
                    </Link>
                </div>
            </section>
            <section className="py-12 px-4">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickAccessCards.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                        >
                            <div className={`w-14 h-14 flex items-center justify-center text-3xl rounded-full bg-gradient-to-r ${item.gradient} mb-4`}> 
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                            <Link href={item.page} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500">
                                Learn More →
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}

