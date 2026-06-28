"use client";

import React, { useState, useEffect } from 'react';
import { MdLocationOn, MdSwapHoriz, MdFilterList, MdSort, MdOutlineHourglassEmpty } from 'react-icons/md';
import TicketCard from '@/components/TicketCard'; // Ensure this path matches where you saved the card

export default function TicketPage() {
  // ── Data & Loading States ──
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Search & Filter States ──
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  // ── Fetch Tickets from Backend ──
  useEffect(() => {
    // 1. Define the fetch function
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchFrom) params.append("from", searchFrom);
        if (searchTo) params.append("to", searchTo);
        if (filterType !== "all") params.append("transport", filterType);
        if (sortOrder !== "default") params.append("sort", sortOrder);

        // Adjust NEXT_PUBLIC_API_URL to match your backend port (e.g., http://localhost:5000)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ;
        const res = await fetch(`${baseUrl}/tickets?${params.toString()}`);
        
        if (!res.ok) throw new Error("Failed to fetch tickets");
        
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 2. Implement Debouncing (waits 500ms after user stops typing to fetch)
    const delayDebounceFn = setTimeout(() => {
      fetchTickets();
    }, 500);

    // 3. Cleanup function to clear the timeout if user keeps typing
    return () => clearTimeout(delayDebounceFn);
  }, [searchFrom, searchTo, filterType, sortOrder]);

  return (
    <div className="min-h-screen bg-[#F4F7F8] font-sans pb-20">
      
      {/* ── Hero & Header ── */}
      <div className="bg-[#35858E] pt-20 pb-28 px-6 text-center relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 bg-[#1d4b52]/30 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Find Your Next Journey
          </h1>
          <p className="text-[#A5D5D8] text-lg font-medium">
            Search, filter, and book the best tickets across the country in seconds.
          </p>
        </div>
      </div>

      {/* ── Search & Filter Bar (Floating) ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 mb-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
          
          {/* From -> To Inputs */}
          <div className="flex flex-col sm:flex-row w-full md:w-5/12 items-center bg-gray-50 rounded-2xl border border-gray-200 p-1 transition-all focus-within:border-[#35858E]/50 focus-within:bg-white focus-within:shadow-sm">
            <div className="relative w-full">
              <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Leaving from..." 
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
            
            <div className="w-8 h-8 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-[#35858E] z-10 -my-2 sm:my-0 sm:-mx-4 rotate-90 sm:rotate-0">
              <MdSwapHoriz size={18} />
            </div>

            <div className="relative w-full">
              <MdLocationOn className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[#35858E]/60" size={20} />
              <input 
                type="text" 
                placeholder="Going to..." 
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="w-full bg-transparent py-3 pl-11 sm:pl-12 pr-4 text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Transport Type Filter */}
          <div className="relative w-full md:w-3/12 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#35858E] transition-colors">
              <MdFilterList size={20} />
            </div>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E] focus:bg-white hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <option value="all">All Transport</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="flight">Flight</option>
              <option value="ferry">Ferry</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* Price Sorting */}
          <div className="relative w-full md:w-4/12 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#35858E] transition-colors">
              <MdSort size={20} />
            </div>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E] focus:bg-white hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <option value="default">Sort by: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

        </div>
      </div>

      {/* ── Ticket Results Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            Available Tickets 
            {!isLoading && <span className="text-[#35858E] font-black bg-[#EBF5F6] px-2 py-0.5 rounded-md text-sm">{tickets.length}</span>}
          </h2>
        </div>

        {/* Dynamic Content Rendering */}
        {isLoading ? (

          <div className="py-20 flex flex-col items-center justify-center text-[#35858E]">
            <MdOutlineHourglassEmpty className="animate-spin mb-4" size={40} />
            <p className="text-sm font-bold animate-pulse text-gray-500">Searching the best routes...</p>
          </div>
        ) : tickets.length > 0 ? (
          /* Grid Layout for Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center sm:place-items-start">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id || ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <MdLocationOn size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No tickets found</h3>
            <p className="text-gray-500 font-medium max-w-md">
              We couldn't find any tickets matching your search criteria. Try adjusting your filters or searching for a different route.
            </p>
            <button 
              onClick={() => {
                setSearchFrom("");
                setSearchTo("");
                setFilterType("all");
                setSortOrder("default");
              }}
              className="mt-6 px-6 py-2.5 bg-[#EBF5F6] text-[#35858E] font-bold rounded-xl hover:bg-[#35858E] hover:text-white transition-colors border border-[#D1E9EB] hover:border-[#35858E]"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}