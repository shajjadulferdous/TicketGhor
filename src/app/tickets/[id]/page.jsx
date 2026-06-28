import React from 'react';
import TicketDetailsClient from './TicketDetailsClient';

export default async function TicketDetailsPage({ params }) {
  const { id } = await params;
  
  // Fetch ticket data on the server
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // Ensures we always get the latest available quantity
  });

  if (!response.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F8]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ticket Not Found</h2>
          <p className="text-gray-500">The ticket you are looking for doesn't exist or a server error occurred.</p>
        </div>
      </div>
    );
  }

  const ticket = await response.json();

  return <TicketDetailsClient ticket={ticket} />;
}