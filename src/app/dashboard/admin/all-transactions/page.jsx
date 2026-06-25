"use client";

import { useEffect, useState } from 'react';

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/transactions`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">All Transactions</h1>
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">User Email</th>
              <th className="p-4">Lawyer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-white/5">
                  <td className="p-4 font-mono text-xs text-gray-400">{tx._id}</td>
                  <td className="p-4">{tx.clientEmail}</td>
                  <td className="p-4">{tx.lawyerName}</td>
                  <td className="p-4 text-green-400 font-bold">${tx.fee}</td>
                  <td className="p-4">
                    {tx.paidAt ? new Date(tx.paidAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}