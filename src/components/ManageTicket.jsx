"use client";

import { useState } from "react";
import { FaCheck, FaTimes, FaBus, FaTrain, FaShip, FaPlane } from "react-icons/fa";
import { MdArrowForward, MdOutlineHourglassEmpty } from "react-icons/md";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const TRANSPORT_ICON = {
  bus:   <FaBus size={14} />,
  train: <FaTrain size={14} />,
  ship:  <FaShip size={14} />,
  plane: <FaPlane size={14} />,
};

const STATUS_MAP = {
  pending:  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200/60", label: "Pending" },
  approved: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200/60", label: "Approved" },
  rejected: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200/60", label: "Rejected" },
};

function formatDate(iso) {
  if (!iso) return "TBA";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export default function ManageTickets({ initialTickets = [] }) {
  const [tickets, setTickets] = useState(initialTickets);
  // Track which ticket is loading, and what action ('approved' or 'rejected') is being taken
  const [loadingState, setLoadingState] = useState({ id: null, action: null });

  async function updateStatus(id, newStatus) {
    setLoadingState({ id, action: newStatus });
    try {
       const { data, error } = await authClient.token();

      const {token} = data;
      console.log(token);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error("Request failed");

      setTickets((prev) =>
        prev.map((t) => {
          const tId = t._id?.$oid ?? t._id;
          return tId === id ? { ...t, status: newStatus } : t;
        })
      );
      
      toast.success(newStatus === "approved" ? "Ticket approved!" : "Ticket rejected!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingState({ id: null, action: null });
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
      
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Tickets</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Review, approve, or reject ticket listings submitted by vendors.
        </p>
      </div>

      {/* ── Premium Stats Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Total Listings", color: "bg-[#F4F7F8] text-[#35858E]", border: "border-[#35858E]/20", count: tickets.length },
          { label: "Needs Review",   color: "bg-amber-50 text-amber-700",  border: "border-amber-200/60", count: tickets.filter(t => t.status === "pending").length },
          { label: "Live / Approved", color: "bg-emerald-50 text-emerald-700", border: "border-emerald-200/60", count: tickets.filter(t => t.status === "approved").length },
        ].map(({ label, color, border, count }) => (
          <div key={label} className={`rounded-3xl px-6 py-5 border shadow-sm ${color} ${border} transition-transform hover:-translate-y-1 duration-300`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{label}</p>
            <p className="text-3xl font-black">{count}</p>
          </div>
        ))}
      </div>

      {/* ── Custom Premium Table ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-gray-100">
              <tr>
                {["Title", "Route", "Type", "Departure", "Price", "Seats", "Vendor", "Status", "Actions"].map((head) => (
                  <th key={head} className={`px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest ${head === 'Actions' ? 'text-center' : ''}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                      <FaBus size={40} className="mb-4 opacity-20" />
                      <p className="text-sm font-semibold">No tickets submitted yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => {
                  const id = ticket._id?.$oid ?? ticket._id;
                  const isApproving = loadingState.id === id && loadingState.action === "approved";
                  const isRejecting = loadingState.id === id && loadingState.action === "rejected";
                  const isAnyLoading = loadingState.id === id;
                  const cfg = STATUS_MAP[ticket.status] ?? STATUS_MAP.pending;

                  return (
                    <tr key={id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                      
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {ticket.title}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                          <span>{ticket.from}</span>
                          <MdArrowForward className="text-[#35858E]/60" size={14} />
                          <span>{ticket.to}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 capitalize font-medium">
                          <span className="w-7 h-7 rounded-full bg-[#EBF5F6] flex items-center justify-center text-[#35858E]">
                            {TRANSPORT_ICON[ticket.transport] ?? <FaBus size={12} />}
                          </span>
                          {ticket.transport}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {formatDate(ticket.departure)}
                      </td>
                      
                      <td className="px-6 py-4 font-black text-gray-900">
                        ৳{ticket.price}
                      </td>
                      
                      <td className="px-6 py-4 text-gray-600 font-semibold">
                        {ticket.quantity}
                      </td>
                      
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{ticket.vendorName}</p>
                        <p className="text-gray-400 text-xs font-medium mt-0.5">{ticket.vendorEmail}</p>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg border text-[11px] font-extrabold uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            disabled={ticket.status === "approved" || isAnyLoading}
                            onClick={() => updateStatus(id, "approved")}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 
                              ${ticket.status === "approved" ? "opacity-30 cursor-not-allowed bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-sm"}`}
                            title="Approve Ticket"
                          >
                            {isApproving ? <MdOutlineHourglassEmpty className="animate-spin" size={16} /> : <FaCheck size={14} />}
                          </button>
                          
                          <button
                            disabled={ticket.status === "rejected" || isAnyLoading}
                            onClick={() => updateStatus(id, "rejected")}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 
                              ${ticket.status === "rejected" ? "opacity-30 cursor-not-allowed bg-gray-100 text-gray-400" : "bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white shadow-sm"}`}
                            title="Reject Ticket"
                          >
                            {isRejecting ? <MdOutlineHourglassEmpty className="animate-spin" size={16} /> : <FaTimes size={14} />}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}