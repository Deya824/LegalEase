"use client";



import { authClient } from "@/lib/auth-client";
import { useState } from "react";

import toast from "react-hot-toast";



export default function HireModal({ lawyer, session, onClose }) {

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [submitted, setSubmitted] = useState(false);



 const handleHire = async () => {
    if (!message.trim()) {
      toast.error("Please describe your legal issue.");
      return;
    }
    setLoading(true);
    try {
      const { data: token } = await authClient.token();
     
     

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token.token}` 
        },
        body: JSON.stringify({
         lawyerId: lawyer.userId,        // Matches backend check: !hireData.lawyerId
      clientId: session.user.id,      // Matches backend check: !hireData.clientId
      lawyerName: lawyer.name,
      specialisation: lawyer.specialization,
      fee: lawyer.fee,
      clientEmail: session.user.email,
      clientName: session.user.name,
      message: message,
      status: "pending",
      createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        // This will capture the actual server error message
        const errorData = await res.json().catch(() => ({ message: "Unknown server error" }));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("DEBUG - Hire Error:", err);
      toast.error(err.message || "Error sending request.");
    } finally {
      setLoading(false);
    }
  };



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1a1a1a]

        p-8 shadow-2xl">



        {submitted ? (

          <div className="text-center py-4">

            <p className="text-4xl mb-4">✅</p>

            <h2 className="text-white text-xl font-bold mb-2">Request Sent!</h2>

            <p className="text-gray-400 text-sm mb-6">

              Your hiring request has been sent to{" "}

              <span className="text-amber-400">{lawyer.name}</span>. They will

              get back to you soon.

            </p>

            <button

              onClick={onClose}

              className="rounded-xl bg-amber-400 px-8 py-3 font-bold text-gray-900

                hover:bg-amber-300 transition text-sm"

            >

              Done

            </button>

          </div>

        ) : (

          <>

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-white text-xl font-bold">Hire Lawyer</h2>

                <p className="text-gray-400 text-sm mt-1">

                  Send a request to{" "}

                  <span className="text-amber-400">{lawyer.name}</span>

                </p>

              </div>

              <button

                onClick={onClose}

                className="text-gray-500 hover:text-white text-xl transition"

              >

                ✕

              </button>

            </div>



            {/* Lawyer summary */}

            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 mb-6">

              <img

                src={

                  lawyer.image ||

                  `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=1a1a1a&color=f59e0b`

                }

                alt={lawyer.name}

                className="h-12 w-12 rounded-full object-cover border border-white/10"

              />

              <div>

                <p className="text-white font-semibold text-sm">{lawyer.name}</p>

                <p className="text-amber-400 text-xs">{lawyer.specialization}</p>

              </div>

              <div className="ml-auto text-right">

                <p className="text-green-400 font-bold">${lawyer.fee}</p>

                <p className="text-gray-500 text-xs">per consult</p>

              </div>

            </div>



            {/* Message */}

            <div className="mb-6">

              <label className="text-sm font-bold text-gray-300 block mb-2">

                Describe your legal issue

              </label>

              <textarea

                rows={4}

                placeholder="e.g. I need help with a contract dispute..."

                value={message}

                onChange={(e) => setMessage(e.target.value)}

                className="w-full rounded-xl border border-gray-600 bg-gray-800 p-3

                  text-white placeholder-gray-500 focus:border-amber-400

                  focus:outline-none text-sm resize-none"

              />

            </div>



            {/* Actions */}

            <div className="flex gap-3">

              <button

                onClick={onClose}

                className="flex-1 rounded-xl border border-gray-600 py-3 text-sm

                  font-semibold text-gray-400 hover:text-white hover:border-gray-400 transition"

              >

                Cancel

              </button>

              <button

                onClick={handleHire}

                disabled={loading}

                className="flex-1 rounded-xl bg-amber-400 py-3 text-sm font-bold

                  text-gray-900 hover:bg-amber-300 transition disabled:opacity-60"

              >

                {loading ? "Sending…" : "Send Request"}

              </button>

            </div>

          </>

        )}

      </div>

    </div>

  );

} 

