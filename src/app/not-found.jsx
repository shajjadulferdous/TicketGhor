"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdLocationOff, MdHome, MdArrowBack } from 'react-icons/md';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F7F8] font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        
        {/* Out-of-Bounds Destination Icon */}
        <div className="w-16 h-16 bg-gray-50 text-[#35858E] rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
          <MdLocationOff size={32} />
        </div>

        {/* Messaging Layout */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Route or Journey Not Found
        </h2>
        <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto mb-8">
          The station or page you are looking for doesn't exist, has been archived, or moved to another destination terminal.
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MdArrowBack size={18} />
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#35858E] hover:bg-[#2b6d74] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <MdHome size={18} />
            Find Tickets
          </button>
        </div>

        {/* System Error Code Identifier */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400">
            System Routing Status: <span className="font-mono bg-gray-50 px-1 py-0.5 rounded text-gray-500">ERR_ROUTE_404</span>
          </p>
        </div>

      </div>
    </div>
  );
}