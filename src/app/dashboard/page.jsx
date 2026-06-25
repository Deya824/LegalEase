"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const role = session?.user?.role;

  useEffect(() => {
  if (isPending) return;

 if (!session?.user && !isPending) {
  setTimeout(() => {
    router.replace("/auth/signin");
  }, 500);

  return;
}

  const role = session.user.role;

  if (!role) {
    return;   // wait until role exists
  }

  if (role === "admin") {
    router.replace("/dashboard/admin/manage-users");
  } 
  else if (role === "lawyer") {
    router.replace("/dashboard/lawyer/hiring-history");
  } 
  else if (role === "user") {
    router.replace("/dashboard/user/hiring-history");
  }

}, [session, isPending, router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0F]">
      <p className="text-white font-bold">Loading dashboard...</p>
    </div>
  );
}