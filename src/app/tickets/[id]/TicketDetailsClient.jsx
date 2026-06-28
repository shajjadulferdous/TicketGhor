"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  MdLocationOn, MdArrowForward, MdAccessTime, MdEventSeat, 
  MdClose, MdOutlineHourglassEmpty 
} from 'react-icons/md';
import { FaBus, FaTrain, FaShip, FaPlane } from 'react-icons/fa';

const TRANSPORT_ICON = {
  bus: <FaBus size={20} />, train: <FaTrain size={20} />, 
  ferry: <FaShip size={20} />, flight: <FaPlane size={20} />
};

export default function TicketDetailsClient({ ticket }) {
  const router = useRouter();
  
  // ── States ──
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Countdown Timer Logic ──
  useEffect(() => {
    if (!ticket?.departure) return;

    const departureTime = new Date(ticket.departure).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = departureTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsExpired(true);
        setTimeLeft("Departure time has passed");
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [ticket?.departure]);
  
  // ── Booking Submission Logic ──
  const handleBookTicket = async (e) => {
    e.preventDefault();
    
    // Safety check: Booking quantity can't be greater than Ticket Quantity
    if (quantity > ticket.quantity) {
      return toast.error(`You cannot book more than ${ticket.quantity} tickets.`);
    }
    if (quantity <= 0) {
      return toast.error("Quantity must be at least 1.");
    }

    setIsSubmitting(true);

    try {
      // POST to your bookings API. Status defaults to "Pending" on the backend.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket._id || ticket.id,
          quantity: Number(quantity),
          totalPrice: Number(quantity) * Number(ticket.price),
          // Note: You might also need to pass a userId or userEmail here from your auth context
        }),
      });

      if (!res.ok) throw new Error("Failed to book ticket");

      toast.success("Booking submitted! Status: Pending.");
      setIsModalOpen(false);
      
      // Redirect to "My Booked Tickets" page
      router.push('/dashboard/user/my-booked-tickets');
      
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Button Disable Logic ──
  const isSoldOut = ticket.quantity <= 0;
  const isButtonDisabled = isExpired || isSoldOut;

  return (
    <div className="min-h-screen bg-[#F4F7F8] font-sans py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* ── Ticket Details Card ── */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col md:flex-row">
          
          {/* Left Side: Image & Timer */}
          <div className="w-full md:w-5/12 relative h-64 md:h-auto bg-gray-100">
            <img 
              src={ticket.imageUrl || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600"} 
              alt={ticket.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
            
            {/* Live Countdown Badge */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Time to Departure</p>
              <div className={`px-4 py-2 rounded-xl backdrop-blur-md font-black tracking-wider text-sm inline-flex items-center gap-2 border ${isExpired ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' : 'bg-black/30 text-white border-white/20'}`}>
                <MdAccessTime size={18} />
                {timeLeft || "Calculating..."}
              </div>
            </div>
          </div>

          {/* Right Side: Info & Actions */}
          <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-black text-gray-900 leading-tight">{ticket.title}</h1>
              <span className="w-12 h-12 rounded-full bg-[#EBF5F6] flex items-center justify-center text-[#35858E] shrink-0">
                {TRANSPORT_ICON[ticket.transport?.toLowerCase()] || <FaBus size={20} />}
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-600 mb-8">
              <MdLocationOn className="text-[#35858E]" size={22} />
              <span className="font-extrabold text-lg">{ticket.from}</span>
              <MdArrowForward className="text-gray-300" size={20} />
              <span className="font-extrabold text-lg">{ticket.to}</span>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price per seat</p>
                <p className="text-2xl font-black text-gray-900">৳{ticket.price}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Available Seats</p>
                <p className="text-lg font-bold text-[#35858E] flex items-center gap-1.5">
                  <MdEventSeat size={18} />
                  {isSoldOut ? "Sold Out" : ticket.quantity}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amenities Provided</p>
                <div className="flex flex-wrap gap-2">
                  {ticket.perks?.length > 0 ? ticket.perks.map(perk => (
                    <span key={perk} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600 capitalize">
                      {perk}
                    </span>
                  )) : <span className="text-sm text-gray-400 italic">Standard seating</span>}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-6 border-t border-gray-100">
              <button
                disabled={isButtonDisabled}
                onClick={() => setIsModalOpen(true)}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 ${
                  isButtonDisabled 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-[#35858E] hover:bg-[#256069] text-white shadow-lg shadow-[#35858E]/30 hover:-translate-y-1"
                }`}
              >
                {isExpired ? "Departure Passed" : isSoldOut ? "Sold Out" : "Book Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-900">Confirm Booking</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-rose-500 transition-colors">
                <MdClose size={24} />
              </button>
            </div>

            <form onSubmit={handleBookTicket} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  How many tickets do you want?
                </label>
                <input
                  type="number"
                  min="1"
                  max={ticket.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 font-bold focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E]"
                  required
                />
                <p className="text-xs text-gray-500 font-medium mt-2">
                  Maximum available: <span className="font-bold text-[#35858E]">{ticket.quantity}</span>
                </p>
              </div>

              <div className="bg-[#F4F7F8] p-4 rounded-xl mb-8 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Total Price:</span>
                <span className="text-2xl font-black text-gray-900">৳{(quantity * ticket.price).toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#35858E] hover:bg-[#256069] text-white font-black py-4 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <MdOutlineHourglassEmpty className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : "Confirm & Book"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}