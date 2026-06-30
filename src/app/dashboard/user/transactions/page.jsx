import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';
import { MdReceiptLong, MdErrorOutline, MdCreditScore } from 'react-icons/md';

const TransactionPage = async () => {
  // 1. Authenticate User
  const session = await auth.api.getSession({
    headers: await headers(), 
  });

  if (!session?.user?.email) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please log in to view your transactions.
      </div>
    );
  }

  // 2. Fetch Transactions Data
  let transactions = [];
  let isError = false;

  try {
     const {token }= await auth.api.getToken({
            headers: await headers()
    })


    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transaction/${session.user.email}`,
      { cache: 'no-store', 
        headers:{
           "Content-type":"application-json",
            Authorization: `Bearer ${token}`
        }
      } // Ensure fresh data on every load
    );

    if (!response.ok) {
      isError = true;
    } else {
      transactions = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    isError = true;
  }

  // 3. Handle Server Error State gracefully (No client-side toasts here!)
  if (isError) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center py-32 text-center">
        <MdErrorOutline size={48} className="text-rose-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Server Error</h2>
        <p className="text-gray-500 font-medium">
          We couldn't load your transaction history right now. Please try again later.
        </p>
      </div>
    );
  }

  // 4. Render the UI
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
      
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <MdCreditScore className="text-[#35858E]" />
          Transaction History
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-2">
          View all your secure Stripe payments and billing records.
        </p>
      </div>

      {/* ── Transactions Table ── */}
      {transactions.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <th className="py-5 px-6">Transaction ID</th>
                  <th className="py-5 px-6">Ticket Title</th>
                  <th className="py-5 px-6 text-right">Amount</th>
                  <th className="py-5 px-6 text-right">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                {transactions.map((tx) => {
                  // Format the date securely on the server
                  const formattedDate = new Date(tx.time).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={tx._id || tx.transactionId} className="hover:bg-gray-50/70 transition-colors">
                      {/* Transaction ID */}
                      <td className="py-5 px-6 font-mono text-xs text-gray-500">
                        {tx.transactionId}
                      </td>
                      
                      {/* Ticket Title */}
                      <td className="py-5 px-6 font-bold text-gray-900">
                        {tx.title}
                      </td>
                      
                      {/* Amount */}
                      <td className="py-5 px-6 text-right font-black text-[#35858E] text-base">
                        {/* Assumed generic currency / previous context used ৳ */}
                        ৳{tx.amount?.toLocaleString()}
                      </td>
                      
                      {/* Payment Date */}
                      <td className="py-5 px-6 text-right text-gray-500 text-xs font-bold">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <MdReceiptLong size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No transactions yet</h3>
          <p className="text-gray-500 font-medium max-w-md">
            You don't have any payment records. Once you complete a purchase, the receipt details will appear here.
          </p>
        </div>
      )}
      
    </div>
  );
};

export default TransactionPage;