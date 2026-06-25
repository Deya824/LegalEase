"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Something went wrong!
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        An unexpected error has occurred.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-500"
      >
        Try again
      </button>
    </div>
  );
}