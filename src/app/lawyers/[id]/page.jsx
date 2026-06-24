"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import HireModal from "@/components/HireModal";
import LawyerComments from "@/components/LawyerComments";
import toast from 'react-hot-toast';

function SkeletonDetail() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div
          className="rounded-3xl bg-gray-800 shrink-0 mx-auto md:mx-0"
          style={{ width: 160, height: 160 }}
        />
        <div className="flex-1 space-y-4 w-full">
          <div className="h-6 bg-gray-800 rounded w-1/2" />
          <div className="h-4 bg-gray-800 rounded w-1/3" />
          <div className="h-4 bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-800 rounded w-5/6" />
          <div className="h-10 bg-gray-800 rounded-xl w-40 mt-6" />
        </div>
      </div>
    </div>
  );
}

export default function LawyerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hireModalOpen, setHireModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchLawyer = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/${id}`);
        if (!res.ok) throw new Error("Lawyer not found");
        const data = await res.json();
        if (!data?.userId) throw new Error("Lawyer not found");
        setLawyer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyer();
  }, [id]);

  if (loading) return <SkeletonDetail />;

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-white text-xl font-bold mb-2">Lawyer Not Found</p>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button
          onClick={() => router.push("/lawyers")}
          className="text-amber-400 border border-amber-400/30 px-5 py-2 rounded-xl hover:bg-amber-400/10 transition text-sm"
        >
          ← Back to Browse
        </button>
      </div>
    );

  const joinedDate = lawyer.createdAt
    ? new Date(lawyer.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

 const handleHireClick = () => {
  console.log("Clicked! Session:", session);
  console.log("Role:", session?.user?.role);

  if (!session?.user) {
    console.log("No session, redirecting to signin");
    router.push(`/auth/signin?redirect=/lawyers/${id}`);
    return;
  }

  if (session.user.role === "lawyer") {
    console.log("Is a lawyer, should show toast");
    toast.error("Only users can hire lawyers. Lawyers cannot hire other lawyers.");
    return;
  }

  console.log("Opening modal");
  setHireModalOpen(true);
};
  return (
    <div className="min-h-screen bg-[#111] px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push("/lawyers")}
          className="text-gray-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition"
        >
          ← Back to Lawyers
        </button>

        {/* Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-8 shadow-xl">

          {/* Top: photo left, info right */}
          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Photo + badge */}
            <div
              className="shrink-0 flex flex-col items-center gap-2 mx-auto md:mx-0"
              style={{ width: 160 }}
            >
              <img
                src={
                  lawyer.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    lawyer.name
                  )}&background=1a1a1a&color=f59e0b&size=256`
                }
                alt={lawyer.name}
                style={{
                  width: 160,
                  height: 160,
                  minWidth: 160,
                  maxWidth: 160,
                  objectFit: "cover",
                  borderRadius: 20,
                  border: "2px solid rgba(255,255,255,0.1)",
                  display: "block",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  ...(lawyer.busy
                    ? {
                        background: "rgba(239,68,68,0.15)",
                        color: "#f87171",
                        border: "1px solid rgba(239,68,68,0.3)",
                      }
                    : {
                        background: "rgba(34,197,94,0.15)",
                        color: "#4ade80",
                        border: "1px solid rgba(34,197,94,0.3)",
                      }),
                }}
              >
                {lawyer.busy ? "Busy" : "Available"}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold text-white mb-1">
                {lawyer.name}
              </h1>

              <span className="inline-block text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-4">
                {lawyer.specialization || "General Practice"}
              </span>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1">Consultation Fee</p>
                  <p className="text-green-400 font-bold text-lg">${lawyer.fee}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1">Member Since</p>
                  <p className="text-white font-semibold text-sm">{joinedDate}</p>
                </div>
              </div>

              {/* Hire Button */}
              {!lawyer.busy ? (
                <button
                  type="button"
                  onClick={handleHireClick}
                  className="rounded-xl bg-amber-400 px-8 py-3 font-bold text-gray-900 hover:bg-amber-300 active:scale-95 transition-all text-sm"
                >
                  Hire {lawyer.name.split(" ")[0]}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="rounded-xl bg-gray-700 px-8 py-3 font-bold text-gray-500 cursor-not-allowed text-sm"
                >
                  Currently Unavailable
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          {lawyer.bio && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-white font-bold mb-3">About</h2>
              <p className="text-gray-400 leading-relaxed text-sm">{lawyer.bio}</p>
            </div>
          )}

          {/* Services */}
          {lawyer.services?.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-white font-bold mb-4">
                Services Offered ({lawyer.services.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lawyer.services.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">
                        {service.title}
                      </h3>
                      <span className="text-green-400 font-bold text-sm shrink-0">
                        ${service.fee}
                      </span>
                    </div>
                    <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                      {service.specialization}
                    </span>
                    {service.description && (
                      <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Box */}
        <LawyerComments lawyer={lawyer} />

      </div>

      {/* Hire Modal */}
      {hireModalOpen && (
        <HireModal
          lawyer={lawyer}
          session={session}
          onClose={() => setHireModalOpen(false)}
        />
      )}
    </div>
  );
}