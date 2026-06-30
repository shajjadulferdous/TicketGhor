"use client";

import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { 
  MdConfirmationNumber, 
  MdShoppingBag, 
  MdAccountBalanceWallet 
} from 'react-icons/md';

export default function RevenueClient({ dataSummary }) {
  const { totalTicketsAdded, totalTicketsSold, totalRevenue, chartData } = dataSummary;

  // Custom styling formatting matrix variables
  const metrics = [
    {
      id: 1,
      label: "Total Tickets Added",
      value: totalTicketsAdded?.toLocaleString() || 0,
      icon: <MdConfirmationNumber size={26} />,
      bg: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      id: 2,
      label: "Total Tickets Sold",
      value: totalTicketsSold?.toLocaleString() || 0,
      icon: <MdShoppingBag size={26} />,
      bg: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
      id: 3,
      label: "Gross Sales Revenue",
      value: `৳${totalRevenue?.toLocaleString() || 0}`,
      icon: <MdAccountBalanceWallet size={26} />,
      bg: "bg-[#EBF5F6] text-[#35858E] border-[#D1E9EB]"
    }
  ];

  return (
    <div className="space-y-10">
      
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div 
            key={m.id} 
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{m.label}</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight transition-colors duration-300 group-hover:text-[#35858E]">
                {m.value}
              </h2>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${m.bg} shadow-sm group-hover:scale-105 transition-transform`}>
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Visual Analytics Grid Chart Sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Graph 1: Revenue Generation Over Time (Area Chart) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30">
          <div className="mb-6">
            <h3 className="text-lg font-black text-gray-800 tracking-tight">Revenue Progression</h3>
            <p className="text-xs font-medium text-gray-400 mt-0.5">Chronological timeline mapping financial transactions.</p>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" h="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#35858E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#35858E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '16px', color: '#fff', border: 'none' }}
                  labelStyle={{ fontWeight: 'black', color: '#A5D5D8' }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#35858E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Ticket Inventory vs Liquidity Volume (Grouped Bar Chart) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30">
          <div className="mb-6">
            <h3 className="text-lg font-black text-gray-800 tracking-tight">Inventory Distribution Performance</h3>
            <p className="text-xs font-medium text-gray-400 mt-0.5">Comparison metrics matching total system schedules vs tickets sold.</p>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" h="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '16px', color: '#fff', border: 'none' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="Added" name="Schedules Added" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Sold" name="Tickets Sold" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}