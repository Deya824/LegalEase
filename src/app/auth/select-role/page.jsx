"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Label } from "@heroui/react";

import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

export default function SelectRolePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const [role, setRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleSelection = async () => {
        setIsLoading(true);
        try {
            const response = await authClient.updateUser({
                role: role
            });

            if (response?.error) {
                console.error("Auth API Error:", response.error);
                toast.error("Error: " + response.error.message);
            } else {
                toast.success("Role updated successfully!");
                router.push(`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`);
            }
        } catch (err) {
            console.error("Update Request Failed:", err);
            toast.error("Failed to update role. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0B0B0F] px-4">
            <Toaster />
            <Card className="w-full max-w-md p-8 border border-white/10 bg-[#1e293b]">
                <h1 className="text-xl font-bold text-white mb-6">Who are you?</h1>
                <div className="flex flex-col gap-4">
                    <Label className="text-sm font-medium text-zinc-300">Choose your role</Label>
                    <div className="flex flex-col gap-4">
                        <div
                            onClick={() => setRole("user")}
                            className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border ${role === "user" ? "border-amber-400 bg-white/5" : "border-white/10"}`}
                        >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${role === "user" ? "border-amber-400" : "border-white"}`}>
                                {role === "user" && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                            </div>
                            <span className="text-white">User</span>
                        </div>

                        <div
                            onClick={() => setRole("lawyer")}
                            className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border ${role === "lawyer" ? "border-amber-400 bg-white/5" : "border-white/10"}`}
                        >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${role === "lawyer" ? "border-amber-400" : "border-white"}`}>
                                {role === "lawyer" && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                            </div>
                            <span className="text-white">Lawyer</span>
                        </div>
                    </div>
                </div>
                <Button isLoading={isLoading} onClick={handleRoleSelection} className="w-full bg-amber-400 font-bold text-black mt-6">
                    Complete Registration
                </Button>
            </Card>
        </div>
    );
}