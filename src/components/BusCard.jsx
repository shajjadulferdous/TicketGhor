"use client";

import { FaBus, FaWifi, FaUtensils, FaSnowflake, FaChair } from "react-icons/fa";
import { MdLocationOn, MdArrowForward, MdAccessTime } from "react-icons/md";

const PERK_CONFIG = {
  breakfast: { icon: <FaUtensils size={12} />, label: "Breakfast" },
  ac:        { icon: <FaSnowflake size={12} />, label: "AC" },
  wifi:      { icon: <FaWifi size={12} />, label: "Wi-Fi" },
  recliner:  { icon: <FaChair size={12} />, label: "Recliner" },
};

const STATUS_CONFIG = {
  pending:  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200/60", label: "Pending" },
  approved: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200/60", label: "Approved" },
  rejected: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200/60", label: "Rejected" },
};

function formatDeparture(isoString) {
  if (!isoString) return { date: "TBA", time: "TBA" };
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
}

export default function BusCard({ listing }) {
  const {
    title,
    from,
    to,
    price,
    quantity,
    departure,
    perks = [],
    imageUrl,
    vendorName,
    status,
  } = listing || {};

  const { date, time } = formatDeparture(departure);
  const statusCfg = STATUS_CONFIG[status] ?? { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: status || "Unknown" };

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/40 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 font-sans group">
      
      {/* ── Compact Header ── */}
      <div className="bg-gradient-to-r from-[#35858E] to-[#256069] px-5 py-4 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6" />
        
        <div className="relative z-10 flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <FaBus className="text-white/90" size={12} />
          </div>
          <span className="text-white/90 text-sm font-bold tracking-wide">{title}</span>
        </div>
        
        <div className="relative z-10 flex items-center gap-2">
          <MdLocationOn className="text-[#A5D5D8]" size={18} />
          <span className="text-white font-extrabold text-lg tracking-tight">{from}</span>
          <MdArrowForward className="text-[#A5D5D8]/70" size={16} />
          <span className="text-white font-extrabold text-lg tracking-tight">{to}</span>
        </div>
      </div>

      {/* ── Compact Image ── */}
      <div className="relative h-32 overflow-hidden bg-gray-100">
        <img
          src={imageUrl || "/placeholder-bus.jpg"}
          alt={`${from} to ${to}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
      </div>

      {/* ── Tighter Body ── */}
      <div className="p-5">
        
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          <InfoItem label="Date" value={date} />
          <InfoItem
            label="Time"
            value={time}
            icon={<MdAccessTime size={15} className="text-[#35858E]" />}
          />
          <InfoItem label="Availability" value={`${quantity} seats left`} />
          <InfoItem label="Operator" value={vendorName} />
        </div>

        <div className="w-full h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 my-4" />

        {/* Perks */}
        <div className="flex flex-wrap gap-2">
          {perks.map((perk) => {
            const cfg = PERK_CONFIG[perk];
            if (!cfg) return null;
            return (
              <div
                key={perk}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EBF5F6] border border-[#D1E9EB] text-[#256069] text-[11px] font-bold shadow-sm"
              >
                <span className="text-[#35858E]">{cfg.icon}</span>
                {cfg.label}
              </div>
            );
          })}
          {perks.length === 0 && (
            <span className="text-xs text-gray-400 font-medium italic">No special amenities</span>
          )}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 my-4" />

        {/* Footer row */}
        <div className="flex items-end justify-between mt-1">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price / seat</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900 leading-none">৳{price}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2.5">
            <div className={`px-2.5 py-0.5 rounded-md border text-[10px] font-extrabold uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
              {statusCfg.label}
            </div>
            
            <button className="bg-gradient-to-r from-[#35858E] to-[#256069] hover:from-[#2a6a71] hover:to-[#1d4b52] text-white text-sm font-bold py-2 px-5 rounded-xl shadow-md shadow-[#35858E]/25 transition-all transform hover:-translate-y-0.5 active:scale-95 outline-none">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Compact Sub-component ──
function InfoItem({ label, value, icon }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5 leading-tight">
        {icon}
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}