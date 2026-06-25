"use client";

import { useEffect, useState } from 'react';
import { useSession } from "@/lib/auth-client";
import toast from 'react-hot-toast';

import {authClient} from "@/lib/auth-client"
export default function LawyerHiringHistoryPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchRequests();
  }, [session]);

  const fetchRequests = async () => {
    const {data:token}=await authClient.token();
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire/lawyer/${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleStatusUpdate = async (id, status) => {
    const {data:token}=await authClient.token();
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`
      },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      toast.success(`Request ${status}!`);
      setRequests(prev =>
        prev.map(req => req._id === id ? { ...req, status } : req)
      );
    } else {
      toast.error("Failed to update request");
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
              <th className="p-4">Client Name</th>
              <th className="p-4">Request Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No hiring requests yet.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="border-b border-white/5">
                  <td className="p-4">{req.clientName}</td>
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
                    {(!req.status || req.status === 'pending') ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'accepted')}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-bold text-sm hover:bg-green-500/30 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'rejected')}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-bold text-sm hover:bg-red-500/30 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No action needed</span>
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