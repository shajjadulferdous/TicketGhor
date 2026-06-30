'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Spinner } from '@heroui/react';
import { 
  FaUserCircle, FaPlusCircle, FaTicketAlt, FaListAlt, FaChartLine,
  FaUserShield, FaUsers, FaAd, FaUser, FaHistory, FaBars, FaTimes
} from 'react-icons/fa';
import { Playfair_Display } from 'next/font/google';

// Premium font for the brand logo inside the sidebar (Desktop)
const playfair = Playfair_Display({ 
    subsets: ['latin'], 
    weight: ['700', '900'],
    display: 'swap',
});

// Define the routes for each role
const SIDEBAR_ROUTES = {
  vendor: [
    { label: 'Vendor Profile', href: '/dashboard/vendor/', icon: FaUserCircle },
    { label: 'Add Ticket', href: '/dashboard/vendor/add-ticket', icon: FaPlusCircle },
    { label: 'My Added Tickets', href: '/dashboard/vendor/tickets', icon: FaTicketAlt },
    { label: 'Requested Bookings', href: '/dashboard/vendor/bookings', icon: FaListAlt },
    { label: 'Revenue Overview', href: '/dashboard/vendor/revenue', icon: FaChartLine },
  ],
  admin: [
    { label: 'Admin Profile', href: '/dashboard/admin/', icon: FaUserShield },
    { label: 'Manage Tickets', href: '/dashboard/admin/manage-tickets', icon: FaTicketAlt },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: FaUsers },
    { label: 'Advertise Tickets', href: '/dashboard/admin/advertise', icon: FaAd },
  ],
  user: [
    { label: 'User Profile', href: '/dashboard/user/', icon: FaUser },
    { label: 'My Booked Tickets', href: '/dashboard/user/booked-tickets', icon: FaTicketAlt },
    { label: 'Transaction History', href: '/dashboard/user/transactions', icon: FaHistory },
  ]
};

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { data: session, isPending } = authClient.useSession();

  // 1. Wait for component to mount on the client to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // 2. Check both isPending AND isMounted before rendering the authenticated UI
  if (!isMounted || isPending) {
    return (
      <div className="hidden md:flex h-screen w-64 items-center justify-center border-r border-gray-200 bg-white">
        <Spinner size="lg" className="text-[#35858E]" />
      </div>
    );
  }

  // Safe fallbacks 
  const user = session?.user;
  if (!user) return null; 

  const userRole = user?.role || 'user'; 
  const links = SIDEBAR_ROUTES[userRole] || SIDEBAR_ROUTES['user'];

  return (
    <>
      {/* Mobile Toggle Button - Positioned below the NavBar */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-[90px] left-4 z-40 md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-slate-600 hover:text-[#35858E] transition-colors"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Sidebar Header / Logo (Desktop Only) */}
          <div className="hidden md:flex h-20 items-center justify-center border-b border-gray-100 px-6">
            <Link href="/" className={`${playfair.className} flex items-center select-none`}>
              <span className="text-2xl font-black tracking-tight text-[#35858E]">
                Ticket
              </span>
              <span className="text-2xl font-semibold text-slate-800 tracking-wide">
                Ghor
              </span>
            </Link>
          </div>

          {/* Mobile Sidebar Header (Shows when off-canvas is open) */}
          <div className="flex md:hidden h-20 items-center justify-between border-b border-gray-100 px-6">
            <span className="font-bold text-slate-800">Menu</span>
            <button onClick={toggleSidebar} className="text-slate-400 hover:text-red-500">
               <FaTimes size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
            <div className="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {userRole} Dashboard
            </div>
            
            {links.map((route, index) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;

              return (
                <Link
                  key={index}
                  href={route.href}
                  onClick={() => setIsOpen(false)} 
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-[#35858E]/10 text-[#35858E] font-bold' 
                      : 'text-slate-600 hover:bg-gray-50 hover:text-[#35858E] font-medium'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`${isActive ? 'text-[#35858E]' : 'text-slate-400 group-hover:text-[#35858E]'} transition-colors`} 
                  />
                  <span className="text-sm">{route.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary at Bottom */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-[#35858E] flex items-center justify-center text-white font-bold uppercase shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {user?.name || 'Guest User'}
                </span>
                <span className="text-xs text-slate-500 truncate capitalize font-medium">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;