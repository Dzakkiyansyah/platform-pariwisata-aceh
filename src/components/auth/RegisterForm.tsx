// src/components/auth/RegisterForm.tsx
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.");
        }
        setIsLoading(false);
    };
    
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Bergabung dengan Platform</CardTitle>
                <CardDescription>
                    Masukkan data di bawah untuk mendaftar sebagai wisatawan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp} className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="full-name">Nama Lengkap</label>
                        <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="email">Email</label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="password">Password</label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Mendaftar..." : "Buat Akun"}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="underline">Login</Link>
                </div>
            </CardContent>
        </Card>
    )
}