"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { Bars, Xmark } from "@gravity-ui/icons";
import { useSession, signOut } from "@/lib/auth-client";

const ScalesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 6l7-3 7 3M4 9l3 6H1l3-6zm16 0l3 6h-6l3-6zM3 21h18" />
  </svg>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Lawyers", href: "/lawyers" },
  ];

  const getLinkClass = (href) =>
    pathname === href
      ? "rounded-full px-4 py-2 text-sm font-semibold text-amber-400"
      : "rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition hover:text-white";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 shadow-lg">
            <ScalesIcon />
          </div>
          <h1 className="text-lg font-bold text-white hidden sm:block">Legal<span className="text-amber-400">Ease</span></h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={getLinkClass(link.href)}>{link.label}</Link>
              </li>
            ))}

            {/* Dashboard Link */}
            {user && (
              <li>
                <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Auth Section */}
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            {isPending ? (
              <span className="text-sm text-gray-500">Loading...</span>
            ) : user ? (
              <>
                <div className="flex flex-col items-end leading-none">
                  <span className="text-sm font-medium text-white">Hi, {user.name}</span>
                  {user.role && (
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${
                      user.role === "admin" ? "text-red-400" : "text-amber-400"
                    }`}>
                      ({user.role})
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="bordered"
                  onClick={handleSignOut}
                  className="border-white/20 text-gray-300 hover:text-red-400"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-sm font-medium text-amber-400 hover:text-amber-300">Login</Link>
                <Link href="/auth/signup" className="text-sm font-medium text-amber-400 hover:text-amber-300">Register</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white">
          {isMenuOpen ? <Xmark className="h-6 w-6" /> : <Bars className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile Menu Dropdown */}
{isMenuOpen && (
  <div className="md:hidden border-t border-white/10 bg-[#0B0B0F]/95 px-4 py-4 flex flex-col gap-3">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setIsMenuOpen(false)}
        className={getLinkClass(link.href)}
      >
        {link.label}
      </Link>
    ))}

    {user && (
      <Link
        href="/dashboard"
        onClick={() => setIsMenuOpen(false)}
        className={getLinkClass("/dashboard")}
      >
        Dashboard
      </Link>
    )}

    <div className="border-t border-white/10 pt-3 mt-1">
      {isPending ? (
        <span className="text-sm text-gray-500">Loading...</span>
      ) : user ? (
        <div className="flex items-center justify-between">
          <div className="flex flex-col leading-none">
            <span className="text-sm font-medium text-white">Hi, {user.name}</span>
            {user.role && (
              <span className={`text-[10px] uppercase tracking-wider font-bold ${
                user.role === "admin" ? "text-red-400" : "text-amber-400"
              }`}>
                ({user.role})
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="bordered"
            onClick={handleSignOut}
            className="border-white/20 text-gray-300 hover:text-red-400"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-amber-400">Login</Link>
          <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-amber-400">Register</Link>
        </div>
      )}
    </div>
  </div>
)}
    </nav>
  );
}