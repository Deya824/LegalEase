"use client";

import { useState, useEffect } from "react";
import { Input } from "@heroui/react";
import { useRouter } from "next/navigation";

const SPECIALIZATIONS = [
  "All",
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Corporate Law",
  "Immigration Law",
  "Real Estate Law",
  "Intellectual Property",
  "Employment Law",
  "Tax Law",
  "Constitutional Law",
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-5 animate-pulse">
      <div className="h-20 w-20 rounded-full bg-gray-700 mx-auto mb-4" />
      <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto mb-4" />
      <div className="h-3 bg-gray-700 rounded w-2/3 mx-auto mb-2" />
      <div className="h-8 bg-gray-700 rounded-xl w-full mt-4" />
    </div>
  );
}

function LawyerCard({ lawyer, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-5 cursor-pointer
        hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5
        transition-all duration-200 flex flex-col items-center text-center group"
    >
      {/* Avatar */}
      <div className="relative mb-4">
        <img
          src={lawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=1a1a1a&color=f59e0b&size=128`}
          alt={lawyer.name}
          className="h-20 w-20 rounded-full object-cover border-2 border-white/10
            group-hover:border-amber-400/50 transition"
        />
        {lawyer.busy && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white
            px-2 py-0.5 rounded-full font-semibold">
            Busy
          </span>
        )}
        {!lawyer.busy && (
          <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white
            px-2 py-0.5 rounded-full font-semibold">
            Available
          </span>
        )}
      </div>

      {/* Info */}
      <h3 className="text-white font-bold text-base mb-1 line-clamp-1">{lawyer.name}</h3>
      <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20
        px-3 py-1 rounded-full mb-3">
        {lawyer.specialization || "General"}
      </span>
      <p className="text-gray-400 text-sm mb-4">
        <span className="text-green-400 font-bold text-base">${lawyer.fee}</span>
        <span className="text-gray-500"> / consultation</span>
      </p>

      <button className="w-full rounded-xl bg-amber-400/10 border border-amber-400/20
        text-amber-400 text-sm font-semibold py-2 group-hover:bg-amber-400
        group-hover:text-gray-900 transition">
        View Profile
      </button>
    </div>
  );
}

export default function BrowseLawyersPage() {
  const router = useRouter();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchLawyers = async () => {
      try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyers`);
        if (!res.ok) throw new Error("Failed to fetch lawyers");
        const data = await res.json();
        setLawyers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const filtered = lawyers
    .filter((l) => {
      const matchSearch =
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.specialization?.toLowerCase().includes(search.toLowerCase());
      const matchSpec =
        selectedSpec === "All" || l.specialization === selectedSpec;
      return matchSearch && matchSpec;
    })
    .sort((a, b) => {
      if (sort === "fee_asc") return Number(a.fee) - Number(b.fee);
      if (sort === "fee_desc") return Number(b.fee) - Number(a.fee);
      if (sort === "name") return a.name?.localeCompare(b.name);

      return 0;
    });

  return (
    <div className="min-h-screen bg-[#111] px-4 py-10 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Browse Lawyers</h1>
        <p className="text-gray-400">
          Find the right legal expert for your needs
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <Input
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          classNames={{
            inputWrapper: "bg-[#1a1a1a] border border-gray-700",
            input: "text-white",
          }}
          className="flex-1"
          startContent={<span className="text-gray-500">🔍</span>}
        />

        <select
          value={selectedSpec}
          onChange={(e) => setSelectedSpec(e.target.value)}
          className="rounded-xl border border-gray-700 bg-[#1a1a1a] px-4 py-2
            text-white text-sm focus:border-amber-400 focus:outline-none"
        >
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-gray-700 bg-[#1a1a1a] px-4 py-2
            text-white text-sm focus:border-amber-400 focus:outline-none"
        >
          <option value="default">Sort: Default</option>
          <option value="fee_asc">Fee: Low → High</option>
          <option value="fee_desc">Fee: High → Low</option>
          <option value="name">Name: A → Z</option>
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-gray-500 text-sm mb-6">
          Showing <span className="text-white font-semibold">{filtered.length}</span> lawyer{filtered.length !== 1 ? "s" : ""}
          {selectedSpec !== "All" && ` in ${selectedSpec}`}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg font-semibold">Failed to load lawyers</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-white text-lg font-semibold">No lawyers found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((lawyer) => (
            <LawyerCard
              key={lawyer._id}
              lawyer={lawyer}
              onClick={() => router.push(`/lawyers/${lawyer.userId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}