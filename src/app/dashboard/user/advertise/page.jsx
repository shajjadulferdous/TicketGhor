import React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import AdvertiseClient from './AdvertiseClient'; // We will build this next

const AdvertisePage = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    let tickets = [];
    let isError = false;

    try {
        const res = await fetch(`${baseUrl}/tickets`, {
            cache: 'no-store' // Don't cache admin pages so data is always fresh
        });

        if (!res.ok) {
            isError = true;
        } else {
            const allTickets = await res.json();
            // Filter strictly for admin-approved tickets
            tickets = allTickets.filter(ticket => ticket.status === 'approved');
        }
    } catch (error) {
        console.error("Fetch error:", error);
        isError = true;
    }

    if (isError) {
         return (
            <div className="py-32 flex flex-col items-center justify-center text-center">
                <MdErrorOutline size={48} className="text-rose-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Server Error</h2>
                <p className="text-gray-500 font-medium">Failed to load tickets. Please try again.</p>
            </div>
         );
    }
    
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Advertise Tickets</h1>
                <p className="text-sm font-medium text-gray-500 mt-2">
                    Manage homepage advertisements. You can promote up to 6 approved tickets at a time.
                </p>
            </div>

            {/* Pass the data to our interactive Client Component */}
            <AdvertiseClient initialTickets={tickets} />
        </div>
    );
};

export default AdvertisePage;