"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const role = session?.user?.role;
  const pathname = usePathname();

  const getLinkStyle = (href) => 
    pathname === href 
      ? "text-amber-400 font-bold border-l-2 border-amber-400 pl-4 py-2" 
      : "text-white hover:text-amber-400 pl-4 py-2";

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-screen bg-[#0B0B0F] items-center justify-center">
        <p className="text-white font-bold">Loading...</p>
      </div>
    );
  }

  const getPortalTitle = () => {
    if (role === 'lawyer') return 'Lawyer Portal';
    if (role === 'admin') return 'Admin Portal';
    return 'User Portal';
  };

  return (
    <div className="flex min-h-screen bg-[#0B0B0F]">
      <aside className="w-64 border-r border-white/10 p-6 bg-[#1e293b]">
        <h2 className="text-amber-400 font-bold mb-8 uppercase tracking-widest text-xs">
          {getPortalTitle()}
        </h2>
        
        <nav className="flex flex-col gap-2">
          {role === "user" && (
            <>
              <Link href="/dashboard/user/hiring-history" className={getLinkStyle("/dashboard/user/hiring-history")}>Hiring History</Link>
              <Link href="/dashboard/user/transactions" className={getLinkStyle("/dashboard/user/transactions")}>Transaction History</Link>
              <Link href="/dashboard/user/update-profile" className={getLinkStyle("/dashboard/user/update-profile")}>Update Profile</Link>
              <Link href="/dashboard/user/comments" className={getLinkStyle("/dashboard/user/comments")}>My Comments</Link>
            </>
          )}

          {role === "lawyer" && (
            <>
              <Link href="/dashboard/lawyer/hiring-history" className={getLinkStyle("/dashboard/lawyer/hiring-history")}>Manage Requests</Link>
              <Link href="/dashboard/lawyer/transactions" className={getLinkStyle("/dashboard/lawyer/transactions")}>Transaction History</Link>
              <Link href="/dashboard/lawyer/manage-legal-profile" className={getLinkStyle("/dashboard/lawyer/manage-legal-profile")}>Manage Services</Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link href="/dashboard/admin/manage-users" className={getLinkStyle("/dashboard/admin/manage-users")}>Manage Users</Link>
              <Link href="/dashboard/admin/all-transactions" className={getLinkStyle("/dashboard/admin/all-transactions")}>All Transactions</Link>
              <Link href="/dashboard/admin/analytics" className={getLinkStyle("/dashboard/admin/analytics")}>Analytics</Link>
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1 p-8 text-white">
        {children}
      </main>
    </div>
  );
}