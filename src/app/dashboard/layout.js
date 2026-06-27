import Sidebar from '@/components/SideBar';
import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-neutral-50 overflow-hidden font-sans">
      
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        
        
        <div className="h-16 md:hidden border-b border-gray-100 bg-white flex items-center justify-center">
             <span className="font-semibold text-slate-800">Dashboard</span>
        </div>

       
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
}