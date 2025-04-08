"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define the stats data structure
export interface StatsData {
  totalDonations: number;
  activeDonors: number;
  itemsRequested: number;
  recentListings: number;
}

// Create a context with default values
const StatsContext = createContext<{
  stats: StatsData | null;
  isLoading: boolean;
  error: string | null;
}>({
  stats: null,
  isLoading: true,
  error: null,
});

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        console.log("Calling api/stats from stats provider component...");
        
        const response = await fetch("/api/stats");
        console.log("Response: ", response);
        
        if (!response.ok) {
            console.log("Response is not  ok...");
            
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Data received as stats: ",data);
        
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <StatsContext.Provider value={{ stats, isLoading, error }}>
      {children}
    </StatsContext.Provider>
  );
}

// Custom hook to use the stats context
export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
}
