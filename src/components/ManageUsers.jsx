"use client";

import { useState } from "react";
import { 
  MdAdminPanelSettings, 
  MdStorefront, 
  MdBan, 
  MdOutlineHourglassEmpty,
  MdPersonOutline
} from "react-icons/md";
import toast from "react-hot-toast";
import { FaBan } from "react-icons/fa6";

// Premium badge styling for different roles
const ROLE_MAP = {
  admin:  { bg: "bg-[#EBF5F6]", text: "text-[#35858E]", border: "border-[#D1E9EB]", label: "Admin" },
  vendor: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200/60", label: "Vendor" },
  user:   { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: "User" },
  fraud:  { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200/60", label: "Fraudulent" },
};

export default function ManageUsers({ initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);
  
  // Track which user is loading and what action is being performed
  const [loadingState, setLoadingState] = useState({ id: null, action: null });

  async function updateUserRole(id, newRole) {
    setLoadingState({ id, action: newRole });
    try {
      // Adjust this endpoint to match your backend routing
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Request failed");

      // Update the UI optimistically
      setUsers((prev) =>
        prev.map((u) => {
          const uId = u._id?.$oid ?? u._id;
          return uId === id ? { ...u, role: newRole } : u;
        })
      );
      
      if (newRole === "fraud") {
        toast.success("Vendor marked as fraud. Their tickets are now hidden.");
      } else {
        toast.success(`User successfully upgraded to ${newRole}!`);
      }
      
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingState({ id: null, action: null });
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
      
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Users</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Control platform access, assign administrative or vendor privileges, and manage fraudulent accounts.
        </p>
      </div>

      {/* ── Premium Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Users", color: "bg-[#F4F7F8] text-[#35858E]", count: users.length },
          { label: "Admins",      color: "bg-[#EBF5F6] text-[#256069]", count: users.filter(u => u.role === "admin").length },
          { label: "Vendors",     color: "bg-amber-50 text-amber-700",  count: users.filter(u => u.role === "vendor").length },
          { label: "Fraudulent",  color: "bg-rose-50 text-rose-700",    count: users.filter(u => u.role === "fraud").length },
        ].map(({ label, color, count }) => (
          <div key={label} className={`rounded-3xl px-6 py-5 border border-gray-100 shadow-sm ${color} transition-transform hover:-translate-y-1 duration-300`}>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">{label}</p>
            <p className="text-3xl font-black">{count}</p>
          </div>
        ))}
      </div>

      {/* ── Custom Premium Table ── */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-gray-100">
              <tr>
                {["Name", "Email", "Current Role", "Actions"].map((head) => (
                  <th key={head} className={`px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest ${head === 'Actions' ? 'text-right' : ''}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                      <MdPersonOutline size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-semibold">No users found in the system.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const id = user._id?.$oid ?? user._id;
                  const isAnyLoading = loadingState.id === id;
                  const cfg = ROLE_MAP[user.role] ?? ROLE_MAP.user;

                  return (
                    <tr key={id} className={`transition-colors duration-200 group ${user.role === 'fraud' ? 'bg-rose-50/30' : 'hover:bg-gray-50/50'}`}>
                      
                      {/* Name */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${cfg.bg} ${cfg.text}`}>
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span className={`font-bold ${user.role === 'fraud' ? 'text-gray-500 line-through decoration-rose-300' : 'text-gray-800'}`}>
                            {user.name}
                          </span>
                        </div>
                      </td>
                      
                      {/* Email */}
                      <td className={`px-8 py-5 font-medium ${user.role === 'fraud' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.email}
                      </td>
                      
                      {/* Role Badge */}
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1.5 rounded-lg border text-[11px] font-extrabold uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2.5">
                          
                          {/* Make Admin Button */}
                          <button
                            disabled={user.role === "admin" || isAnyLoading}
                            onClick={() => updateUserRole(id, "admin")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 
                              ${user.role === "admin" 
                                ? "hidden" 
                                : "bg-[#EBF5F6] text-[#35858E] hover:bg-[#35858E] hover:text-white border border-[#D1E9EB] hover:border-[#35858E] shadow-sm"}`}
                            title="Make Admin"
                          >
                            {loadingState.id === id && loadingState.action === "admin" 
                              ? <MdOutlineHourglassEmpty className="animate-spin" size={14} /> 
                              : <MdAdminPanelSettings size={14} />}
                            Make Admin
                          </button>

                          {/* Make Vendor Button */}
                          <button
                            disabled={user.role === "vendor" || isAnyLoading}
                            onClick={() => updateUserRole(id, "vendor")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 
                              ${user.role === "vendor" || user.role === "admin"
                                ? "hidden" 
                                : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-200/60 hover:border-amber-500 shadow-sm"}`}
                            title="Make Vendor"
                          >
                            {loadingState.id === id && loadingState.action === "vendor" 
                              ? <MdOutlineHourglassEmpty className="animate-spin" size={14} /> 
                              : <MdStorefront size={14} />}
                            Make Vendor
                          </button>

                          {/* Mark as Fraud Button (ONLY visible for vendors) */}
                          {user.role === "vendor" && (
                            <button
                              disabled={isAnyLoading}
                              onClick={() => updateUserRole(id, "fraud")}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-200/60 hover:border-rose-500 shadow-sm transition-all duration-200"
                              title="Mark as Fraud"
                            >
                              {loadingState.id === id && loadingState.action === "fraud" 
                                ? <MdOutlineHourglassEmpty className="animate-spin" size={14} /> 
                                : <FaBan size={14} />}
                              Mark as Fraud
                            </button>
                          )}

                          {/* Safe State Fallback */}
                          {user.role === "admin" && (
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Highest Privileges</span>
                          )}
                          {user.role === "fraud" && (
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest px-2">Account Restricted</span>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}