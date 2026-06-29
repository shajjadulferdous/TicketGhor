"use client";

import { authClient } from '@/lib/auth-client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MdCheck, MdClose, MdHourglassEmpty, MdAssignment } from 'react-icons/md';

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  paid: "bg-teal-50 text-teal-700 border-teal-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200"
};

export default function RequestedBookingsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const { data: session, isPending } = authClient.useSession();
  const vendorEmail = session?.user?.email;

  // Fetch incoming booking requests
  const fetchRequests = async () => {
    if (!vendorEmail) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/bookings/${vendorEmail}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error("Failed to load requests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load booking requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending) {
      if (vendorEmail) {
        fetchRequests();
      } else {
        setIsLoading(false);
      }
    }
  }, [vendorEmail, isPending]);

  // Handle Accept or Reject Actions
  const handleStatusUpdate = async (bookingId, action) => {
    setProcessingId(bookingId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }), // "accepted" or "rejected"
      });

      if (!res.ok) throw new Error("Action execution failed");

      toast.success(`Booking request ${action}!`);
      
      // Optimistically update UI local state instantly
      setRequests(prev => prev.map(req => 
        req._id === bookingId ? { ...req, status: action } : req
      ));
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading || isPending) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-[#35858E]">
        <MdHourglassEmpty className="animate-spin mb-4" size={40} />
        <p className="text-sm font-bold animate-pulse text-gray-500">Loading requested bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Requested Bookings</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Manage, accept, or decline passenger seat reservation requests instantly.
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <th className="py-5 px-6">Customer Details</th>
                  <th className="py-5 px-6">Ticket Title</th>
                  <th className="py-5 px-6 text-center">Quantity</th>
                  <th className="py-5 px-6">Total Value</th>
                  <th className="py-5 px-6 text-center">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                {requests.map((req) => {
                  const normalizedStatus = (req.status || 'pending').toLowerCase();
                  
                  return (
                    <tr key={req._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* User Info */}
                      <td className="py-5 px-6">
                        <div className="font-bold text-gray-900">{req.userName}</div>
                        <div className="text-xs text-gray-400 font-medium mt-0.5">{req.userEmail}</div>
                      </td>
                      
                      {/* Ticket Title */}
                      <td className="py-5 px-6 font-bold text-gray-800">
                        {req.ticketTitle || "Unknown Route"}
                      </td>
                      
                      {/* Booking Quantity */}
                      <td className="py-5 px-6 text-center font-black text-gray-900">
                        {req.quantity}
                      </td>
                      
                      {/* Total Price */}
                      <td className="py-5 px-6 font-black text-gray-900 text-base">
                        ৳{req.totalPrice?.toLocaleString() || 0}
                      </td>
                      
                      {/* Action Cell */}
                      <td className="py-5 px-6 text-center">
                        {normalizedStatus === 'pending' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              disabled={processingId !== null}
                              onClick={() => handleStatusUpdate(req._id, 'accepted')}
                              className="px-3 py-1.5 rounded-xl bg-[#35858E] hover:bg-[#256069] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-[#35858E]/20 transition-all disabled:opacity-50"
                            >
                              <MdCheck size={14} /> Accept
                            </button>
                            <button
                              disabled={processingId !== null}
                              onClick={() => handleStatusUpdate(req._id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-500/20 transition-all disabled:opacity-50"
                            >
                              <MdClose size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${STATUS_STYLE[normalizedStatus] || STATUS_STYLE.pending}`}>
                            {normalizedStatus === 'accepted' ? 'Accepted' : normalizedStatus === 'paid' ? 'Paid & Confirmed' : 'Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <MdAssignment size={48} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No incoming requests</h3>
          <p className="text-gray-500 font-medium">When users attempt to book your route schedules, their requests will appear here dynamically.</p>
        </div>
      )}
    </div>
  );
}