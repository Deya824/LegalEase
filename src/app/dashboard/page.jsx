import { redirect } from 'next/navigation';
import { auth } from "@/lib/auth"; // Import your server-side auth
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/auth/signin");

  // Redirect based on role
  if (session.user.role === "lawyer") {
    redirect("/dashboard/lawyer/hiring-history");
  } else {
    redirect("/dashboard/user/hiring-history");
  }
}