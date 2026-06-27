'use client'
import { authClient } from '@/lib/auth-client';
import { Spinner } from '@heroui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Playfair_Display } from 'next/font/google';

// Load the premium font
const playfair = Playfair_Display({ 
    subsets: ['latin'], 
    weight: ['600', '700', '900'],
    display: 'swap',
});

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const router = useRouter();
    const pathname = usePathname();
    
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const userRole = user?.role || 'user';

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Determine correct dashboard route based on user role
    const getDashboardRoute = () => {
      switch (userRole) {
        case 'admin': return '/dashboard/admin/profile';
        case 'vendor': return '/dashboard/vendor/profile';
        default: return '/dashboard/user/profile';
      }
    };

    const dashboardRoute = getDashboardRoute();

    const handleLogout = async () => {
      await authClient.signOut(); 
      router.push('/');
      router.refresh();
    };
    
    // Helper function for active link styling
    const getLinkStyles = (href) => {
        const isActive = pathname === href;
        return isActive 
            ? "bg-[#35858E] text-white px-4 py-2 rounded-full font-semibold transition-all"
            : "text-slate-600 hover:text-[#35858E] px-4 py-2 font-medium transition-all";
    };

    return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link href="/" className={`${playfair.className} flex items-center select-none`}>
            <span className="text-2xl md:text-3xl font-black tracking-tight text-[#35858E]">
              Ticket
            </span>
            <span className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-wide">
              Ghor
            </span>
          </Link>
        </div>
        
        {/* Center: Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-2">
            <li>
                <Link href="/" className={getLinkStyles('/')}>Home</Link>
            </li>
            <li>
                <Link href="/tickets" className={getLinkStyles('/tickets')}>All Tickets</Link>
            </li>
            {user && (
            <li>
                <Link href={dashboardRoute} className={getLinkStyles(dashboardRoute)}>Dashboard</Link>
            </li>
            )}
        </ul>
        
        {/* Right Side: Auth / Profile & Mobile Toggle */}
        <div className="flex items-center gap-4">
          
          {/* Desktop Auth / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <Spinner size="sm" color="current" className="text-[#35858E]" />
            ) : user ? ( 
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 border-2 border-transparent hover:border-[#35858E] transition-all overflow-hidden focus:outline-none"
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#35858E] font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm text-slate-800 font-bold truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      href={dashboardRoute}
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#35858E]/10 hover:text-[#35858E] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/my-profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#35858E]/10 hover:text-[#35858E] transition-colors"
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors mt-1"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-[#35858E] transition-colors">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm font-bold bg-[#35858E] text-white px-5 py-2.5 rounded-full hover:bg-[#28666d] shadow-md shadow-[#35858E]/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle (Now on the Right) */}
          <button
            className="md:hidden text-slate-600 hover:text-[#35858E] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </header>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full z-40">
          <ul className="flex flex-col p-4 gap-1 text-slate-700 font-medium">
            <li>
                <Link href="/" className={`block py-3 px-4 rounded-xl ${pathname === '/' ? 'bg-[#35858E]/10 text-[#35858E] font-bold' : 'hover:bg-gray-50'}`}>Home</Link>
            </li>
            <li>
                <Link href="/tickets" className={`block py-3 px-4 rounded-xl ${pathname === '/tickets' ? 'bg-[#35858E]/10 text-[#35858E] font-bold' : 'hover:bg-gray-50'}`}>All Tickets</Link>
            </li>
            {user && (
              <li>
                <Link href={dashboardRoute} className={`block py-3 px-4 rounded-xl ${pathname === dashboardRoute ? 'bg-[#35858E]/10 text-[#35858E] font-bold' : 'hover:bg-gray-50'}`}>Dashboard</Link>
              </li>
            )}
            
            <li className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-4 px-2">
              {!user ? (
                <>
                  <Link href="/login" className="block py-2 font-bold text-slate-600 hover:text-[#35858E]">
                    Login
                  </Link>
                  <Link href="/register" className="block py-2 font-bold text-[#35858E]">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/my-profile" className="block py-2 text-slate-700 hover:text-[#35858E]">
                    My Profile
                  </Link>
                  <button 
                    className="text-left py-2 font-bold text-red-500 hover:text-red-600 transition-colors"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav> 
    );
};

export default NavBar;