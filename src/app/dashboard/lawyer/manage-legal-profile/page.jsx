"use client";

import { useState, useEffect, useRef } from "react";
import { Input, Button, Card, Chip } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

const SPECIALIZATIONS = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Corporate Law",
  "Immigration Law",
  "Real Estate Law",
  "Intellectual Property",
  "Employment Law",
  "Tax Law",
  "Constitutional Law",
];

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function ManageLegalProfile() {
  const { data: session } = useSession();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "services"

  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    fee: "",
    specialization: "",
    email: "",
    image: "",
  });

  // Services state
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null); // null = not editing
  const [serviceForm, setServiceForm] = useState({
    title: "",
    specialization: "",
    fee: "",
    description: "",
  });
  const [servicesLoading, setServicesLoading] = useState(false);

  // Load existing profile
  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/lawyer/${session.user.id}`);
        const data = await res.json();
        if (data?.userId) {
          setProfile({
            name: data.name || "",
            bio: data.bio || "",
            fee: data.fee || "",
            specialization: data.specialization || "",
            email: data.email || "",
            image: data.image || "",
          });
          setServices(data.services || []);
          setIsInitialized(true);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, [session?.user?.id]);

  const handleChange = (field) => (e) =>
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));

  // imgBB upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        setProfile((prev) => ({ ...prev, image: data.data.url }));
        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed.");
      }
    } catch {
      toast.error("Error uploading image.");
    } finally {
      setImageUploading(false);
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!profile.name || !profile.specialization || !profile.fee) {
      toast.error("Please fill in Name, Specialization, and Fee.");
      return;
    }
    if (!session?.user?.id) {
      toast.error("You must be logged in.");
      return;
    }
    setLoading(true);
    try {
      const method = isInitialized ? "PATCH" : "POST";
      const res = await fetch("http://localhost:5000/api/lawyer/profile", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          userId: session.user.id,
          email: profile.email || session.user.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isInitialized ? "Profile updated!" : "Profile created!");
        setIsInitialized(true);
      } else {
        toast.error(data.message || "Failed to save profile.");
      }
    } catch {
      toast.error("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  // ── Services ──

  const handleServiceChange = (field) => (e) =>
    setServiceForm((prev) => ({ ...prev, [field]: e.target.value }));

  const resetServiceForm = () => {
    setServiceForm({ title: "", specialization: "", fee: "", description: "" });
    setEditingService(null);
  };

  const handleAddOrUpdateService = () => {
    if (!serviceForm.title || !serviceForm.specialization || !serviceForm.fee) {
      toast.error("Please fill in Title, Specialization, and Fee.");
      return;
    }

    let updated;
    if (editingService !== null) {
      updated = services.map((s, i) =>
        i === editingService ? { ...serviceForm, id: s.id } : s
      );
      toast.success("Service updated!");
    } else {
      updated = [
        ...services,
        { ...serviceForm, id: crypto.randomUUID() },
      ];
      toast.success("Service added!");
    }

    setServices(updated);
    resetServiceForm();
    saveServices(updated);
  };

  const handleEditService = (index) => {
    setServiceForm({ ...services[index] });
    setEditingService(index);
  };

  const handleDeleteService = (index) => {
    const updated = services.filter((_, i) => i !== index);
    setServices(updated);
    saveServices(updated);
    toast.success("Service removed.");
  };

  const saveServices = async (updatedServices) => {
    if (!session?.user?.id) return;
    setServicesLoading(true);
    try {
      await fetch("http://localhost:5000/api/lawyer/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          services: updatedServices,
        }),
      });
    } catch {
      toast.error("Failed to save services.");
    } finally {
      setServicesLoading(false);
    }
  };

  const inputClass = {
    inputWrapper: "bg-gray-800 border border-gray-600",
    input: "text-white",
    label: "text-gray-300",
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-5">
      <Toaster />
      <h1 className="mt-4 mb-2 text-3xl font-extrabold text-white">
        Manage Legal Profile
      </h1>
      <p className="mb-6 text-gray-400">
        Update your professional info and manage the services you offer.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10">
        {["profile", "services"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-sm font-semibold capitalize transition border-b-2 ${
              activeTab === tab
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab === "profile" ? "Profile Info" : "Manage Services"}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === "profile" && (
        <Card className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-8 shadow-xl">
          <div className="space-y-6">

            {/* Image Upload */}
            <div className="flex items-center gap-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-24 w-24 rounded-2xl border-2 border-dashed
                  border-gray-600 bg-gray-800 cursor-pointer overflow-hidden
                  hover:border-amber-400 transition flex items-center justify-center"
              >
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-gray-500">+</span>
                )}
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs text-white">Uploading…</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-semibold">Profile Photo</p>
                <p className="text-sm text-gray-400">Click to upload via imgBB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Professional Name"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={handleChange("name")}
                classNames={inputClass}
              />
              <Input
                label="Email Address"
                placeholder="your@email.com"
                value={profile.email}
                onChange={handleChange("email")}
                classNames={inputClass}
              />

              {/* Specialization */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-300">
                  Specialization
                </label>
                <select
                  className="w-full rounded-xl border border-gray-600 bg-gray-800 p-3
                    text-white focus:border-amber-400 focus:outline-none"
                  value={profile.specialization}
                  onChange={handleChange("specialization")}
                >
                  <option value="">Select Category</option>
                  {SPECIALIZATIONS.map((s, i) => (
                    <option key={`${s}-${i}`} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <Input
                type="number"
                label="Base Consultation Fee ($)"
                placeholder="0"
                value={profile.fee}
                onChange={handleChange("fee")}
                classNames={inputClass}
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-300">
                Bio / Professional Summary
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your legal expertise..."
                value={profile.bio}
                onChange={handleChange("bio")}
                className="w-full rounded-xl border border-gray-600 bg-gray-800 p-3
                  text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <Button
              isLoading={loading}
              onClick={handleSaveProfile}
              className="w-full rounded-2xl bg-amber-400 py-6 text-lg
                font-bold text-gray-900 transition hover:bg-amber-300"
            >
              {isInitialized ? "Update Profile" : "Create Profile"}
            </Button>
          </div>
        </Card>
      )}

      {/* ── SERVICES TAB ── */}
      {activeTab === "services" && (
        <div className="space-y-6">

          {/* Add / Edit Form */}
          <Card className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingService !== null ? "Edit Service" : "Add New Service"}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Service Title"
                placeholder="e.g. Criminal Defense Consultation"
                value={serviceForm.title}
                onChange={handleServiceChange("title")}
                classNames={inputClass}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-300">
                  Specialization
                </label>
                <select
                  className="w-full rounded-xl border border-gray-600 bg-gray-800 p-3
                    text-white focus:border-amber-400 focus:outline-none"
                  value={serviceForm.specialization}
                  onChange={handleServiceChange("specialization")}
                >
                  <option value="">Select Category</option>
                  {SPECIALIZATIONS.map((s, i) => (
                    <option key={`${s}-${i}`} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <Input
                type="number"
                label="Fee ($)"
                placeholder="0"
                value={serviceForm.fee}
                onChange={handleServiceChange("fee")}
                classNames={inputClass}
              />

              <Input
                label="Short Description"
                placeholder="What does this service include?"
                value={serviceForm.description}
                onChange={handleServiceChange("description")}
                classNames={inputClass}
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleAddOrUpdateService}
                isLoading={servicesLoading}
                className="rounded-xl bg-amber-400 px-6 py-2 font-bold text-gray-900 hover:bg-amber-300"
              >
                {editingService !== null ? "Update Service" : "Add Service"}
              </Button>
              {editingService !== null && (
                <Button
                  onClick={resetServiceForm}
                  className="rounded-xl bg-gray-700 px-6 py-2 font-bold text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
              )}
            </div>
          </Card>

          {/* Services Table */}
          <Card className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">
              Your Services ({services.length})
            </h2>

            {services.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No services added yet. Add your first service above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="pb-3 pr-4 font-semibold">#</th>
                      <th className="pb-3 pr-4 font-semibold">Title</th>
                      <th className="pb-3 pr-4 font-semibold">Specialization</th>
                      <th className="pb-3 pr-4 font-semibold">Fee</th>
                      <th className="pb-3 pr-4 font-semibold">Description</th>
                      <th className="pb-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr
                        key={service.id}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="py-3 pr-4 text-gray-500">{index + 1}</td>
                        <td className="py-3 pr-4 text-white font-medium">
                          {service.title}
                        </td>
                        <td className="py-3 pr-4">
                          <Chip
                            size="sm"
                            className="bg-amber-400/10 text-amber-400 border border-amber-400/20"
                          >
                            {service.specialization}
                          </Chip>
                        </td>
                        <td className="py-3 pr-4 text-green-400 font-semibold">
                          ${service.fee}
                        </td>
                        <td className="py-3 pr-4 text-gray-400 max-w-[200px] truncate">
                          {service.description || "—"}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditService(index)}
                              className="text-xs px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400
                                border border-blue-500/20 hover:bg-blue-500/20 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteService(index)}
                              className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400
                                border border-red-500/20 hover:bg-red-500/20 transition"
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
            )}
          </Card>
        </div>
      )}
    </div>
  );
}