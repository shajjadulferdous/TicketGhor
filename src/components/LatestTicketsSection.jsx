import React from 'react';
import Link from 'next/link';
import { MdAirlineSeatReclineNormal, MdAccessTime } from 'react-icons/md';

export default async function LatestTicketsSection() {
  let latestTickets = [];
  let isError = false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
      next: { revalidate: 60 } // Revalidates cache every 60s
    });

    if (!res.ok) {
      isError = true;
    } else {
      const allTickets = await res.json();
      
      // Filter for approved tickets, sort by newest, and grab exactly 6
      latestTickets = allTickets
        .filter(ticket => ticket.status === 'approved')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6); 
    }
  } catch (error) {
    console.error("Failed to load latest tickets:", error);
    isError = true;
  }

  if (isError || latestTickets.length === 0) {
    return null; 
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* ── Section Header ── */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <MdAccessTime className="text-[#35858E]" size={24} />
              <h2 className="text-sm font-black uppercase tracking-widest text-[#35858E]">
                Just Added
              </h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Latest Journeys
            </h3>
          </div>
          <Link href="/tickets" className="text-sm font-bold text-gray-500 hover:text-[#35858E] transition-colors">
            Explore All Tickets &rarr;
          </Link>
        </div>

        {/* ── Latest Tickets Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestTickets.map((ticket) => (
            <div 
              key={ticket._id} 
              className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col group hover:-translate-y-1 transition-transform duration-300"
            >
              
              {/* Image & Badges */}
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                <img 
                  src={ticket.imageUrl || "/placeholder.jpg"} 
                  alt={ticket.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                
                {/* Transport Type Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#35858E] shadow-sm">
                  {ticket.transport}
                </div>

                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 px-3 py-1.5 rounded-xl text-sm font-black shadow-sm">
                  ৳{ticket.price} <span className="text-[10px] font-bold uppercase opacity-80">/ unit</span>
                </div>

                {/* Title & Seats Overlaid on Image */}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h4 className="text-xl font-extrabold truncate drop-shadow-md mb-1">
                    {ticket.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-300 drop-shadow-sm">
                    <MdAirlineSeatReclineNormal size={16} className="text-[#A5D5D8]" />
                    <span>{ticket.quantity > 0 ? `${ticket.quantity} Seats Available` : <span className="text-rose-400 font-bold">Sold Out</span>}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                
                {/* Perks Array */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Included Perks</p>
                  <div className="flex flex-wrap gap-2">
                    {ticket.perks && ticket.perks.length > 0 ? (
                      ticket.perks.map((perk, index) => (
                        <span 
                          key={index} 
                          className="px-2.5 py-1 bg-[#EBF5F6] text-[#256069] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#D1E9EB]"
                        >
                          {perk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">Standard amenities</span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-2">
                  <Link 
                    href={`/tickets/${ticket._id}`}
                    className="w-full py-3.5 rounded-xl bg-gray-50 hover:bg-[#35858E] text-gray-700 hover:text-white text-sm font-black flex justify-center items-center transition-all duration-300 border border-gray-200 hover:border-[#35858E] hover:shadow-lg hover:shadow-[#35858E]/30"
                  >
                    See Details
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}