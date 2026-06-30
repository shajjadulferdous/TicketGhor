import React from 'react';
import Link from 'next/link';
import { MdPlace, MdTrendingUp, MdArrowForward } from 'react-icons/md';

export default function PopularDestinations() {
  // Curated premium destination routes with Unsplash travel images
  const destinations = [
    {
      id: 1,
      route: "Dhaka to Cox's Bazar",
      image: "https://images.unsplash.com/photo-1589922264634-118858e7278d?q=80&w=600&auto=format&fit=crop", // Longest beach
      startingPrice: "900",
      duration: "8-9 hours",
      searchQuery: "?from=Dhaka&to=CoxsBazar"
    },
    {
      id: 2,
      route: "Dhaka to Sylhet",
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=600&auto=format&fit=crop", // Tea gardens/Rainforest
      startingPrice: "650",
      duration: "5-6 hours",
      searchQuery: "?from=Dhaka&to=Sylhet"
    },
    {
      id: 3,
      route: "Dhaka to Chittagong",
      image: "https://images.unsplash.com/photo-1622210190518-e2eb70ee97e2?q=80&w=600&auto=format&fit=crop", // Port city/Hills
      startingPrice: "700",
      duration: "5 hours",
      searchQuery: "?from=Dhaka&to=Chittagong"
    },
    {
      id: 4,
      route: "Dhaka to Rajshahi",
      image: "https://images.unsplash.com/photo-1623945419894-3a2b535497ee?q=80&w=600&auto=format&fit=crop", // Silk/Mango city
      startingPrice: "600",
      duration: "6 hours",
      searchQuery: "?from=Dhaka&to=Rajshahi"
    }
  ];

  return (
    <section className="py-20 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* ── Section Header ── */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <MdTrendingUp className="text-[#35858E]" size={24} />
              <h2 className="text-sm font-black uppercase tracking-widest text-[#35858E]">
                Trending Routes
              </h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Popular Destinations
            </h3>
          </div>
          <p className="text-sm font-bold text-gray-400 max-w-xs md:text-right">
            Based on recent bookings from thousands of travelers this week.
          </p>
        </div>

        {/* ── Destinations Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Link 
              key={dest.id}
              href={`/tickets${dest.searchQuery}`}
              className="group relative h-[360px] rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 block"
            >
              {/* Background Image with Hover Zoom */}
              <img 
                src={dest.image} 
                alt={dest.route}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />
              
              {/* Content Layout */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                
                {/* Location Icon Tag */}
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 text-white group-hover:bg-[#35858E] transition-colors duration-300">
                  <MdPlace size={18} />
                </div>

                {/* Route Title */}
                <h4 className="text-xl font-black tracking-tight mb-1 drop-shadow-sm group-hover:text-[#A5D5D8] transition-colors">
                  {dest.route}
                </h4>

                {/* Subdetails Panel */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs font-bold text-gray-300">
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 tracking-wider font-medium">Starts From</span>
                    <span className="text-white text-sm font-black">৳{dest.startingPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase text-gray-400 tracking-wider font-medium">Avg. Time</span>
                    <span className="text-white font-black">{dest.duration}</span>
                  </div>
                </div>

                {/* Floating Action Button inside card */}
                <div className="absolute bottom-6 right-6 w-9 h-9 bg-white text-gray-900 rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
                  <MdArrowForward size={18} className="text-[#35858E]" />
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}