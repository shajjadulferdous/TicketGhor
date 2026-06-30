import BusCard from '@/components/BusCard';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MdConfirmationNumber, MdErrorOutline, MdExplore } from 'react-icons/md';
import React from 'react';

const MyTicketPage = async () => {
    // ── 1. Authentication & Session Check ──
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const user = session?.user;
    
    if (!user) {
        redirect('/login');
    }

    // ── 2. Data Fetching ──
    const { token } = await auth.api.getToken({
        headers: await headers()
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-products/${user?.email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        cache: "no-cache"
    });

    // ── 3. Error State UI ──
    if (!response.ok) {
        return (
            <div className="min-h-screen bg-[#F4F7F8] font-sans flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-200 flex flex-col items-center text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6 border border-rose-100">
                        <MdErrorOutline size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
                        Failed to Load Tickets
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mb-8 px-4">
                        We encountered a server issue while retrieving your booking history. Please try again later.
                    </p>
                    <Link 
                        href="/" 
                        className="px-6 py-2.5 bg-[#35858E] text-white text-sm font-semibold rounded-lg hover:bg-[#2b6d74] transition-colors shadow-sm w-full sm:w-auto"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    const mytickets = await response.json();
    
    // ── 4. Main Page Render ──
    return (
        <div className="min-h-screen bg-[#F4F7F8] font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Page Header */}
                <div className="mb-8 border-b border-gray-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Tickets</h1>
                        <p className="text-sm font-medium text-gray-500 mt-2">
                            Manage your upcoming journeys and view your booking history.
                        </p>
                    </div>
                    
                    {/* Ticket Counter Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm self-start sm:self-auto">
                        <MdConfirmationNumber className="text-[#35858E]" size={18} />
                        Total: {mytickets.length}
                    </div>
                </div>

                {/* Conditional Rendering: Empty State vs Ticket Grid */}
                {mytickets.length === 0 ? (
                    
                    /* Empty State UI */
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                            <MdConfirmationNumber size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
                            No Tickets Found
                        </h2>
                        <p className="text-sm font-medium text-gray-500 max-w-md mx-auto mb-8">
                            You haven't booked any journeys yet. Ready to start your next adventure?
                        </p>
                        <Link 
                            href="/" 
                            className="flex items-center gap-2 px-6 py-3 bg-[#35858E] hover:bg-[#2b6d74] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                        >
                            <MdExplore size={18} />
                            Browse Routes
                        </Link>
                    </div>

                ) : (
                    
                    /* Data Grid UI */
                    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mytickets.map((ticket) => (
                            <BusCard key={ticket?._id} listing={ticket} />
                        ))}
                    </main>

                )}

            </div>
        </div>
    );
};

export default MyTicketPage;