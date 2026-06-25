"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function LawyerCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-[#1a1a1a] border border-white/10 p-5">
      <div className="w-16 h-16 rounded-xl bg-gray-800 mb-4" />
      <div className="h-4 bg-gray-800 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-800 rounded w-1/2 mb-4" />
      <div className="h-3 bg-gray-800 rounded w-full mb-2" />
      <div className="h-8 bg-gray-800 rounded-xl w-24 mt-4" />
    </div>
  );
}

// ── Lawyer Card ───────────────────────────────────────────────────────────────
function LawyerCard({ lawyer, index }) {
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.025, transition: { duration: 0.2 } }}
      onClick={() => router.push(`/lawyers/${lawyer.userId}`)}
      className="cursor-pointer rounded-2xl bg-[#1a1a1a] border border-white/10
        hover:border-amber-400/30 p-5 flex flex-col gap-3 transition-colors"
    >
      <div className="flex items-center gap-3">
        <img
          src={
            lawyer.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=292524&color=f59e0b&size=128`
          }
          alt={lawyer.name}
          style={{ width: 56, height: 56, minWidth: 56, maxWidth: 56, borderRadius: 12, objectFit: "cover", display: "block" }}
        />
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate">{lawyer.name}</p>
          <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20
            px-2 py-0.5 rounded-full inline-block mt-0.5 truncate max-w-full">
            {lawyer.specialization || "General Practice"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div>
          <p className="text-gray-500 text-xs">Fee</p>
          <p className="text-green-400 font-bold">${lawyer.fee}</p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
          ...(lawyer.busy
            ? { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }
            : { background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }),
        }}>
          {lawyer.busy ? "Busy" : "Available"}
        </span>
      </div>
    </motion.div>
  );
}

// ── Legal Categories ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Criminal Law",    icon: "⚖️",  filter: "Criminal" },
  { label: "Corporate Law",   icon: "🏢",  filter: "Corporate" },
  { label: "Family Law",      icon: "👨‍👩‍👧",  filter: "Family" },
  { label: "Immigration",     icon: "🌍",  filter: "Immigration" },
  { label: "Intellectual Property", icon: "💡", filter: "IP" },
  { label: "Real Estate",     icon: "🏠",  filter: "Real Estate" },
  { label: "Tax Law",         icon: "📋",  filter: "Tax" },
  { label: "Civil Rights",    icon: "✊",  filter: "Civil" },
];

// ── HERO words that cycle ─────────────────────────────────────────────────────
const HERO_WORDS = ["Expert", "Trusted", "Verified", "Top-Rated"];

// ═════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const router = useRouter();

  const [featuredLawyers, setFeaturedLawyers]   = useState([]);
  const [topLawyers, setTopLawyers]             = useState([]);
  const [loadingFeatured, setLoadingFeatured]   = useState(true);
  const [loadingTop, setLoadingTop]             = useState(true);
  const [wordIndex, setWordIndex]               = useState(0);

  // Paginated browse lawyers
  const [browseLawyers, setBrowseLawyers]       = useState([]);
  const [currentPage, setCurrentPage]           = useState(1);
  const [totalPages, setTotalPages]             = useState(1);
  const [loadingBrowse, setLoadingBrowse]       = useState(true);
  const LAWYERS_PER_PAGE = 9;

  // Hero word cycling
  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % HERO_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  // Featured lawyers (latest 6)
 // Featured lawyers (latest 6)
useEffect(() => {
  const fetchFeatured = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyers`);
      const data = await res.json();

      const lawyers = Array.isArray(data)
        ? data
        : data.lawyers || [];

      // newest 6 only
      const featured = lawyers
        .sort(
          (a, b) =>
            new Date(b.createdAt || b._id) -
            new Date(a.createdAt || a._id)
        )
        .slice(0, 6);

      setFeaturedLawyers(featured);
    } catch (error) {
      console.error(error);
      setFeaturedLawyers([]);
    } finally {
      setLoadingFeatured(false);
    }
  };

  fetchFeatured();
}, []);

  // Top 3 lawyers by hires
  useEffect(() => {
    const fetchTop = async () => {
      try {
       //${process.env.NEXT_PUBLIC_SERVER_URL}
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyers?limit=3&sort=hires`);
        const data = await res.json();
        setTopLawyers(Array.isArray(data) ? data.slice(0, 3) : (data.lawyers || []).slice(0, 3));
      } catch {
        setTopLawyers([]);
      } finally {
        setLoadingTop(false);
      }
    };
    fetchTop();
  }, []);

  // Paginated lawyers
  useEffect(() => {
    const fetchBrowse = async () => {
      setLoadingBrowse(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyers?page=${currentPage}&limit=${LAWYERS_PER_PAGE}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setBrowseLawyers(data);
          setTotalPages(1);
        } else {
          setBrowseLawyers(data.lawyers || []);
          setTotalPages(data.totalPages || Math.ceil((data.total || 0) / LAWYERS_PER_PAGE) || 1);
        }
      } catch {
        setBrowseLawyers([]);
      } finally {
        setLoadingBrowse(false);
      }
    };
    fetchBrowse();
  }, [currentPage]);

  const featuredRef = useRef(null);
  const featuredInView = useInView(featuredRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen bg-[#111] text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 700, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-xs text-amber-400
                bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Bangladesh's #1 Legal Marketplace
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight"
            >
              Find &amp; Hire{" "}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-amber-400 inline-block"
                  >
                    {HERO_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />Legal Counsel
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-xl"
            >
              Connect with verified lawyers across every specialization.
              Browse profiles, compare fees, and hire with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => router.push("/lawyers")}
                className="rounded-xl bg-amber-400 px-8 py-4 font-bold text-gray-900
                  hover:bg-amber-300 active:scale-95 transition-all text-base"
              >
                Browse Lawyers →
              </button>
              <button
                onClick={() => router.push("/auth/signin")}
                className="rounded-xl border border-white/20 px-8 py-4 font-semibold
                  text-white hover:bg-white/5 active:scale-95 transition-all text-base"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-8 mt-14"
            >
              {[
                { value: "500+", label: "Verified Lawyers" },
                { value: "12K+", label: "Cases Handled" },
                { value: "98%",  label: "Client Satisfaction" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-amber-400">{s.value}</p>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED LAWYERS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#111]" ref={featuredRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Hand-picked
              </p>
              <h2 className="text-3xl font-black text-white">Featured Lawyers</h2>
            </div>
            <button
              onClick={() => router.push("/lawyers")}
              className="text-sm text-gray-400 hover:text-amber-400 transition hidden md:block"
            >
              View all →
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loadingFeatured
              ? Array(6).fill(0).map((_, i) => <LawyerCardSkeleton key={i} />)
              : featuredLawyers.map((lawyer, i) => (
                  <LawyerCard key={lawyer.userId || lawyer._id} lawyer={lawyer} index={i} />
                ))}
          </div>
        </div>
      </section>

      {/* ── TOP LEGAL EXPERTS ────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#141414" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Most Hired
            </p>
            <h2 className="text-3xl font-black text-white">Top Legal Experts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingTop
              ? Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-[#1a1a1a] border border-white/10 p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-800 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-2/3" />
                      <div className="h-3 bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                ))
              : topLawyers.map((lawyer, i) => (
                  <motion.div
                    key={lawyer.userId || lawyer._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => router.push(`/lawyers/${lawyer.userId}`)}
                    className="cursor-pointer rounded-2xl border border-white/10
                      hover:border-amber-400/30 p-6 flex items-center gap-4 transition-colors"
                    style={{ background: "#1a1a1a" }}
                  >
                    {/* Rank */}
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
                      style={{
                        background: i === 0 ? "rgba(245,158,11,0.2)" : i === 1 ? "rgba(156,163,175,0.15)" : "rgba(180,120,60,0.15)",
                        color: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : "#b47c3c",
                      }}>
                      #{i + 1}
                    </div>
                    <img
                      src={lawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=292524&color=f59e0b&size=128`}
                      alt={lawyer.name}
                      style={{ width: 52, height: 52, minWidth: 52, maxWidth: 52, borderRadius: "50%", objectFit: "cover", display: "block" }}
                    />
                    <div className="min-w-0">
                      <p className="text-white font-bold truncate">{lawyer.name}</p>
                      <p className="text-amber-400 text-xs truncate">{lawyer.specialization || "General Practice"}</p>
                      {lawyer.hireCount > 0 && (
                        <p className="text-gray-500 text-xs mt-0.5">{lawyer.hireCount} hires</p>
                      )}
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── LEGAL CATEGORIES ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Browse by area
            </p>
            <h2 className="text-3xl font-black text-white">Legal Categories</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ scale: 1.04, borderColor: "rgba(245,158,11,0.4)" }}
                onClick={() => router.push(`/lawyers?specialization=${encodeURIComponent(cat.filter)}`)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10
                  bg-[#1a1a1a] p-5 hover:bg-amber-400/5 transition-colors text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-white text-sm font-semibold leading-snug">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL LAWYERS WITH PAGINATION ──────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#141414" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
                All Lawyers
              </p>
              <h2 className="text-3xl font-black text-white">Browse & Hire</h2>
            </div>
            <p className="text-gray-500 text-sm hidden md:block">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {loadingBrowse
              ? Array(LAWYERS_PER_PAGE).fill(0).map((_, i) => <LawyerCardSkeleton key={i} />)
              : browseLawyers.map((lawyer, i) => (
                  <LawyerCard key={lawyer.userId || lawyer._id} lawyer={lawyer} index={i} />
                ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold
                  text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-30
                  disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="text-gray-600 px-1">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className="w-9 h-9 rounded-xl text-sm font-bold transition"
                      style={{
                        background: currentPage === p ? "#f59e0b" : "transparent",
                        color: currentPage === p ? "#111" : "#9ca3af",
                        border: currentPage === p ? "none" : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold
                  text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-30
                  disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#111]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-12">
              <h2 className="text-4xl font-black mb-4">Ready to get legal help?</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join thousands of clients who found the right lawyer on LegalEase.
              </p>
              <button
                onClick={() => router.push("/lawyers")}
                className="rounded-xl bg-amber-400 px-10 py-4 font-bold text-gray-900
                  hover:bg-amber-300 active:scale-95 transition-all text-base"
              >
                Browse Lawyers →
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}