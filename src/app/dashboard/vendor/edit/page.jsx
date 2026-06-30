"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdSave, MdLink, MdPerson, MdEmail, MdAdminPanelSettings } from 'react-icons/md';
import { authClient } from '@/lib/auth-client';

// ── 1. MAIN CONTAINER PAGE ──
// Handles session fetching and loading states
export default function EditProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F4F7F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#35858E]"></div>
      </div>
    );
  }

  if (!session?.user) return null;

  // Passing the email as a 'key' tells React to cleanly mount this form 
  // with the real user data right from the first frame. No useEffect needed!
  return <EditProfileForm user={session.user} key={session.user.email} />;
}

// ── 2. ISOLATED FORM COMPONENT ──
// Handles local mutable state for inputs
function EditProfileForm({ user }) {
  const router = useRouter();
  
  // Initialize state directly from the loaded user data
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    // console.log("hello");
    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;
      // console.log(tokenResponse);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/user/update-profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
        cache:'no-store',
        body: JSON.stringify({ email: user.email, name, image }) 
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully! Redirecting..." });
        setTimeout(() => router.push(`/dashboard/${user.role || 'user'}`), 1500);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile.");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F8] font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#35858E] transition-colors group"
        >
          <MdArrowBack size={18} className="transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Profile</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Update your personal information. Some fields are locked for security purposes.
            </p>
          </div>

          <div className="p-8">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-semibold border flex items-center gap-2 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm font-medium rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E] transition-all"
                    />
                  </div>
                </div>

                {/* Profile Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Profile Image URL
                  </label>
                  <div className="relative">
                    <MdLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="url" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)} 
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm font-medium rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-[#35858E] focus:ring-1 focus:ring-[#35858E] transition-all"
                    />
                  </div>
                </div>

                {/* Read-Only Email (Read straight from props, no state needed) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Email Address <span className="normal-case tracking-normal text-gray-400 font-medium">(Locked)</span>
                  </label>
                  <div className="relative">
                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="email" 
                      value={user.email || ""} 
                      disabled 
                      className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm font-medium rounded-lg pl-11 pr-4 py-3 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Read-Only Role (Read straight from props, no state needed) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    System Role <span className="normal-case tracking-normal text-gray-400 font-medium">(Locked)</span>
                  </label>
                  <div className="relative">
                    <MdAdminPanelSettings className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      value={user.role || "user"} 
                      disabled 
                      className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm font-medium rounded-lg pl-11 pr-4 py-3 cursor-not-allowed focus:outline-none capitalize"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#35858E] hover:bg-[#2b6d74] text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <MdSave size={18} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}