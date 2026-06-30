import React from 'react';
import { MdErrorOutline, MdTimeline } from 'react-icons/md'; // Fixed import here
import RevenueClient from './RevenueClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function RevenueOverviewPage() {
  let stats = null;
  let isError = false;

  try {
    const {token }= await auth.api.getToken({
          headers: await headers()
    })
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/revenue-overview`, {
      cache: 'no-store',
      headers:{
         "Content-Type":"application/json",
         Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      isError = true;
    } else {
      stats = await res.json();
    }
  } catch (err) {
    console.error("Telemetry loading failed:", err);
    isError = true;
  }

  if (isError || !stats) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center">
        <MdErrorOutline size={48} className="text-rose-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Metrics Unavailable</h2>
        <p className="text-gray-500 font-medium">Failed to compile server analytics telemetry lines.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <MdTimeline className="text-[#35858E]" />
            Revenue Overview
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2">
            Real-time corporate performance logs, ticket liquidity volume tracking, and sales analytics.
          </p>
        </div>
      </div>

      {/* Render Client Side Dynamic Charts Layout */}
      <RevenueClient dataSummary={stats} />
    </div>
  );
}