"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdLockOutline, MdHome, MdArrowBack } from 'react-icons/md';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F7F8] font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        
        {/* Security Barrier Icon */}
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
          <MdLockOutline size={32} />
        </div>

        {/* Messaging Text Architecture */}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Access Denied
        </h1>
        <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto mb-8">
          You do not have the required permissions to view this directory or resource. Please verify your credentials or switch accounts.
        </p>

        {/* Strategic Action Hooks */}
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
            Return Home
          </button>
        </div>

        {/* Optional Corporate Context Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400">
            Security ID: <span className="font-mono bg-gray-50 px-1 py-0.5 rounded text-gray-500">ERR_403_AUTH</span>
          </p>
        </div>

      </div>
    </div>
  );
}