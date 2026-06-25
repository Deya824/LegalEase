"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client'; // adjust path to your better-auth client

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Helper: get JWT token from better-auth
  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token ?? null;
  };

  // Helper: build auth headers
  const authHeaders = async () => {
   const { data: token } = await authClient.token();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token.token}` } : {}),
    };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const headers = await authHeaders();
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`, { headers });
      if (res.status === 401 || res.status === 403) {
        toast.error("Access denied");
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    const headers = await authHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      toast.success("Role updated!");
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      setEditingId(null);
    } else {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const headers = await authHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (res.ok) {
      toast.success("User deleted!");
      setUsers(prev => prev.filter(u => u._id !== id));
    } else {
      toast.error("Failed to delete user");
    }
  };

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Manage Users</h1>
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-white/5">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  {editingId === user._id ? (
                    <select
                      defaultValue={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      <option value="user">User</option>
                      <option value="lawyer">Lawyer</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="capitalize px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      {user.role || 'user'}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(editingId === user._id ? null : user._id)}
                      className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg text-sm hover:bg-white/20 transition-colors"
                    >
                      {editingId === user._id ? "Cancel" : "Change Role"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}