"use client";

import { useEffect, useState } from 'react';
import { useSession } from "@/lib/auth-client";
import toast from 'react-hot-toast';
import {authClient} from "@/lib/auth-client";

export default function MyCommentsPage() {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchComments();
  }, [session]);

  const fetchComments = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/user/${session.user.id}`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleUpdate = async (id) => {
    const {data:token}=await authClient.token();
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`
      },
      body: JSON.stringify({ text: editText })
    });

    if (res.ok) {
      toast.success("Comment updated!");
      setComments(prev => prev.map(c => c._id === id ? { ...c, text: editText } : c));
      setEditingId(null);
    } else {
      toast.error("Failed to update comment");
    }
  };


  const handleDelete = async (id) => {
      const {data:token}=await authClient.token();
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    });

    if (res.ok) {
      toast.success("Comment deleted!");
      setComments(prev => prev.filter(c => c._id !== id));
    } else {
      toast.error("Failed to delete comment");
    }
  };

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">My Comments</h1>

      {comments.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <p className="text-gray-400">You haven't posted any comments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white/5 border border-white/10 rounded-lg p-5">

              <p className="text-amber-400 font-bold text-sm mb-2">{comment.lawyerName || "Lawyer Profile"}</p>

              {editingId === comment._id ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(comment._id)}
                      className="px-4 py-2 bg-amber-400 text-black font-bold rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white mb-3">{comment.text}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg text-sm hover:bg-white/20 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}