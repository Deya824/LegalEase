"use client";

import { useEffect, useState } from 'react';
import { useSession } from "@/lib/auth-client";
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {authClient} from "@/lib/auth-client";

export default function UserHiringHistoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchRequests();
  }, [session]);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const hireId = searchParams.get('hireId');

    if (paymentStatus === 'success' && hireId) {
      markAsPaid(hireId);
    } else if (paymentStatus === 'cancelled') {
      toast.error("Payment was cancelled.");
    }
  }, [searchParams]);

  const fetchRequests = () => {
    
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire/client/${session.user.id}`)
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const markAsPaid = async (hireId) => {
    const {data:token}=await authClient.token();
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire/${hireId}/pay`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    });

    if (res.ok) {
      toast.success("Payment successful!");
      setRequests(prev =>
        prev.map(req => req._id === hireId ? { ...req, paid: true } : req)
      );
      router.replace('/dashboard/user/hiring-history');
    }
  };

  const handlePay = async (req) => {
    console.log("Paying for:", req); // ← add this
    setPayingId(req._id);

    try {
    
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hireId: req._id,
          lawyerName: req.lawyerName,
          fee: req.fee,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to start payment");
        setPayingId(null);
      }
    } catch (err) {
      toast.error("Something went wrong");
      setPayingId(null);
    }
  };

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Hiring History</h1>
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4">Lawyer Name</th>
              <th className="p-4">Specialisation</th>
              <th className="p-4">Fee</th>
              <th className="p-4">Hiring Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  No hiring requests yet.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="border-b border-white/5">
                  <td className="p-4">{req.lawyerName}</td>
                  <td className="p-4">{req.specialisation || req.specialization}</td>
                  <td className="p-4">${req.fee}</td>
                  <td className="p-4">
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4">
                    <span className={`capitalize px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                      req.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {req.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    {req.status === 'accepted' ? (
                      req.paid ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-bold text-sm cursor-not-allowed"
                        >
                          Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePay(req)}
                          disabled={payingId === req._id}
                          className="px-4 py-2 bg-amber-400 text-black rounded-lg font-bold text-sm hover:bg-amber-300 transition-colors disabled:opacity-50"
                        >
                          {payingId === req._id ? "Redirecting..." : "Pay"}
                        </button>
                      )
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
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