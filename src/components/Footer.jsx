import React from 'react';
import Link from 'next/link';
import { 
  MdEmail, 
  MdPhone, 
  MdConfirmationNumber 
} from 'react-icons/md';
import { 
  FaFacebook, 
  FaStripe, 
  FaCcVisa, 
  FaCcMastercard 
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 font-sans border-t-4 border-[#35858E]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* ── 4-Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-[#35858E] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-[#2b6d75] transition-colors">
                <MdConfirmationNumber size={24} className="-rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Ticket<span className="text-[#35858E]">Ghor</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-xs">
              Book bus, train, launch & flight tickets easily. Your premium gateway to seamless and secure travel experiences.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-base font-extrabold mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-[#35858E] hover:translate-x-1 inline-block transition-all duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="hover:text-[#35858E] hover:translate-x-1 inline-block transition-all duration-300">
                  All Tickets
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#35858E] hover:translate-x-1 inline-block transition-all duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#35858E] hover:translate-x-1 inline-block transition-all duration-300">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-white text-base font-extrabold mb-5 uppercase tracking-wider">Contact Info</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li>
                <a href="mailto:support@ticketbari.com" className="flex items-center gap-3 hover:text-[#35858E] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                    <MdEmail size={16} />
                  </div>
                  support@ticketghor.com
                </a>
              </li>
              <li>
                <a href="tel:+8801234567890" className="flex items-center gap-3 hover:text-[#35858E] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                    <MdPhone size={16} />
                  </div>
                  +880 1234 567 890
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#35858E] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                    <FaFacebook size={16} />
                  </div>
                  TicketGhor Official
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div>
            <h4 className="text-white text-base font-extrabold mb-5 uppercase tracking-wider">Secure Payments</h4>
            <p className="text-xs text-gray-400 font-medium mb-4">
              We guarantee 100% secure payments via our encrypted Stripe payment gateway.
            </p>
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-md px-2 py-1 flex items-center justify-center shadow-sm">
                <FaStripe className="text-[#635BFF]" size={36} />
              </div>
              <div className="bg-white rounded-md px-2 py-1.5 flex items-center justify-center shadow-sm">
                <FaCcVisa className="text-[#1434CB]" size={28} />
              </div>
              <div className="bg-white rounded-md px-2 py-1.5 flex items-center justify-center shadow-sm">
                <FaCcMastercard className="text-[#EB001B]" size={28} />
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-gray-500">
            &copy; 2025 TicketGhor. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-medium text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}