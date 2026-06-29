"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MdCampaign, MdLocationOn, MdArrowForward } from 'react-icons/md';

export default function AdvertiseClient({ initialTickets }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [processingId, setProcessingId] = useState(null);

    // Calculate how many tickets are currently advertised
    const advertisedCount = tickets.filter(t => t.isAdvertised).length;

    const handleToggleAdvertise = async (ticket) => {
        const currentlyAdvertised = ticket.isAdvertised;

        // ── Rule: Cannot advertise more than 6 tickets ──
        if (!currentlyAdvertised && advertisedCount >= 6) {
            toast.error("Limit reached! You cannot advertise more than 6 tickets.");
            return;
        }

        setProcessingId(ticket._id);

        try {
            // Send PATCH request to backend to update advertisement status
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticket._id}/advertise`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAdvertised: !currentlyAdvertised })
            });

            if (!res.ok) throw new Error("Failed to update status");

            // Optimistically update the UI
            setTickets(prev => prev.map(t => 
                t._id === ticket._id ? { ...t, isAdvertised: !currentlyAdvertised } : t
            ));

            if (!currentlyAdvertised) {
                toast.success("Ticket added to homepage advertisements!");
            } else {
                toast.success("Advertisement removed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    if (tickets.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <MdCampaign size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Approved Tickets</h3>
                <p className="text-gray-500 font-medium">There are currently no approved tickets available to advertise.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
            
            {/* Status Bar */}
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Advertising Capacity</span>
                <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${advertisedCount === 6 ? 'bg-amber-500' : 'bg-[#35858E]'}`} 
                            style={{ width: `${(advertisedCount / 6) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-black text-gray-900">{advertisedCount} / 6</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-400">
                            <th className="py-5 px-6">Ticket Details</th>
                            <th className="py-5 px-6">Route</th>
                            <th className="py-5 px-6 text-center">Departure</th>
                            <th className="py-5 px-6 text-right">Toggle Promotion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                        {tickets.map((ticket) => (
                            <tr key={ticket._id} className="hover:bg-gray-50/70 transition-colors">
                                
                                {/* Ticket Info */}
                                <td className="py-5 px-6 flex items-center gap-4">
                                    <img 
                                        src={ticket.imageUrl || "/placeholder-bus.jpg"} 
                                        alt={ticket.title} 
                                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                    />
                                    <div>
                                        <div className="font-bold text-gray-900">{ticket.title}</div>
                                        <div className="text-xs text-gray-400 uppercase font-bold mt-0.5">{ticket.transport} • ৳{ticket.price}</div>
                                    </div>
                                </td>
                                
                                {/* Route */}
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <span className="font-bold">{ticket.from}</span>
                                        <MdArrowForward className="text-gray-400" size={14} />
                                        <span className="font-bold">{ticket.to}</span>
                                    </div>
                                </td>
                                
                                {/* Departure */}
                                <td className="py-5 px-6 text-center">
                                    <div className="font-bold text-gray-700">
                                        {new Date(ticket.departure).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {new Date(ticket.departure).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </td>
                                
                                {/* Toggle Action */}
                                <td className="py-5 px-6 text-right">
                                    <button
                                        onClick={() => handleToggleAdvertise(ticket)}
                                        disabled={processingId === ticket._id}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                            ticket.isAdvertised ? 'bg-[#35858E]' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                                ticket.isAdvertised ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}