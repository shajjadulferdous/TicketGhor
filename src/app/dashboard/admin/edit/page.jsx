"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MdAccountCircle, 
  MdEmail, 
  MdVerified, 
  MdWarning, 
  MdAdminPanelSettings, 
  MdCalendarMonth, 
  MdEdit 
} from 'react-icons/md';
import { authClient } from '@/lib/auth-client';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 

  useEffect(() => {
     const fetchUserProfile = async () => {
       try {
          const userk = session?.user;
          const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/${userk?.id}`,
           {
             cache:'no-store'
           }
          )
          if (!result.ok){
             return;
          }
          const userd = await result.json();
 
          setUser(userd || {
             name: "Shajjadul Ferdous",
             email: "2022331015@student.sust.edu",
             emailVerified: false,
             image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop",
             role: "user",
             createdAt: "2026-06-28T16:43:41.945Z"
           });
        
       } catch (err) {
         console.error(err);
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchUserProfile();
   }, [isPending]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7F8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#35858E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F8] font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Banner Graphic Backdrop */}
          <div className="h-40 bg-gradient-to-r from-[#2b6d74] to-[#35858E] relative">
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Profile Header Block */}
          <div className="px-8 flex flex-col md:flex-row items-center md:items-end justify-between relative -mt-16 pb-8 gap-6 border-b border-gray-100">
            
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              {/* Circular Avatar */}
              <img 
                src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"} 
                alt={user?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm bg-white relative z-10"
              />
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {user?.name}
                </h1>
                <p className="text-sm font-medium text-gray-500 capitalize flex items-center gap-1.5 justify-center md:justify-start mt-1">
                  <MdAdminPanelSettings className="text-[#35858E]" size={18} />
                  System {user?.role || "user"}
                </p>
              </div>
            </div>

            {/* Professional Outline Button */}
            <Link 
              href="/dashboard/admin/edit"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 hover:text-[#35858E] hover:border-[#35858E] text-gray-700 text-sm font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap mb-2"
            >
              <MdEdit size={16} />
              Edit Profile
            </Link>
          </div>

          {/* Detailed Info Section */}
          <div className="bg-gray-50/30 px-8 py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              
              {/* Item: Full Name */}
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  <MdAccountCircle size={16} /> Full Name
                </span>
                <p className="text-base font-medium text-gray-900">
                  {user?.name}
                </p>
              </div>

              {/* Item: Email Address */}
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  <MdEmail size={16} /> Email Address
                </span>
                <p className="text-base font-medium text-gray-900 break-all">
                  {user?.email}
                </p>
              </div>

              {/* Item: Verification Status */}
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                   Account Status
                </span>
                <div>
                  {user?.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
                      <MdVerified size={14} /> Verified Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-md border border-amber-200">
                      <MdWarning size={14} /> Verification Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Item: Created Date */}
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  <MdCalendarMonth size={16} /> Member Since
                </span>
                <p className="text-base font-medium text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : "N/A"}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}