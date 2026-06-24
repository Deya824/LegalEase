"use client";

import { useState, useEffect } from 'react';
import { useSession } from "@/lib/auth-client";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LawyerComments({ lawyer }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasHired, setHasHired] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !lawyer?.userId) {
      setIsChecking(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire/check/${lawyer.userId}/${session.user.id}`)
      .then(res => res.json())
      .then(data => {
        setHasHired(data.hasHired);
        setIsChecking(false);
      })
      .catch(() => setIsChecking(false));
  }, [session, lawyer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login to comment!");
      router.push(`/auth/signin?redirect=/lawyers/${lawyer.userId}`);
      return;
    }

    setIsSubmitting(true);

    const commentData = {
      lawyerId: lawyer.userId,
      lawyerName: lawyer.name,
      userId: session.user.id,
      userName: session.user.name,
      text: newComment,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });

    if (res.ok) {
      setNewComment('');
      toast.success("Comment added! View it in your dashboard.");
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to add comment");
    }
    setIsSubmitting(false);
  };

  if (isChecking) return null;

  if (!session?.user) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 mt-6">
        <p className="text-gray-400 text-sm">
          Please{" "}
          <span
            className="text-amber-400 cursor-pointer font-semibold"
            onClick={() => router.push(`/auth/signin?redirect=/lawyers/${lawyer.userId}`)}
          >
            login
          </span>{" "}
          to leave a comment.
        </p>
      </div>
    );
  }

  if (!hasHired) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 mt-6">
        <p className="text-gray-400 text-sm">
          Only clients who have hired {lawyer.name.split(" ")[0]} can leave a comment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Leave a Comment</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your experience with this lawyer..."
          required
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 px-6 py-2 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}