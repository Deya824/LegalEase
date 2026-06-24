"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0B0B0F] px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-6 flex justify-center">
            {/* You can replace this with a professional icon or logo */}
            <div className="rounded-full border border-white/10 bg-white/5 p-3">
              <span className="text-4xl">⚖️</span>
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
            Find & Hire <br />
            <span className="text-amber-400">Expert Legal Counsel</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
            Democratizing access to justice. Browse our vetted database of legal 
            experts and secure the representation you deserve with total transparency.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
             
              radius="full"
              className="h-14 w-full bg-amber-400 px-10 text-base font-bold text-gray-900 transition hover:bg-amber-300 sm:w-auto"
            >
                <Link href="/lawyers">Browse Lawyers</Link>
             
            </Button>
            <Button
              as={Link}
              href="/about"
              variant="bordered"
              radius="full"
              className="h-14 w-full border-white/20 px-10 text-base font-semibold text-white transition hover:bg-white/5 sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}