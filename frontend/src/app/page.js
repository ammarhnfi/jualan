"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false, 
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">Loading Map...</div> 
});

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // default center Depok
  const fetchListings = async (lat = -6.4025, lng = 106.7942, radius = 5) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:4000/api`;
      const res = await fetch(`${apiUrl}/listings?latitude=${lat}&longitude=${lng}&radius_km=${radius}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (e) {
      console.error("Failed to fetch listings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <main className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* Top Navbar */}
      <div className="absolute top-0 left-0 w-full z-10 px-4 pt-4 pb-2 bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1 bg-white shadow-lg rounded-full px-4 py-3 flex items-center gap-2 border border-blue-100 pointer-events-auto">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Depok (e.g. food, repair)" 
              className="bg-transparent border-none outline-none w-full text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Map Background */}
      <div className="flex-1 w-full bg-gray-200">
        <Map listings={listings} onBoundsChange={fetchListings} />
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 left-0 w-full z-10 px-4 pointer-events-none flex justify-center">
        <Link 
          href="/create" 
          className="pointer-events-auto shadow-2xl bg-blue-600 text-white px-6 py-4 rounded-full flex items-center gap-2 font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all"
        >
          <PlusCircle className="w-6 h-6" />
          <span>Post in 30s</span>
        </Link>
      </div>

      {/* Bottom Sheet Overlay if needed for details */}
    </main>
  );
}
