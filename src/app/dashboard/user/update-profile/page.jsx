"use client";

import { useState } from 'react';
import { authClient, useSession } from "@/lib/auth-client";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function UpdateProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [image, setImage] = useState(session?.user?.image || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure session.user.id exists
    if (!session?.user?.id) {
        toast.error("User not authenticated");
        setIsSubmitting(false);
        return;
    }
 const {data:token}=await authClient.token();
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/update-user`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`
      },
      body: JSON.stringify({ 
        userId: session.user.id, // Sending ID to identify the user
        name, 
        image 
      })
    });

    if (res.ok) {
      toast.success("Profile updated successfully!");
      router.refresh();
    } else {
      toast.error("Failed to update profile");
    }
    setIsSubmitting(false);
};

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Update Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-lg border border-white/10">
        
        <div>
          <label className="block text-sm font-bold text-white mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">Profile Picture URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {image && (
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-400">Preview:</p>
            <img src={image} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-white/10" />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>

      </form>
    </div>
  );
}