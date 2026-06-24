"use client";

import Link from "next/link";
import { Input, Button } from "@heroui/react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0B0F] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          
          {/* Branding */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-amber-400" />
              <span className="text-xl font-bold text-white">LegalEase</span>
            </Link>
            <p className="max-w-xs text-gray-400 text-sm">
              Connecting you with expert legal counsel. Professional, secure, and accessible legal aid for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-amber-400 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-xs text-gray-500 mb-4">Stay updated with legal news.</p>
            <div className="flex flex-col gap-2">
              <Input 
                placeholder="Enter your email" 
                size="sm" 
                classNames={{ inputWrapper: "bg-white/5 border border-white/10" }}
              />
              <Button size="sm" className="bg-white/10 text-white hover:bg-white/20">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LegalEase. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-400">
            {/* Dummy Social Links */}
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
            <a href="#" className="hover:text-white transition">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}