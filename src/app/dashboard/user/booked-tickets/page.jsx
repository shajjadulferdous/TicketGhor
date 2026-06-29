"use client";

import { authClient } from '@/lib/auth-client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  MdLocationOn, MdArrowForward, MdAccessTime, 
  MdEventSeat, MdOutlinePayment, MdHourglassEmpty 
} from 'react-icons/md';

// ── Status Badge Configuration ──
const STATUS_MAP = {
  pending:  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", label: "Pending Approval" },
  accepted: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", label: "Accepted - Payment Required" },
  paid:     { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", label: "Paid & Confirmed" },
  rejected: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", label: "Booking Rejected" },
};

export default function MyBookedTicketsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: session, isPending } = authClient.useSession();

const email = session?.user?.email;
console.log(email)
console.log(session)
useEffect(() => {
    // 1. If auth is still initializing, do nothing and let it spin
    if (isPending) return;

    // 2. If auth finished but there's no email, stop loading so it doesn't spin forever
    if (!email) {
        setIsLoading(false);
        return;
    }

    const fetchBookings = async () => {
        try {
            // FIX 1: Double-check your URL here! Ensure it shouldn't be `/api/user/bookings/`
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/bookings/${email}`,
                {
                    // FIX 2: Prevent Next.js/Browser from caching a previously empty result
                    cache: 'no-store',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!res.ok) throw new Error("Bad response from server");

            const data = await res.json();
            console.log(data);
            // FIX 3: Safely extract the array in case your backend wraps it in an object
            // e.g., if backend sends { success: true, bookings: [...] }
            let validBookings = [];
            if (Array.isArray(data)) {
                validBookings = data;
            } else if (data && data.bookings) {
                validBookings = data.bookings;
            } else if (data && data.data) {
                validBookings = data.data;
            }
            
            console.log("Fetched bookings:", validBookings); // Check your console!
            setBookings(validBookings);

        } catch (err) {
            console.error(err);
            toast.error("Could not load your bookings.");
            setBookings([]); // Ensure it stays an array even on error
        } finally {
            setIsLoading(false);
        }
    };

    fetchBookings();
}, [email, isPending]);

  if (isLoading || isPending) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-[#35858E]">
        <MdHourglassEmpty className="animate-spin mb-4" size={40} />
        <p className="text-sm font-bold animate-pulse text-gray-500">Loading your journeys...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Booked Tickets</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Track your booking status, complete payments, and manage your upcoming travels.
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <MdEventSeat size={48} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings yet</h3>
          <p className="text-gray-500 font-medium">You haven't booked any tickets. Head over to the tickets page to find your next journey.</p>
        </div>
      )}
    </div>
  );
}

// ── Isolated Card Component (Handles its own countdown state) ──
function BookingCard({ booking }) {
  const { ticketId: ticket, quantity, totalPrice, status, _id: bookingId } = booking;
  
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Countdown Logic
  useEffect(() => {
    if (!ticket?.departure || status === 'rejected' || status === 'paid') return;

    const departureTime = new Date(ticket.departure).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = departureTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsExpired(true);
        setTimeLeft("Departure Passed");
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [ticket?.departure, status]);

  // Stripe Payment Handler
  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // Create a Stripe Checkout Session on your backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) throw new Error("Payment initialization failed");
      
      const { url } = await res.json();
      
      
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to process payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const statusCfg = STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.pending;
  const departureDate = new Date(ticket?.departure).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute:"2-digit" });

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/40 border border-gray-100 flex flex-col transition-transform hover:-translate-y-1 duration-300">
      
      {/* ── Image & Top Badges ── */}
      <div className="relative h-40 bg-gray-100">
        <img 
          src={ticket?.imageUrl || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600"} 
          alt={ticket?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
          {statusCfg.label}
        </div>

        {/* Route Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm font-bold truncate drop-shadow-md mb-1">{ticket?.title}</p>
          <div className="flex items-center gap-2 drop-shadow-md">
            <MdLocationOn className="text-[#A5D5D8]" size={16} />
            <span className="font-extrabold tracking-tight">{ticket?.from}</span>
            <MdArrowForward className="text-[#A5D5D8]/80" size={14} />
            <span className="font-extrabold tracking-tight">{ticket?.to}</span>
          </div>
        </div>
      </div>


      <div className="p-5 flex flex-col flex-grow">
        

        <div className="flex justify-between items-center mb-5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Quantity</p>
            <p className="text-sm font-black text-gray-800 flex items-center gap-1">
              <MdEventSeat className="text-[#35858E]" /> {quantity} Seats
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Price</p>
            <p className="text-lg font-black text-gray-900">৳{totalPrice?.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Departure</p>
            <p className="text-xs font-bold text-gray-700">{departureDate}</p>
          </div>

          {/* Conditional Countdown Display */}
          {status !== 'rejected' && status !== 'paid' && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Time Remaining</p>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${isExpired ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-[#EBF5F6] text-[#256069] border-[#D1E9EB]'}`}>
                <MdAccessTime size={14} />
                {timeLeft || "Calculating..."}
              </div>
            </div>
          )}
        </div>


<div className="mt-auto">
  {status?.toLowerCase() === 'accepted' ? (
    <button
      onClick={handlePayment}
      disabled={isExpired || isProcessingPayment}
      className={`w-full py-3 rounded-xl font-black flex justify-center items-center gap-2 transition-all duration-300 ${
        isExpired 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
          : "bg-[#35858E] hover:bg-[#256069] text-white shadow-lg shadow-[#35858E]/30"
      }`}
    >
      {isProcessingPayment ? (
        "Redirecting..."
      ) : isExpired ? (
        "Payment Expired"
      ) : (
        <>
          <MdOutlinePayment size={18} />
          Pay Now
        </>
      )}
    </button>
  ) : (
    <div className="w-full py-3 text-center rounded-xl bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest border border-gray-100">
      {status?.toLowerCase() === 'pending' 
        ? "Awaiting Vendor Approval" 
        : status?.toLowerCase() === 'paid' 
          ? "Payment Completed" 
          : "Booking Cancelled"}
    </div>
  )}
</div>

      </div>
    </div>
  );
}