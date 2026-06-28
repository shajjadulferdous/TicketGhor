"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { FaBus, FaTrain, FaShip, FaPlane, FaWifi, FaUtensils, FaSnowflake, FaChair } from "react-icons/fa";
import { MdLocationOn, MdArrowForward, MdAccessTime, MdEventSeat } from "react-icons/md";

// Icon configurations
const TRANSPORT_CONFIG = {
  bus:   { icon: <FaBus size={14} />,   label: "Bus" },
  train: { icon: <FaTrain size={14} />, label: "Train" },
  ferry: { icon: <FaShip size={14} />,  label: "Ferry" },
  flight:{ icon: <FaPlane size={14} />, label: "Flight" },
};

const PERK_CONFIG = {
  breakfast: { icon: <FaUtensils size={11} />, label: "Breakfast" },
  ac:        { icon: <FaSnowflake size={11} />, label: "AC" },
  wifi:      { icon: <FaWifi size={11} />, label: "Wi-Fi" },
  recliner:  { icon: <FaChair size={11} />, label: "Recliner" },
};

// Date formatter helper
function formatDeparture(isoString) {
  if (!isoString) return { date: "TBA", time: "TBA" };
  const dateObj = new Date(isoString);
  return {
    date: dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    time: dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
}

export default function TicketCard({ ticket }) {
  const {
    title = "Premium Journey",
    from = "Origin",
    to = "Destination",
    transport = "bus",
    price = 0,
    quantity = 0,
    departure,
    perks = [],
    imageUrl,
  } = ticket || {};

  const { date, time } = formatDeparture(departure);
  const transCfg = TRANSPORT_CONFIG[transport?.toLowerCase()] ?? TRANSPORT_CONFIG.bus;

  return (
    <div className="w-full max-w-[340px] bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/40 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 font-sans group flex flex-col">
      
      {/* ── Image & Transport Badge ── */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop"}
          alt={`${from} to ${to}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
        
        {/* Transport Type Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[#35858E] text-xs font-black shadow-md border border-white/20">
          {transCfg.icon}
          <span className="uppercase tracking-wider">{transCfg.label}</span>
        </div>

        {/* Route Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/90 text-sm font-bold truncate drop-shadow-md">{title}</span>
          </div>
          <div className="flex items-center gap-2 text-white drop-shadow-md">
            <MdLocationOn className="text-[#A5D5D8]" size={18} />
            <span className="font-extrabold text-lg tracking-tight truncate">{from}</span>
            <MdArrowForward className="text-[#A5D5D8]/80 shrink-0" size={16} />
            <span className="font-extrabold text-lg tracking-tight truncate">{to}</span>
          </div>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Info Grid (Date, Time, Quantity) */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4">
          <InfoItem label="Departure Date" value={date} />
          <InfoItem 
            label="Boarding Time" 
            value={time} 
            icon={<MdAccessTime size={14} className="text-[#35858E]" />} 
          />
          <InfoItem 
            label="Available Seats" 
            value={`${quantity} remaining`} 
            icon={<MdEventSeat size={14} className="text-[#35858E]" />} 
          />
        </div>

        {/* Perks / Amenities */}
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-1.5">
            {perks.length > 0 ? (
              perks.map((perk) => {
                const cfg = PERK_CONFIG[perk];
                if (!cfg) return null;
                return (
                  <div
                    key={perk}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#EBF5F6] border border-[#D1E9EB] text-[#256069] text-[10px] font-bold shadow-sm"
                  >
                    <span className="text-[#35858E]">{cfg.icon}</span>
                    {cfg.label}
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-gray-400 font-medium italic">Standard seating</span>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div className="w-full h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 mb-4" />
          
          {/* Footer: Price & Action */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price per unit</p>
              <div className="flex items-baseline text-gray-900">
                <span className="text-sm font-bold mr-0.5">৳</span>
                <span className="text-2xl font-black leading-none">{price}</span>
              </div>
            </div>
            
            <Link href={`/tickets/${ticket?._id}`} className="bg-gradient-to-r from-[#35858E] to-[#256069] hover:from-[#2a6a71] hover:to-[#1d4b52] text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-md shadow-[#35858E]/25 transition-all transform hover:-translate-y-0.5 active:scale-95 outline-none flex items-center gap-2">
              See details
              <MdArrowForward size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared Mini-Component for Stats ──
function InfoItem({ label, value, icon }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5 leading-tight">
        {icon}
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}