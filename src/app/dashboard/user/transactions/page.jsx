"use client";

import { useEffect, useState } from 'react';
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";

export default function UserTransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchTransactions();
  }, [session]);

  const fetchTransactions = async () => {
    const { data: token } = await authClient.token();

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/user/${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  if (isLoading) return <div className="text-white">Loading...</div>;

  const totalSpent = transactions.reduce((sum, t) => sum + (Number(t.fee) || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Transaction History</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 inline-block">
        <p className="text-gray-400 text-sm font-bold mb-1">Total Spent</p>
        <p className="text-3xl font-extrabold text-green-400">${totalSpent}</p>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Lawyer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-white/5">
                  <td className="p-4 font-mono text-xs text-gray-400">{tx._id}</td>
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