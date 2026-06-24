"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Input } from "@heroui/react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeSlash, Person, At, ShieldKeyhole } from "@gravity-ui/icons";
import { signUp, useSession } from "@/lib/auth-client";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';
    const { data: session } = useSession();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect logged in users
    useEffect(() => {
        if (session) {
            router.push(`/auth/select-role?redirect=${encodeURIComponent(redirectTo)}`);
        }
    }, [session, router, redirectTo]);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await signUp.email({
                email,
                password,
                name,
            });

            if (error) {
                toast.error(error.message || "Failed to create account");
            } else {
                toast.success("Account created! Choosing role...");
                router.push(`/auth/select-role?redirect=${encodeURIComponent(redirectTo)}`);
            }
        } catch (err) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0B0B0F] px-4">
            <Toaster position="top-right" />
            <Card className="w-full max-w-md p-8 border border-white/10 bg-[#1e293b] shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-white">Create an account</h1>
                </div>
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} startContent={<Person className="text-gray-400" />} />
                    <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} startContent={<At className="text-gray-400" />} />
                    <Input label="Password" type={isVisible ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} startContent={<ShieldKeyhole className="text-gray-400" />} endContent={
                        <button type="button" onClick={toggleVisibility}>{isVisible ? <EyeSlash /> : <Eye />}</button>
                    } />
                    <Input label="Confirm Password" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} startContent={<ShieldKeyhole className="text-gray-400" />} />

                    <Button type="submit" isLoading={isLoading} className="w-full bg-amber-400 font-bold text-black mt-4">
                        Sign Up
                    </Button>
                </form>
            </Card>
        </div>
    );
}